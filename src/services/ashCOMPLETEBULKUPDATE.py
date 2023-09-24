import os
import configparser
import hashlib
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_cors import CORS
from models import InsuranceCompany, User, MagicPillPlan
from process_data import process_user_data, process_drug_data
from models import Admin

from datetime import datetime
import logging
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from email_validator import validate_email, EmailNotValidError


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['WTF_CSRF_ENABLED'] = False

config = configparser.ConfigParser()
config.read("config.ini")
db_host = config["database"]["host"]
db_port = config["database"]["port"]
db_name = config["database"]["database"]
db_user = config["database"]["username"]
db_password = config["database"]["password"]

upload_folder = config["DEFAULT"]["uploads"]
changelog_folder = config["DEFAULT"]["changelog"]

db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
engine = create_engine(db_url, pool_pre_ping=True)
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
app.config['UPLOAD_FOLDER'] = upload_folder
app.secret_key = "super secret key"

temporary_storage = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.teardown_appcontext
def cleanup(resp_or_exc):
    Session.remove()

@app.errorhandler(400)
def bad_request_error(e):
    return jsonify(error="Bad Request", message=str(e)), 400

@app.errorhandler(404)
def not_found_error(e):
    return jsonify(error="Not Found", message=str(e)), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error="Internal Server Error", message=str(e)), 500

# BULK UPLOAD

@app.route("/user/bulk", methods=["POST"])
def bulk_user_operations():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify(results=[{"error": "Bad Request", "message": "Data should be a list of user operations."}]), 400

    results = []
    user_insert_mappings = []
    user_update_mappings = []
    user_toggle_mappings = []

    for operation in data:
        action = operation.get("action")
        
        if action == "add":
            handle_add_action(operation, results, user_insert_mappings)
        elif action == "update":
            handle_update_action(operation, results, user_update_mappings)
        elif action == "toggle":
            handle_toggle_action(operation, results, user_toggle_mappings)
        else:
            results.append({"error": "Unknown Action", "message": f"Unknown action received: {action}"})

    perform_bulk_operations(User, results, user_insert_mappings, user_update_mappings, user_toggle_mappings)

    return jsonify(results=results)


def handle_add_action(operation, results, user_insert_mappings):
    validation_result = validate_user_data(operation["user_data"], "add")
    if "error" in validation_result:
        results.append(validation_result)
    else:
        user_insert_mappings.append(operation["user_data"])

def handle_update_action(operation, results, user_update_mappings):
    validation_result = validate_user_data(operation["user_data"], "update")
    if "error" in validation_result:
        results.append(validation_result)
    else:
        user_id = operation["user_data"].get("user_id")  # Moved inside user_data
        with Session() as session:
            user = session.query(User).filter_by(user_id=user_id).first()
            if user:
                user_update_mappings.append(operation["user_data"])
            else:
                results.append({"error": "User Not Found", "message": f"User with ID {user_id} not found."})

def handle_toggle_action(operation, results, user_toggle_mappings):
    validation_result = validate_user_data(operation["user_data"], "toggle")
    if "error" in validation_result:
        results.append(validation_result)
    else:
        user_id = operation["user_data"].get("user_id")  # Moved inside user_data
        with Session() as session:
            user = session.query(User).filter_by(user_id=user_id).first()
            if user:
                user_toggle_mappings.append({"user_id": user_id, "is_active": not user.is_active})
            else:
                results.append({"error": "User Not Found", "message": f"User with ID {user_id} not found."})

def perform_bulk_operations(model, results, inserts, updates, toggles):
    bulk_ops = [
        (inserts, "added", Session.bulk_insert_mappings),
        (updates, "updated", Session.bulk_update_mappings),
        (toggles, "toggled", Session.bulk_update_mappings)
    ]
    try:
        with Session() as session:
            for ops, message, method in bulk_ops:
                if ops:
                    method(model, ops)
                    results.extend([{"success": True, "message": f"User {message} successfully"} for _ in ops])
                    session.commit()
    except IntegrityError as e:
        logging.error(f"Database Integrity Error: {str(e)}")
        results.extend([{"error": "Database Integrity Error", "message": str(e)} for _ in ops])
    except SQLAlchemyError as e:
        logging.error(f"Database Error: {str(e)}")
        results.extend([{"error": "Database Error", "message": str(e)} for _ in ops])


def validate_user_data(data, action):
    if action in ["update", "toggle"] and "user_id" not in data:
        return {"error": "Bad Request", "message": "'user_id' is required for update and toggle operations."}

    required_fields = {
        "username": str,
        "email": str,
        "first_name": str,
        "last_name": str,
        "phone": str,
        "address": str,
        "dob": str,
        "insurance_company_id": int,
        "magic_pill_plan_id": int,
        "is_active": bool,
        "is_dependent": bool
    }
    
    for field, expected_type in required_fields.items():
        value = data.get(field)
        if value is None:
            return {"error": "Bad Request", "message": f"'{field}' is required."}
        if not isinstance(value, expected_type):
            return {"error": "Bad Request", "message": f"'{field}' should be of type {expected_type.__name__}."}

    with Session() as session:
        insurance_company = session.get(InsuranceCompany, data["insurance_company_id"])
        magic_pill_plan = session.get(MagicPillPlan, data["magic_pill_plan_id"])

        if not magic_pill_plan:
            return {"error": "Not Found", "message": "Provided Magic Pill Plan ID not found."}

        if not insurance_company:
            return {"error": "Not Found", "message": "Insurance company not found."}

    return {}

@app.route("/company", methods=["GET"])
def get_all_companies():
    insurance_companies = Session.query(InsuranceCompany).all()
    return jsonify(results=[company.serialize() for company in insurance_companies])

@app.route("/company/<company_id>", methods=["GET"])
def company(company_id):
    insurance_company = Session.query(InsuranceCompany).get(company_id)
    if not insurance_company:
        return jsonify(results=[{"error": "Not Found", "message": "Company not found."}]), 404
    users = Session.query(User).filter_by(insurance_company_id=company_id).all()
    return jsonify(results=[
        {
            "company": insurance_company.serialize(),
            "users": [user.serialize_full() for user in users]  # Serialize with all attributes
        }
    ])
# USER ROUTES

@app.route("/user/add", methods=["POST"])
def add_user():
    data = request.get_json()

    # Manual validation
    if not data:
        return jsonify(results=[{"error": "Bad Request", "message": "No data provided."}]), 400

    required_fields = [ "username", "email", "insurance_company_id", "magic_pill_plan_id", "is_active", 
        "address", "dob", "first_name", "last_name", "phone", "is_dependent"]

    for field in required_fields:
        if field not in data:
            return jsonify(results=[{"error": "Bad Request", "message": f"'{field}' is required."}]), 400

    # Check for the existence of the referenced insurance company and magic pill plan
    insurance_company = Session.query(InsuranceCompany).get(data["insurance_company_id"])
    magic_pill_plan = Session.query(MagicPillPlan).get(data["magic_pill_plan_id"])

    if not insurance_company or not magic_pill_plan:
        return jsonify(results=[{"error": "Not Found", "message": "Insurance company or Magic Pill Plan not found."}]), 404

    # Create the new user with required and optional fields
    new_user = User(
        username=data["username"],
        email=data["email"],
        insurance_company_id=data["insurance_company_id"],
        magic_pill_plan_id=data["magic_pill_plan_id"],
        is_active=data["is_active"],
        dob=data.get("dob"),
        company=data.get("company"),
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        phone=data.get("phone"),
	    is_dependent=data["is_dependent"], #change to is_dependant later potentially
        address=data.get("address")
    )

    try:
        with Session() as session:
            session.add(new_user)
            session.commit()
        return jsonify(results=[{"success": True, "message": "User added successfully"}])
    except exc.IntegrityError as e:
        return jsonify(results=[{"error": "Database Integrity Error", "message": str(e)}]), 500
    except exc.SQLAlchemyError as e:
        return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500


@app.route("/user/update/<user_id>", methods=["POST"])
def update_user(user_id):
    data = request.get_json()

    with Session() as session:
        user = session.query(User).get(user_id)
        if not user:
            return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404

        user.username = data.get("username")
        user.email = data.get("email")
        user.insurance_company_id = data.get("insurance_company_id")
        user.magic_pill_plan_id = data.get("magic_pill_plan_id")
        user.is_active = data.get("is_active")
        user.address = data.get("address")
        user.dob = data.get("dob")
        user.company = data.get("company")
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.phone = data.get("phone")
        user.is_dependent =data.get("is_dependent")

        try:
            session.commit()
            return jsonify(results=[{"success": True, "message": "User updated successfully", "user": user.serialize_full()}])
        except exc.SQLAlchemyError as e:
            session.rollback()
            return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500

@app.route("/user/toggle/<user_id>", methods=["POST"])
def toggle_user(user_id):
    with Session() as session:
        user = session.query(User).get(user_id)
        if not user:
            return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404
        user.is_active = not user.is_active
        try:
            session.commit()
            return jsonify(results=[{"success": True, "message": "User status toggled successfully", "is_active": user.is_active}])
        except exc.SQLAlchemyError as e:
            session.rollback()
            return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500

    
@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    user = Session.query(User).get(user_id)
    if not user:
        return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404
    return jsonify(results=[user.serialize_full()])  # Serialize with all attributes

# ADMIN ROUTES
@app.route("/admins", methods=["GET"])
def get_all_admins():
    with Session() as session:
        admins = session.query(Admin).all()
    return jsonify([admin.serialize() for admin in admins])

@app.route("/admins/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    return jsonify(admin.serialize())
@app.route("/admins", methods=["POST"])
def create_admin():
    data = request.json
    new_admin = Admin(
        admin_username=data.get('admin_username'),
        admin_email=data.get('admin_email'),
        insurance_company_id=data.get('insurance_company_id')
    )
    session.add(new_admin)
    session.commit()
    return jsonify(new_admin.serialize()), 201
@app.route("/admins/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    data = request.json
    admin.admin_username = data.get('admin_username', admin.admin_username)
    admin.admin_email = data.get('admin_email', admin.admin_email)
    admin.insurance_company_id = data.get('insurance_company_id', admin.insurance_company_id)
    session.commit()
    return jsonify(admin.serialize())

@app.route("/admins/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    session.delete(admin)
    session.commit()
    return jsonify({"message": "Admin deleted successfully"}), 200


@app.route("/admin/<int:admin_id>/insurance-companies", methods=["GET"])
def get_insurance_companies_by_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    # Assuming a relationship exists in your Admin model named `insurance_companies`
    insurance_companies = [company.serialize() for company in admin.insurance_companies]
    return jsonify(insurance_companies)


@app.route("/admin/<int:admin_id>/add-insurance-company", methods=["POST"])
def add_insurance_company_to_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    
    data = request.json
    company_id = data.get('company_id')
    insurance_company = session.query(InsuranceCompany).get(company_id)
    
    if not insurance_company:
        return jsonify({"error": "Insurance company not found"}), 404
    
    admin.insurance_companies.append(insurance_company)
    session.commit()
    return jsonify({"success": "Insurance company added to admin"}), 201


@app.route("/admin/<int:admin_id>/remove-insurance-company", methods=["POST"])
def remove_insurance_company_from_admin(admin_id):
    with Session() as session:
        admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    
    data = request.json
    company_id = data.get('company_id')
    insurance_company = session.query(InsuranceCompany).get(company_id)
    
    if not insurance_company:
        return jsonify({"error": "Insurance company not found"}), 404
    
    if insurance_company in admin.insurance_companies:
        admin.insurance_companies.remove(insurance_company)
        session.commit()
        return jsonify({"success": "Insurance company removed from admin"}), 201
    else:
        return jsonify({"error": "Insurance company not associated with admin"}), 400

@app.route("/admins/email/<admin_email>", methods=["GET"])
def get_admin_by_email(admin_email):
    with Session() as session:
        admin = session.query(Admin).filter_by(admin_email=admin_email).first()
    
    if admin:
        return jsonify({
            "exists": True, 
	    "admin_id": admin.admin_id,
            "email": admin.admin_email,
            "username": admin.admin_username,
            "company_id": admin.insurance_company_id
        })
    else:
        return jsonify({"exists": False})
    
    # Plans
@app.route("/plans", methods=["GET"])
def get_all_magic_pill_plans():
    magic_pill_plans = Session.query(MagicPillPlan).all()
    return jsonify(results=[plan.serialize() for plan in magic_pill_plans])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
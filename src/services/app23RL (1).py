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

    for user_data in data:
        action = user_data.get("action")
        user_id = user_data.get("user_id")
        if action == "add":
            result = add_single_user(user_data)
            results.append(result)
        elif action == "update":
            result = update_single_user(user_id, user_data)
            results.append(result)
        elif action == "toggle":
            result = toggle_single_user(user_id)
            results.append(result)
        # Add more actions as needed...
        else:
            results.append({"error": "Unsupported Action", "message": f"Action '{action}' is not supported."})

    return jsonify(results=results)

def add_single_user(data):
    # Manual validation
    required_fields = [ "username", "email", "insurance_company_id", "plan_name", "is_active", 
        "address", "dob", "company", "first_name", "last_name", "phone", "is_dependant"]

    for field in required_fields:
        if field not in data:
            return {"error": "Bad Request", "message": f"'{field}' is required."}

    # Check for the existence of the referenced insurance company and magic pill plan
    insurance_company = Session.query(InsuranceCompany).get(data["insurance_company_id"])
    magic_pill_plan = Session.query(MagicPillPlan).get(data["magic_pill_plan_id"])

    if not insurance_company or not magic_pill_plan:
        return {"error": "Not Found", "message": "Insurance company or Magic Pill Plan not found."}

    # Create the new user
    new_user = User(
        username=data["username"],
        email=data["email"],
        insurance_company_id=data["insurance_company_id"],
        magic_pill_plan_id=data["magic_pill_plan_id"],
        is_active=data["is_active"],
        dob=data.get("dob"),
        age=data.get("age"),
        company=data.get("company"),
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        phone=data.get("phone"),
	is_dependent=data["is_dependent"]
    )

    # Add to the session and attempt to commit
    Session.add(new_user)
    try:
        Session.commit()
        return {"success": True, "message": "User added successfully"}
    except exc.IntegrityError as e:
        Session.rollback()
        return {"error": "Database Integrity Error", "message": str(e)}
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return {"error": "Database Error", "message": str(e)}

def update_single_user(user_id, data):
    user = Session.query(User).get(user_id)
    if not user:
        return {"error": "Not Found", "message": "User not found."}
    
    for field, value in data.items():
        if hasattr(user, field) and field != "action" and field != "user_id":
            setattr(user, field, value)

    try:
        Session.commit()
        return {"success": True, "message": "User updated successfully", "user": user.serialize_full()}
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return {"error": "Database Error", "message": str(e)}

def toggle_single_user(user_id):
    user = Session.query(User).get(user_id)
    if not user:
        return {"error": "Not Found", "message": "User not found."}
    
    user.is_active = not user.is_active
    
    try:
        Session.commit()
        return {"success": True, "message": "User status toggled successfully"}
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return {"error": "Database Error", "message": str(e)}


# login method (not in use) Route

@app.route("/", methods=["POST"])
def landing():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'your_password_salt', 100000)
    user = Session.query(User).filter_by(username=username, password=hashed_password).first()
    if user:
        return jsonify(results=[{"success": True, "message": "Authentication successful"}])
    else:
        return jsonify(results=[{"success": False, "message": "Invalid credentials"}]), 401


# Company Route


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

    required_fields = [ "username", "email", "insurance_company_id", "plan_name", "is_active", 
        "address", "dob", "company", "first_name", "last_name", "phone", "is_dependant"]

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
	is_dependent=data["is_dependent"]
    )

    # Add to the session and attempt to commit
    Session.add(new_user)
    try:
        Session.commit()
        return jsonify(results=[{"success": True, "message": "User added successfully"}])
    except exc.IntegrityError as e:
        Session.rollback()
        return jsonify(results=[{"error": "Database Integrity Error", "message": str(e)}]), 500
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500


@app.route("/user/update/<user_id>", methods=["POST"])
def update_user(user_id):
    user = Session.query(User).get(user_id)
    if not user:
        return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404
    
    data = request.get_json()
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
        Session.commit()
        return jsonify(results=[{"success": True, "message": "User updated successfully", "user": user.serialize_full()}])
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500


@app.route("/user/toggle/<user_id>", methods=["POST"])
def toggle_user(user_id):
    user = Session.query(User).get(user_id)
    if not user:
        return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404
    user.is_active = not user.is_active
    try:
        Session.commit()
    except exc.SQLAlchemyError as e:
        Session.rollback()
        return jsonify(results=[{"error": "Database Error", "message": str(e)}]), 500
    return jsonify(results=[{"success": True, "message": "User status toggled successfully"}])

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    user = Session.query(User).get(user_id)
    if not user:
        return jsonify(results=[{"error": "Not Found", "message": "User not found."}]), 404
    return jsonify(results=[user.serialize_full()])  # Serialize with all attributes



# ADMIN ROUTES

@app.route("/admins", methods=["GET"])
def get_all_admins():
    admins = session.query(Admin).all()
    return jsonify([admin.serialize() for admin in admins])

@app.route("/admins/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
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
    admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    session.delete(admin)
    session.commit()
    return jsonify({"message": "Admin deleted successfully"}), 200


@app.route("/admin/<int:admin_id>/insurance-companies", methods=["GET"])
def get_insurance_companies_by_admin(admin_id):
    admin = session.query(Admin).get(admin_id)
    if admin is None:
        return jsonify({"error": "Admin not found"}), 404
    # Assuming a relationship exists in your Admin model named `insurance_companies`
    insurance_companies = [company.serialize() for company in admin.insurance_companies]
    return jsonify(insurance_companies)


@app.route("/admin/<int:admin_id>/add-insurance-company", methods=["POST"])
def add_insurance_company_to_admin(admin_id):
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
    admin = Session.query(Admin).filter_by(admin_email=admin_email).first()
    
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
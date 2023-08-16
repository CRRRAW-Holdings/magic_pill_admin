# Import necessary libraries and modules
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

# Initialize the Flask application
app = Flask(__name__)
# Set up CORS to allow requests from the specified origin
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Disable CSRF protection for simplicity (in production, consider enabling and managing it properly)
app.config['WTF_CSRF_ENABLED'] = False

# Read the configuration details from config.ini
config = configparser.ConfigParser()
config.read("config.ini")
db_host = config["database"]["host"]
db_port = config["database"]["port"]
db_name = config["database"]["database"]
db_user = config["database"]["username"]
db_password = config["database"]["password"]

upload_folder = config["DEFAULT"]["uploads"]
changelog_folder = config["DEFAULT"]["changelog"]

# Construct the database URL
db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
engine = create_engine(db_url, pool_pre_ping=True)
session_factory = sessionmaker(bind=engine)
# Scoped sessions ensure thread-safety
Session = scoped_session(session_factory)

# Define allowed file extensions for uploads
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
app.config['UPLOAD_FOLDER'] = upload_folder
# Secret key for Flask session management
app.secret_key = "super secret key"

# A dictionary for storing temporary data
temporary_storage = {}

# Check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Teardown and clean up the session after each request
@app.teardown_appcontext
def cleanup(resp_or_exc):
    Session.remove()

# Custom error handlers
@app.errorhandler(400)
def bad_request_error(e):
    return jsonify(error="Bad Request", message=str(e)), 400

@app.errorhandler(404)
def not_found_error(e):
    return jsonify(error="Not Found", message=str(e)), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error="Internal Server Error", message=str(e)), 500

# Route for file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    # Check if the uploaded file is valid
    if not file or not allowed_file(file.filename):
        return jsonify(results=[{"error": "Bad Request", "message": "No valid file provided."}]), 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    data_type = request.form.get('data_type')
    if data_type == 'users':
        process_user_data(os.path.join(app.config['UPLOAD_FOLDER'], filename), Session, changelog_folder)
    elif data_type == 'drugs':
        process_drug_data(os.path.join(app.config['UPLOAD_FOLDER'], filename), Session, changelog_folder)
    else:
        return jsonify(results=[{"error": "Bad Request", "message": "Invalid data type."}]), 400
    return jsonify(results=[{"success": True}])

# Route for user login/authentication
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

# Route to fetch all insurance companies
@app.route("/company", methods=["GET"])
def company():
    insurance_companies = Session.query(InsuranceCompany).all()
    return jsonify(results=[company.serialize() for company in insurance_companies])

# Route to fetch a specific insurance company and its users
@app.route("/company/<company_id>", methods=["GET"])
def company(company_id):
    insurance_company = Session.query(InsuranceCompany).get(company_id)
    if not insurance_company:
        return jsonify(results=[{"error": "Not Found", "message": "Company not found."}]), 404
    users = Session.query(User).filter_by(insurance_company_id=company_id).all()
    return jsonify(results=[
        {
            "company": insurance_company.serialize(),
            "users": [user.serialize_full() for user in users]
        }
    ])

@app.route("/user/add", methods=["POST"])
def add_user():
    data = request.get_json()
    
    # Manual validation
    if not data:
        return jsonify(results=[{"error": "Bad Request", "message": "No data provided."}]), 400
    
    required_fields = [
        "username", "email", "insurance_company_id", "magic_pill_plan_id",
    ]
    
    for field in required_fields:
        if field not in data:
            return jsonify(results=[{"error": "Bad Request", "message": f"'{field}' is required."}]), 400
    
    # Check for the existence of the referenced insurance company and magic pill plan
    insurance_company = Session.query(InsuranceCompany).get(data["insurance_company_id"])
    magic_pill_plan = Session.query(MagicPillPlan).get(data["magic_pill_plan_id"])
    
    if not insurance_company or not magic_pill_plan:
        return jsonify(results=[{"error": "Not Found", "message": "Insurance company or Magic Pill Plan not found."}]), 404

    # Create the new user
    new_user = User(
        username=data["username"],
        email=data["email"],
        insurance_company_id=data["insurance_company_id"],
        magic_pill_plan_id=data["magic_pill_plan_id"],
        address=data.get("address"),  # Address can be optional
        is_active=data.get("is_active", True)  # By default, the user is active
    )
    
    # Set additional attributes
    new_user.dob = data.get("dob")
    new_user.age = data.get("age")
    new_user.company = data.get("company")
    new_user.first_name = data.get("first_name")
    new_user.last_name = data.get("last_name")
    new_user.phone = data.get("phone")
    
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
    
    try:
        Session.commit()
        return jsonify(results=[{"success": True, "message": "User updated successfully"}])
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
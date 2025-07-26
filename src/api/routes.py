"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Endpoint utilizado para registrar nuevos usuarios 
@api.route('/register',  methods=['POST'])
def register_user():
    try:

        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")


        if not username or not email or not password:
            return jsonify({"message": "No se llenaron todos los campos, por favor completar"}), 401
        


        email_exist = User.query.filter_by(email = email).first()

        if email_exist:
            return jsonify({"message":f"El email {email_exist} ya existe en la base de datos, debe usar uno nuevo"}), 401
        
        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(username=username,email=email, password=password_hash)

        db.session.add(new_user)
        db.session.flush()
        db.session.commit()


    except Exception as error:
        return jsonify({"message":f"Se presenta el siguiente error {error}"}), 500
    



    
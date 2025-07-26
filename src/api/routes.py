"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Tasks
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta, timezone, datetime
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required 

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt = Bcrypt()


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


        return (jsonify(new_user.serialize())), 201


    except Exception as error:
        return jsonify({"message":f"Se presenta el siguiente error {error}"}), 500
    
#Endpoint para loguear usuarios en la plataforma
@api.route('/login', methods=['POST'])
def login():

    try:

        email = request.json.get("email")
        password = request.json.get("password")

        if not email:
            return jsonify({"message":"Falta el email"}), 401
        
        if not password:
            return jsonify({"message":"Falta la contraseña"}), 401
        
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message":f"El usuario {user} no existe"}), 404
        
        db_password = user.password

        true_false = bcrypt.check_password_hash(db_password, password)
        if true_false:
            expires = timedelta(days=1)
            user_id = user.id

            access_token = create_access_token(
                identity=str(user_id),
                expires_delta=expires,
            )

            user.last_login = datetime.now(timezone.utc)
            db.session.commit()

            return (jsonify({"message":f"Login Exitoso {user.username}", "access_token": access_token})), 201
        else:

            return (jsonify({"message":"Contraseña incorrecta"})), 400

    except Exception as error:
        return jsonify({"message":f"Se presenta el siguiente error {error}"}), 500
    

#Endpoint para cerrar sesion

#Enpoint para agregar una nueva tarea
@api.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():

    try:

        user_id = get_jwt_identity()
        label = request.json.get("label")   
        
        task_exists = Tasks.query.filter_by(label=label).first()

        if task_exists:
            return (jsonify({"message":"Existe una tarea con el mismo nombre"})), 400
        
        new_task = Tasks(label = label,user_id=user_id)

        db.session.add(new_task)
        db.session.commit()

        return (jsonify(new_task.serialize())), 201



    except Exception as error:
        return jsonify({"message":f"Se presenta el siguiente error {error}"}), 500
    


    
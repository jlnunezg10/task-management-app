from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, Float


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    tasks = db.relationship('Tasks', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'
    
    

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
        }
    

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(120), unique=True, nullable=False)
    completed = db.Column(db.Boolean(), unique=False, nullable=False,default=False)
        
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
                "id":self.id,
                "label": self.label,
                "completed":self.completed,
                "user_id":self.user.id,
        }


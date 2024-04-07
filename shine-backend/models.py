
from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    energy_provider = db.Column(db.String(100), nullable=False)
    # Add more columns as needed

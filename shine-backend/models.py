# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    battery_type = db.Column(db.String(50), nullable=False)
    utility_company = db.Column(db.String(50), nullable=False)
    import_energy_data = db.Column(db.Boolean, default=False)
    battery_size = db.Column(db.Integer, nullable=False)
    has_solar = db.Column(db.Boolean, default=False)

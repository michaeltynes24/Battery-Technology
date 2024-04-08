# app.py
from flask import Flask, request, jsonify
from models import db, User
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        battery_type=data.get('battery_type'),
        utility_company=data.get('utility_company'),
        import_energy_data=data.get('import_energy_data'),
        battery_size=data.get('battery_size'),
        has_solar=data.get('has_solar')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully."}), 201

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        # Include other fields as necessary
    })

from flask import Flask

app = Flask(__name__)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)

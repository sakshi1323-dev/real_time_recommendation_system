from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from recommender import build_model, recommend
import os

app = Flask(__name__)
CORS(app)

# Correct path handling
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASE_DIR, "data", "merged_data.csv")

df = pd.read_csv(file_path)

# Build model
user_item, similarity = build_model(df)

@app.route("/")
def home():
    return "Recommendation API Running"

@app.route("/recommend/<int:user_id>")
def get_recommendations(user_id):
    recs = recommend(user_id, user_item, similarity)
    
    result = [{"movie": movie, "rating": float(rating)} for movie, rating in recs.items()]
    
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


from flask import request

users = {}

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    users[data["username"]] = data["password"]
    return {"message": "User registered"}

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if users.get(data["username"]) == data["password"]:
        return {"message": "Login successful"}
    return {"message": "Invalid credentials"}
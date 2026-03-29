from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from recommender import build_model, recommend

app = Flask(__name__)
CORS(app)

# Load data
df = pd.read_csv("backend/data/merged_data.csv")

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
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
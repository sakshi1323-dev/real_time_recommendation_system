from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from model.recommender import build_model, recommend
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
def create_tables():
    conn = sqlite3.connect("database.db", check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()
create_tables()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASE_DIR, "data", "merged_data.csv")
df = pd.read_csv(file_path)
user_item, similarity = build_model(df)

@app.route("/")
def home():
    return "API Running "
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = sqlite3.connect("database.db", check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username=?", (data["username"],))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        return {"message": "User already exists, try login"}

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (data["username"], data["password"])
    )

    conn.commit()
    conn.close()

    return {"message": "Registered successfully"}
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = sqlite3.connect("database.db", check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return {"user_id": user[0]}, 200
    else:
        return {"error": "Invalid credentials"}, 401
@app.route("/save", methods=["POST"])
def save_history():
    data = request.json
    conn = sqlite3.connect("database.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO history (user_id, movie) VALUES (?, ?)",
        (data["user_id"], data["movie"])
    )
    conn.commit()
    conn.close()
    return {"message": "Saved"}
@app.route("/recommend/<int:user_id>")
def get_recommendations(user_id):
    conn = sqlite3.connect("database.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT movie FROM history WHERE user_id=?", (user_id,))
    watched = [row[0] for row in cursor.fetchall()]
    recs = recommend(user_id, user_item, similarity)
    recs = recs.drop(labels=watched, errors='ignore')
    result = [{"movie": m, "rating": float(r)} for m, r in recs.items()]
    return jsonify(result)
@app.route("/trending")
def trending():
    top = df.groupby("title")["rating"].mean().sort_values(ascending=False).head(10)
    result = [{"movie": m, "rating": float(r)} for m, r in top.items()]
    return jsonify(result)
@app.route("/search/<query>")
def search(query):
    results = df[df["title"].str.contains(query, case=False, na=False)].head(10)
    return jsonify(results["title"].tolist())
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
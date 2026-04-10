from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from model.recommender import build_model, recommend
import os
import sqlite3

app = Flask(__name__)
CORS(app)

# ==============================
# DATABASE
# ==============================
def create_tables():
    conn = sqlite3.connect("database.db")
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

# ==============================
# LOAD DATA
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASE_DIR, "data", "merged_data.csv")

df = pd.read_csv(file_path)
df["genres"] = df["genres"].fillna("Not Available")
df["title"] = df["title"].fillna("No Title")
df["rating"] = df["rating"].fillna(0)

user_item, similarity = build_model(df)

# ==============================
# POSTER (PLACEHOLDER)
# ==============================
def get_poster(movie):
    return "https://via.placeholder.com/200"

# ==============================
# ROUTES
# ==============================
@app.route("/")
def home():
    return "API Running"

# REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                       (data["username"], data["password"]))
        conn.commit()
        return {"message": "Registered successfully"}
    except:
        return {"message": "User already exists"}

# LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username=? AND password=?",
                   (data["username"], data["password"]))
    user = cursor.fetchone()

    if user:
        return {"user_id": user[0]}
    return {"error": "Invalid credentials"}

# FORGOT PASSWORD
@app.route("/forgot", methods=["POST"])
def forgot():
    data = request.json
    return {"message": "Password reset feature (demo only)"}

# SEARCH
@app.route("/search")
def search():
    query = request.args.get("query", "")
    results = df[df["title"].str.contains(query, case=False, na=False)].head(10)

    output = []
    for _, row in results.iterrows():
        output.append({
            "movieId": int(row["movieId"]),
            "title": row["title"],
            "genres": row["genres"],
            "rating": float(row["rating"]),
            "poster": get_poster(row["title"])
        })

    return jsonify({"results": output})

# RECOMMEND
@app.route("/recommend")
def recommend_api():
    user_id = 1
    recs = recommend(user_id, user_item, similarity)

    result = []
    for m, r in recs.items():
        movie_data = df[df["title"] == m]
        if movie_data.empty:
            continue

        row = movie_data.iloc[0]
        result.append({
            "movieId": int(row["movieId"]),
            "title": row["title"],
            "genres": row["genres"],
            "rating": float(r),
            "poster": get_poster(row["title"])
        })

    return jsonify({"recommendations": result})

# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
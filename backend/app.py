from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from model.recommender import build_model, recommend
import os
import sqlite3
app=Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})

def create_tables():
    conn=sqlite3.connect("database.db",check_same_thread=False)
    cursor=conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        movieId INTEGER,
        title TEXT,
        genres TEXT
    )
    """)
    conn.commit()
    conn.close()
create_tables()

BASE_DIR=os.path.dirname(os.path.abspath(__file__))
file_path=os.path.join(BASE_DIR,"data","merged_data.csv")
df=pd.read_csv(file_path)
user_item,similarity=build_model(df)
def get_genre(row):
    if "genres" in row and pd.notna(row["genres"]):
        return row["genres"]
    return ""  

@app.route("/")
def home():
    return "API Running"

@app.route("/register",methods=["POST"])
def register():
    data=request.json
    conn=sqlite3.connect("database.db",check_same_thread=False)
    cursor=conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=?",(data["username"],))
    if cursor.fetchone():
        return {"message":"User already exists"}
    cursor.execute(
        "INSERT INTO users (username,password) VALUES (?, ?)",
        (data["username"],data["password"])
    )
    conn.commit()
    conn.close()
    return {"message":"Registered successfully"}

@app.route("/login",methods=["POST"])
def login():
    data=request.json
    conn=sqlite3.connect("database.db",check_same_thread=False)
    cursor=conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (data["username"],data["password"])
    )
    user=cursor.fetchone()
    conn.close()
    if user:
        return {"user_id":user[0]}
    return {"error":"Invalid credentials"},401

@app.route("/forgot-password",methods=["POST"])
def forgot_password():
    data=request.json
    conn=sqlite3.connect("database.db",check_same_thread=False)
    cursor=conn.cursor()
    cursor.execute("UPDATE users SET password=? WHERE username=?",
                   ("1234",data["username"]))
    conn.commit()
    conn.close()
    return {"message":"Password reset to 1234"}

@app.route("/save",methods=["POST"])
def save_history():
    data=request.json
    conn=sqlite3.connect("database.db",check_same_thread=False)
    cursor=conn.cursor()
    cursor.execute("""
        INSERT INTO history (user_id,movieId,title,genres)
        VALUES (?, ?, ?, ?)
    """, (
        data["user_id"],
        data.get("movieId"),
        data.get("title"),
        data.get("genres")
    ))
    conn.commit()
    conn.close()
    return {"message":"Saved"}

@app.route("/recommend/<int:user_id>")
def get_recommendations(user_id):
    user_item, similarity = build_model(df)
    recs=recommend(user_id,user_item,similarity)
    result=[]
    for m, r in recs.items():
        movie_data=df[df["title"]==m].iloc[0]
        result.append({
            "movieId":int(movie_data["movieId"]),
            "title":m,
            "genres":get_genre(movie_data),
            "rating":float(r)
        })
    return jsonify(result)

@app.route("/trending")
def trending():
    top=df.groupby("title")["rating"].mean().sort_values(ascending=False).head(12)
    result=[]
    for m, r in top.items():
        movie_data=df[df["title"]==m].iloc[0]
        result.append({
            "movieId":int(movie_data["movieId"]),
            "title":m,
            "genres":get_genre(movie_data),
            "rating":float(r)
        })
    return jsonify(result)

@app.route("/search/<query>")
def search(query):
    results=df[df["title"].str.contains(query,case=False,na=False)].drop_duplicates("title").head(12)
    output=[]
    for _, row in results.iterrows():
        output.append({
            "movieId":int(row["movieId"]),
            "title":row["title"],
            "genres":get_genre(row)
        })
    return jsonify(output)

if __name__=="__main__":
    app.run(debug=True)
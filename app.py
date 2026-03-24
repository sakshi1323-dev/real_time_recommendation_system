import streamlit as st
import pandas as pd
import sqlite3
from model.recommender import build_model, recommend
conn=sqlite3.connect("database.db")
df=pd.read_sql("SELECT * FROM movies_data", conn)
user_item, similarity=build_model(df)
st.title("🎬 Movie Recommendation System")
st.write("Get personalized movie recommendations!")
user_id=st.number_input("Enter User ID", min_value=1,step=1)
if st.button("Get Recommendations"):
    recs = recommend(user_id, user_item,similarity)
    st.subheader("Top Recommendations:")
    for movie, rating in recs.items():
        st.write(f"🎥 {movie} ⭐ {round(rating, 2)}")
        
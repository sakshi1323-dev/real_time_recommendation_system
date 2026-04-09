import sqlite3
import pandas as pd
from backend.model.recommender import build_model, recommend
conn=sqlite3.connect("database.db")
df=pd.read_sql("SELECT * FROM movies_data", conn)
user_item,similarity = build_model(df)
recs=recommend(1, user_item, similarity)
print("\n Recommended Movies:")
print(recs)
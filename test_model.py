import sqlite3
import pandas as pd
from model.recommender import build_model, recommend

# Load data from DB
conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM movies_data", conn)

# Build model
user_item, similarity = build_model(df)

# Test recommendation
recs = recommend(1, user_item, similarity)

print("\n Recommended Movies:")
print(recs)
import sqlite3
import pandas as pd
conn=sqlite3.connect("database.db")
df=pd.read_sql("SELECT * FROM movies_data", conn)
df.to_csv("data/merged_data.csv", index=False)
print("merged_data.csv created")
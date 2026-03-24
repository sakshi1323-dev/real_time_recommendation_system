import sqlite3
import pandas as pd
conn=sqlite3.connect("database.db")
df=pd.read_sql("SELECT * FROM movies_data LIMIT 5", conn)
print(df)
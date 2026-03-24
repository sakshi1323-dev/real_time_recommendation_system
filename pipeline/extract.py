import pandas as pd
def extract():
    print("1.Extracting data...")
    movies=pd.read_csv("data/movies.csv")
    ratings=pd.read_csv("data/ratings.csv")
    print("2.Data extracted successfully")
    return movies,ratings
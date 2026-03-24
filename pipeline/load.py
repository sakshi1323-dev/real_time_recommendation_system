from sqlalchemy import create_engine
def load(df):
    print("5.Loading data into database...")
    engine=create_engine("sqlite:///database.db")
    df.to_sql("movies_data",engine,if_exists="replace",index=False)
    print("6.Data loaded successfully")
from extract import extract
from transform import transform
from load import load
def run_pipeline():
    print(">>Starting pipeline<<")
    movies, ratings = extract()
    df=transform(movies, ratings)
    load(df)
    print("7.Pipeline completed successfully!")
if __name__ == "__main__":
    run_pipeline()
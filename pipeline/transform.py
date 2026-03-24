def transform(movies, ratings):
    print("3.Transforming data...")

    # Merge datasets
    df = ratings.merge(movies, on='movieId')

    # Remove unnecessary columns (optional)
    df = df[['userId', 'movieId', 'title', 'rating']]

    print("4.Data transformed successfully")
    return df
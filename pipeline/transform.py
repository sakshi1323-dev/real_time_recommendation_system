def transform(movies, ratings):
    print("3.Transforming data...")
    df=ratings.merge(movies,on='movieId')
    df=df[['userId', 'movieId', 'title', 'rating']]
    print("4.Data transformed successfully")
    return df
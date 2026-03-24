import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
def build_model(df):
    print("Building recommendation model...")

    # Create user-movie matrix
    user_item = df.pivot_table(
        index='userId',
        columns='title',
        values='rating'
    ).fillna(0)

    print("User-item matrix created")

    # Compute similarity
    similarity = cosine_similarity(user_item)

    print("Similarity matrix created")

    return user_item, similarity

def recommend(user_id, user_item, similarity):
    print(f" Generating recommendations for User {user_id}...")

    # Get similarity scores
    user_index = user_item.index.tolist().index(user_id)
    scores = list(enumerate(similarity[user_index]))

    # Sort users based on similarity
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    # Get top 5 similar users (excluding itself)
    similar_users = [i[0] for i in scores[1:6]]

    print("Similar users:", similar_users)

    # Get recommendations
    recommended_movies = user_item.iloc[similar_users].mean().sort_values(ascending=False)

    return recommended_movies.head(5)
import React, { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = "http://localhost:5000";

function App() {
  const [userId, setUserId] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);

  // 🔥 FETCH TRENDING
  useEffect(() => {
    if (userId) {
      fetch(`${BASE_URL}/trending`)
        .then(res => res.json())
        .then(data => setTrending(data));
    }
  }, [userId]);

  // 🔐 LOGIN / REGISTER
  const handleAuth = async () => {
    const endpoint = isRegister ? "register" : "login";

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (isRegister) {
      alert(data.message);
    } else {
      if (data.user_id) setUserId(data.user_id);
      else alert(data.error);
    }
  };

  // 🔍 SEARCH
  const handleSearch = async () => {
    const res = await fetch(`${BASE_URL}/search/${searchQuery}`);
    const data = await res.json();
    setSearchResults(data);
  };

  // 🎬 RECOMMEND
const getRecommendations = async () => {
  try {
    setRecommendations([]);  // 🔥 force refresh

    const res = await fetch(`${BASE_URL}/recommend/${userId}`);
    const data = await res.json();

    setRecommendations(data);

  } catch (err) {
    console.error("Recommendation error:", err);
  }
};
  // 💾 SAVE CLICK
 const handleMovieClick = async (movie) => {
  try {
    const res = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        movieId: movie.movieId,
        title: movie.title,
        genres: movie.genres
      })
    });

    const data = await res.json();
    console.log("Saved:", data);

    // 🔥 ADD THIS LINE (VERY IMPORTANT)
    getRecommendations();

  } catch (err) {
    console.error("ERROR:", err);
  }
};
  // 🔐 LOGIN PAGE
  if (!userId) {
    return (
      <div className="login">
        <h1>🎬 MovieFlix</h1>

        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button onClick={handleAuth}>
          {isRegister ? "Register" : "Login"}
        </button>

        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login instead" : "Create account"}
        </p>
      </div>
    );
  }

  // 🎬 MAIN UI
  return (
    <div className="app">

      {/* NAVBAR */}
      <div className="navbar">
        <h1>🎬 MovieFlix</h1>
        <button onClick={() => setUserId(null)}>Logout</button>
      </div>
       {/* HOW IT WORKS */}
      <div className="info-section">
        <p>
            <bold>Recommends movies based on your recent searches and clicks</bold>
        </p>
      </div>

 {/* 🔍 SEARCH + RECOMMEND */}
<div className="search-container">
  <input
    className="search"
    placeholder="Search movies..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  <button className="main-btn" onClick={handleSearch}>
    Search
  </button>

  <button className="main-btn" onClick={getRecommendations}>
    Get Recommendations
  </button>
</div>

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 && (
        <div className="section">
          <h2>Search Results</h2>
          <div className="movies-grid">
            {searchResults.map((movie, i) => (
              <div key={i} className="movie-card" onClick={() => handleMovieClick(movie)}>
                <h3>{movie.title}</h3>
                {movie.genres && <p>{movie.genres}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="section">
          <h2>Recommended Movies</h2>
          <div className="movies-grid">
            {recommendations.map((movie, i) => (
              <div key={i} className="movie-card">
                <h3>{movie.title}</h3>
                {movie.genres && <p>{movie.genres}</p>}
                <div className="rating">⭐ {movie.rating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

     

      {/* TRENDING */}
      <div className="section">
        <h2>🔥 Trending</h2>
        <div className="movies-grid">
          {trending.map((movie, i) => (
            <div key={i} className="movie-card">
              <h3>{movie.title}</h3>
              {movie.genres && <p>{movie.genres}</p>}
              <div className="rating">⭐ {movie.rating.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
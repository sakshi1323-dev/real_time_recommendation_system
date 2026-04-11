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
      if (data.user_id) {
        setUserId(data.user_id);
      } else {
        alert(data.error);
      }
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
    const res = await fetch(`${BASE_URL}/recommend/${userId}`);
    const data = await res.json();
    setRecommendations(data);
  };

  // 💾 SAVE
  const saveHistory = async (movie) => {
    await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: userId,
        movieId: movie.movieId,
        title: movie.title,
        genres: movie.genres
      })
    });

    alert(`Saved: ${movie.title}`);
  };

  // 🔐 LOGIN UI
  if (!userId) {
    return (
      <div className="login">
        <h1>🎬 MovieFlix</h1>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

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

      {/* SEARCH */}
      <div className="search-container">
        <input
          className="search"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="main-btn" onClick={handleSearch}>Search</button>
      </div>

      {/* SEARCH RESULTS */}
      <div className="section">
        <h2>Search Results</h2>
        <div className="movies-grid">
          {searchResults.map((movie, i) => (
            <div
              className="movie-card"
              key={i}
              onClick={() => saveHistory(movie)}
            >
              <h3>{movie.title}</h3>
              {movie.genre && <p>{movie.genre}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMEND */}
      <div className="section">
        <h2>Recommended</h2>
        <button className="main-btn" onClick={getRecommendations}>
          Get Recommendations
        </button>

        <div className="movies-grid">
          {recommendations.map((movie, i) => (
            <div
              key={i}
              className="movie-card"
              onClick={() => saveHistory(movie)}
            >
              <h3>{movie.title}</h3>
              {movie.genres && <p>{movie.genres}</p>}
              {movie.rating && (
                <div className="rating">⭐ {movie.rating.toFixed(1)}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section">
        <h3>📊 How it works</h3>
        <p className="info">
          Uses collaborative filtering and recommends movie based on your searched and clicked movies.
        </p>
      </div>

      {/* TRENDING */}
      <div className="section">
        <h2>🔥 Trending</h2>
        <div className="movies-grid">
          {trending.map((movie, i) => (
            <div className="movie-card" key={i}>
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
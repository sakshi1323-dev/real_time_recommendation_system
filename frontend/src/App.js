import React, { useState, useEffect } from "react";
import "./App.css";

const BASE_URL = "https://recommender-backend-b4rq.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 🔥 LOAD TRENDING
  useEffect(() => {
    fetch(`${BASE_URL}/trending`)
      .then(res => res.json())
      .then(data => setTrending(data.trending || []))
      .catch(err => console.log(err));
  }, []);

  // 🔐 LOGIN
  const login = async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.user_id) {
      setUser(data.user_id);
    } else {
      alert("Invalid login");
    }
  };

  // 🔐 REGISTER
  const register = async () => {
    await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    alert("Registered successfully!");
  };

  // 🔍 SEARCH
  const handleSearch = async () => {
    const res = await fetch(`${BASE_URL}/search?query=${query}`);
    const data = await res.json();
    setSearchResults(data.results || []);
  };

  // 🎬 RECOMMEND
  const handleRecommend = async () => {
    const res = await fetch(`${BASE_URL}/recommend?title=${query}`);
    const data = await res.json();
    setRecommendations(data.recommendations || []);
  };

  // 🔐 LOGOUT
  const logout = () => {
    setUser(null);
  };

  // ================= LOGIN SCREEN =================
  if (!user) {
    return (
      <div className="login">
        <h1>🎬 Movie Recommender</h1>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>

        <p className="forgot">Forgot Password?</p>
      </div>
    );
  }

  // ================= MAIN DASHBOARD =================
  return (
    <div className="App">

      {/* NAVBAR */}
      <div className="navbar">
        <h1>🎬 Movie Recommender</h1>
        <button className="main-btn" onClick={logout}>Logout</button>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <input
          className="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="main-btn" onClick={handleSearch}>
          Search
        </button>

        <button className="main-btn" onClick={handleRecommend}>
          Get Recommendations
        </button>
      </div>

      {/* SEARCH RESULTS */}
      <div className="grid">
        {searchResults.map((m, i) => (
          <div key={i} className="card" onClick={() => setSelectedMovie(m)}>
            <h3>{m.title}</h3>
          </div>
        ))}
      </div>

      {/* RECOMMENDATIONS */}
      <h2>Recommended for You</h2>

      <p style={{ color: "#aaa" }}>
        We recommend movies based on your search and user behavior.
        Users with similar taste influence your recommendations.
      </p>

      <div className="grid">
        {recommendations.map((m, i) => (
          <div key={i} className="card" onClick={() => setSelectedMovie(m)}>
            <h3>{m.title}</h3>
            <p>⭐ {m.rating?.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* TRENDING */}
      <h2>🔥 Trending</h2>

      <div className="grid">
        {trending.map((m, i) => (
          <div key={i} className="card" onClick={() => setSelectedMovie(m)}>
            <h3>{m.title}</h3>
            <p>⭐ {m.rating?.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* DETAILS */}
      {selectedMovie && (
        <div className="card">
          <h2>Movie Details</h2>
          <p>Title: {selectedMovie.title}</p>
          <p>Genre: {selectedMovie.genres}</p>
          <p>Rating: {selectedMovie.rating}</p>
          <p>ID: {selectedMovie.movieId}</p>
        </div>
      )}
    </div>
  );
}

export default App;
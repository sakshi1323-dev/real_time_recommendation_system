import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const BASE_URL = "https://recommender-backend-b4rq.onrender.com";

  // 🔐 AUTH
  const handleAuth = async () => {
    console.log("BUTTON CLICKED");

    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    const endpoint = isRegister ? "register" : "login";

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (isRegister) {
        alert(data.message || data.error);
      } else {
        if (data.user_id) {
          setUserId(data.user_id);
        } else {
          alert(data.error);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 🎬 RECOMMEND
  const fetchRecommendations = async () => {
    const res = await fetch(`${BASE_URL}/recommend/${userId}`);
    const data = await res.json();
    setRecommendations(data);
  };

  // 🔥 TRENDING
  const fetchTrending = async () => {
    const res = await fetch(`${BASE_URL}/trending`);
    const data = await res.json();
    setTrending(data);
  };

  useEffect(() => {
    if (userId) fetchTrending();
  }, [userId]);

  // 🔍 SEARCH
  const searchMovie = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(`${BASE_URL}/search/${query}`);
    const data = await res.json();
    setSearchResults(data);
  };

  // 💾 SAVE HISTORY
  const saveHistory = async (movie) => {
    await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, movie }),
    });
  };

  // 🔐 LOGIN UI
  if (!userId) {
    return (
      <div className="login">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isRegister ? "Register" : "Login"}
        </button>

        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login instead" : "Register new user"}
        </p>
      </div>
    );
  }

  // 🎬 MAIN UI
  return (
    <div className="app">
      <div className="navbar">
        <h1>🎬 MovieFlix</h1>
        <button onClick={() => setUserId(null)}>Logout</button>
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search movies..."
        onChange={(e) => searchMovie(e.target.value)}
      />

      <div className="grid">
        {searchResults.map((movie, i) => (
          <div className="card" key={i}>
            {movie}
          </div>
        ))}
      </div>

      {/* RECOMMEND */}
      <h2>Recommended for You</h2>
      <button className="main-btn" onClick={fetchRecommendations}>
        Get Recommendations
      </button>

      <div className="grid">
        {recommendations.map((rec, i) => (
          <div
            className="card"
            key={i}
            onClick={() => saveHistory(rec.movie)}
          >
            <h3>{rec.movie}</h3>
            <p>⭐ {rec.rating.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* TRENDING */}
      <h2>🔥 Trending</h2>
      <div className="grid">
        {trending.map((rec, i) => (
          <div className="card" key={i}>
            <h3>{rec.movie}</h3>
            <p>⭐ {rec.rating.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
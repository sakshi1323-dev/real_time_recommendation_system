import React, { useState } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    const res = await fetch(`https://your-backend.onrender.com/recommend/${userId}`);
    const data = await res.json();
    setRecommendations(data);
  };

  return (
    <div className="app">
      
      {/* Navbar */}
      <div className="navbar">
        <h1>🎬 MovieFlix</h1>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchRecommendations}>
          Get Recommendations
        </button>
      </div>

      {/* Recommendations */}
      <div className="grid">
        {recommendations.map((rec, index) => (
          <div className="card" key={index}>
            <h3>{rec.movie}</h3>
            <p>⭐ {rec.rating.toFixed(2)}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
import React, { useState } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    console.log("BUTTON CLICKED ");

    if (!userId) {
      alert("Please enter User ID");
      return;
    }

    try {
      setLoading(true);

      
      const res = await fetch(`https://recommender-backend-b4rq.onrender.com/recommend/${userId}`);

      if (!res.ok) {
        throw new Error("API not responding");
      }

      const data = await res.json();
      console.log("DATA:", data);

      setRecommendations(data);
    } catch (error) {
      console.error("ERROR:", error);
      alert("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      
     
      <div className="navbar">
        <h1>🎬 MovieFlix</h1>
      </div>

     
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        />

        <button onClick={fetchRecommendations}>
          Get Recommendations
        </button>
      </div>

     
      {loading && <p>Loading recommendations...</p>}

      
      {!loading && recommendations.length === 0 && (
        <p>No recommendations yet</p>
      )}

      
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
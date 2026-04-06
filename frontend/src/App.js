import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch recommendations
  useEffect(() => {
    fetch("https://recommender-backend-b4rq.onrender.com/recommend/1")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, []);

  // Login function
  const login = async () => {
    const res = await fetch("https://recommender-backend-b4rq.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();
    setMessage(result.message);
  };

  return (
    <div>
      <h1>Movie Recommendations</h1>

      {/* 🔐 LOGIN FORM */}
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={login}>Login</button>

      <p>{message}</p>

      {/* 🎬 RECOMMENDATIONS */}
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.movie} - {item.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
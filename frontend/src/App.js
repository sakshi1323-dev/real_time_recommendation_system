import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://recommender-backend-b4rq.onrender.com/recommend/1")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Movie Recommendations</h1>
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
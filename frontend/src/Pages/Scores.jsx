// src/Pages/Scores.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "../styles/Scores.css";

const Scores = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("/api/scores", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Scores API returned:", data);
        if (data.success && Array.isArray(data.scores)) {
          setScores(data.scores);
        } else {
          console.warn("❗ Unexpected API format:", data);
        }
      })
      .catch(err => console.error("❌ Failed to fetch scores:", err));
  }, []);

  return (
    <main className="scores-page">
      <section className="scores-container">
        <h2>High Scores</h2>
        <div className="scores-table">
          <div className="header">Username</div>
          <div className="header">Wins</div>
          <div className="header">Losses</div>
          {scores.map(({ username, wins, losses }) => (
            <React.Fragment key={username}>
              <div className={user?.username === username ? "highlight" : ""}>
                {username}
              </div>
              <div className={user?.username === username ? "highlight" : ""}>
                {wins}
              </div>
              <div className={user?.username === username ? "highlight" : ""}>
                {losses}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="button-group">
          <button className="btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
};

export default Scores;

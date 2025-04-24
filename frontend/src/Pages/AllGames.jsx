import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "../styles/AllGames.css";

const AllGames = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetch("/api/game", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGames(data.games);
        } else {
          alert("Failed to load games");
        }
      })
      .catch(err => {
        console.error("Fetch games error:", err);
        alert("Error loading games");
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return <div className="loading">Loading games…</div>;
  }

  const openGames = games.filter(g => g.status === "Open");
  const activeGames = games.filter(g => g.status === "Active");
  const completedGames = games.filter(g => g.status === "Completed");

  return (
    <main className="all-games-container">
      <section className="games-section">
        <h2>Open Games</h2>
        {openGames.length === 0 ? (
          <p>No open games right now.</p>
        ) : (
          <ul className="games-list">
            {openGames.map(game => (
              <li key={game.gameId} className="game-card">
                <Link to={`/game/${game.gameId}`} className="game-link">
                  {game.player1} (waiting for opponent)
                </Link>
                <div className="game-meta">
                  Created at {new Date(game.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="games-section">
        <h2>Active Games</h2>
        {activeGames.length === 0 ? (
          <p>No active games right now.</p>
        ) : (
          <ul className="games-list">
            {activeGames.map(game => (
              <li key={game.gameId} className="game-card">
                <Link to={`/game/${game.gameId}`} className="game-link">
                  {game.player1} vs {game.player2}
                </Link>
                <div className="game-meta">
                  Started at {new Date(game.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="games-section">
        <h2>Completed Games</h2>
        {completedGames.length === 0 ? (
          <p>No completed games yet.</p>
        ) : (
          <ul className="games-list">
            {completedGames.map(game => (
              <li key={game.gameId} className="game-card">
                <Link to={`/game/${game.gameId}`} className="game-link">
                  {game.player1} vs {game.player2}
                </Link>
                <div className="game-meta">
                  Started at {new Date(game.createdAt).toLocaleString()}; Ended at {new Date(game.updatedAt).toLocaleString()}; Winner: {game.winner}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default AllGames;

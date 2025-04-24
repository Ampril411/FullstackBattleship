import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Rules from "./Pages/Rules";
import Scores from "./Pages/Scores";
import NewGame from "./Pages/NewGame"; 
import AllGames from "./Pages/AllGames";


import { GameProvider } from "./Context/GameContext";
import { UserProvider, UserContext } from "./Context/UserContext";

import "./styles/App.css";

function AppContent() {
  const { user, logout } = useContext(UserContext);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/user/logout", { 
      method: "POST", 
      credentials: "include"
    });
      logout();
      navigate("/");
    };

  const handleNewGame = async () => {
    try {
      const res = await fetch("/api/game/create", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/game/${data.gameId}`);
      } else {
        alert("Failed to create game.");
      }
    } catch (err) {
      console.error("Error creating game", err);
    }
    setIsGameOpen(false);
  };


  return (
    <>
      <header id="navbar">
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="nav-header">
            <h1>Battleship</h1>
          </div>

          <div className="nav-links" style={{ display: "flex", alignItems: "center" }}>
            <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
              <li className="nav-item"><Link to="/">Home</Link></li>

              {/* 🎮 Game Dropdown */}
              <li
                className="nav-item dropdown"
                onMouseEnter={() => setIsGameOpen(true)}
                onMouseLeave={() => setIsGameOpen(false)}
              >
                <span className="game">Game</span>
                <ul className={`dropdown-menu ${isGameOpen ? "show" : ""}`}>
                  {user && (
                    <>
                    <li>
                      <Link
                        to="#"
                        onClick={async (e) => {
                         e.preventDefault();
                         await handleNewGame();
                        }
                        }
                      >
                        New Game
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/games"
                        onClick={() => setIsGameOpen(false)}
                      >
                        All Games
                      </Link>
                    </li>
                    </>
                  )}
                </ul>
              </li>

              <li className="nav-item"><Link to="/rules">Rules</Link></li>
              <li className="nav-item"><Link to="/scores">Scores</Link></li>
            </ul>

            {/* 🔐 Auth Section */}
            <ul id="auth-right">
              {user ? (
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => setIsUserOpen(true)}
                  onMouseLeave={() => setIsUserOpen(false)}
                >
                  <span className="game">{user.username} ⌄</span>
                  <ul className={`dropdown-menu ${isUserOpen ? "show" : ""}`}>
                    <li><button onClick={handleLogout} className="logout-btn">Log Out</button></li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item"><Link to="/login" id="login-btn">Login</Link></li>
                  <li className="nav-item"><Link to="/register" id="register-btn">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/game/:gameId" 
          element={
            <GameProvider>
              <NewGame />
            </GameProvider>
          }
        />
        <Route path="/games" element={<AllGames />} /> {/*  All Games  */}

        <Route path="/rules" element={<Rules />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
        <AppContent />
    </UserProvider>
  );
}

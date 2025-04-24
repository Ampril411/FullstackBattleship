import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "../Context/GameContext";
import { UserContext } from "../Context/UserContext";
import Board from "../utils/Board";
import "../styles/NewGame.css";

const NewGame = () => {
  const { gameId } = useParams();
  const navigate   = useNavigate();
  const { user }   = useContext(UserContext);
  const {
    opponentName,
    playerBoard,
    opponentBoard,
    gameState,
    attack
  } = useGame();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!playerBoard.length) {
    return <div className="loading">Loading game…</div>;
  }

  const emptyBoard = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hit: false }))
  );

  return (
    <main>
      <h2 className="game-id-header">Game ID: {gameId}</h2>
      <p className="game-message">{gameState.message}</p>

      <section className="game-container">
        <div className="board-section">
          {gameState.status === "Open" ? (
            <p className="player-label">Waiting for opponent to join…</p>
          ) : (
            <h3 className="player-label">Enemy: {opponentName}</h3>
          )}
          <Board
            board={opponentBoard.length===10 ? opponentBoard : emptyBoard}
            isPlayer={false}
            onCellClick={(r, c) => {
              if (!gameState.playerTurn || gameState.gameOver) return;
              if (opponentBoard[r][c].hit) return;
              attack(r, c);
            }}
          />
        </div>

        <div className="board-section">
          <h3 className="player-label">You: {user.username}</h3>
          <Board board={playerBoard} isPlayer={true} onCellClick={() => {}} />
        </div>
      </section>
    </main>
  );
};

export default NewGame;

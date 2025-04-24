// src/Context/GameContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
  } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { UserContext } from "./UserContext";
  import { placeShipsRandomly } from "../utils/GameLogic";
  
  const GameContext = createContext();
  
  export const GameProvider = ({ children }) => {
    const { gameId } = useParams();
    const navigate   = useNavigate();
    const { user }   = useContext(UserContext);
  
    const [opponentName, setOpponentName]   = useState("");
    const [playerBoard,   setPlayerBoard]   = useState([]);
    const [opponentBoard, setOpponentBoard] = useState([]);
    const [gameState,     setGameState]     = useState({
      status:      "Open",       // Open / Active / Completed
      playerTurn:  false,        // 是否轮到我
      gameStarted: false,
      gameOver:    false,
      winner:      null,
      message:     ""
    });
  
    const [prevDefHits, setPrevDefHits] = useState(0);
  
    const loadGame = useCallback(async () => {
      if (!user) { navigate("/"); return; }
  
      await fetch(`/api/game/${gameId}/join`, {
        method:      "PATCH",
        credentials: "include"
      });
  
      const res = await fetch(`/api/game/${gameId}`, {
        credentials: "include"
      });
      const { game } = await res.json();
      const { status, player1, player2, boards, hits = {}, winner } = game;
  
      const isCreator = player1 === user.username;
      const oppName   = isCreator ? player2 : player1;
      setOpponentName(oppName || "");
  
      let myBoard = boards[user.username];
      if (!Array.isArray(myBoard) || myBoard.length !== 10) {
        myBoard = placeShipsRandomly();
        await fetch(`/api/game/${gameId}/board`, {
          method:      "PATCH",
          credentials: "include",
          headers:     { "Content-Type": "application/json" },
          body:        JSON.stringify({
            username: user.username,
            board:    myBoard
          })
        });
      }
      setPlayerBoard(myBoard);
  
      const fullOpp = boards[oppName] || [];
      const hitsOnly = fullOpp.map(row =>
        row.map(cell => ({
          hit:  cell.hit,
          ship: cell.ship
        }))
      );
      setOpponentBoard(hitsOnly);
  
      const started = status !== "Open";
      const over    = status === "Completed";
  
      let myTurn = false;
      if (status === "Active") {
        const myHits  = Array.isArray(hits[user.username]) ? hits[user.username].length : 0;
        const oppHits = Array.isArray(hits[oppName])      ? hits[oppName].length       : 0;
        myTurn = isCreator ? (myHits === oppHits) : (myHits !== oppHits);
      }
  
      let msg = !started
        ? "Waiting for opponent to join…"
        : over
          ? `${winner} Wins!`
          : myTurn
            ? "Your turn"
            : "Opponent's turn";
  
      setGameState({
        status,
        playerTurn:  myTurn,
        gameStarted: started,
        gameOver:    over,
        winner,
        message:     msg
      });
  
      const defHits = myBoard.flat().filter(c => c.hit).length;
      setPrevDefHits(defHits);
  
    }, [gameId, navigate, user]);
  
    useEffect(() => {
      loadGame();
    }, [loadGame]);
  
    const attack = async (row, col) => {
      if (!gameState.playerTurn || gameState.gameOver) return;
  
      setOpponentBoard(prev => {
        const cp = prev.map(r => r.map(c => ({ ...c })));
        cp[row][col].hit = true;
        return cp;
      });
  
      const res = await fetch(`/api/game/${gameId}/hit`, {
        method:      "PATCH",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ row, col })
      });
      const { allSunk, winner } = await res.json();
  
      if (allSunk) {
        setGameState(s => ({
          ...s,
          status:   "Completed",
          gameOver: true,
          winner,
          message:  `${winner} Wins!`
        }));
        return;
      }
  
      setGameState(s => ({
        ...s,
        playerTurn: false,
        message:    "Opponent's turn"
      }));
    };
  
    useEffect(() => {
        if (gameState.status === "Completed") return;
        const iv = setInterval(() => {
          loadGame();
        }, 2000);
        return () => clearInterval(iv);
      }, [gameState.status, loadGame]);
  
  
    return (
      <GameContext.Provider value={{
        opponentName,
        playerBoard,
        opponentBoard,
        gameState,
        attack
      }}>
        {children}
      </GameContext.Provider>
    );
  };
  
  export const useGame = () => useContext(GameContext);
  
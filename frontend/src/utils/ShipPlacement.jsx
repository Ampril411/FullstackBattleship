import React, { useState, useEffect } from "react";
import "../styles/ShipPlacement.css"; 

// Preset ship data (ID and size)
const INITIAL_SHIPS = [
    { id: "ship-5", size: 5 },
    { id: "ship-4", size: 4 },
    { id: "ship-3a", size: 3 },
    { id: "ship-3b", size: 3 },
    { id: "ship-2", size: 2 },
];

const ShipPlacement = ({ gameStarted = false, onBoardUpdate = () => {} }) => {
    // Ensure `onBoardUpdate` is a function
    if (typeof onBoardUpdate !== "function") {
        throw new Error("ShipPlacement: `onBoardUpdate` is not a function!");
    }

    // Initialize an empty 10x10 player board
    const [playerBoard, setPlayerBoard] = useState(Array(10).fill(null).map(() => Array(10).fill(null)));
    const [availableShips, setAvailableShips] = useState(INITIAL_SHIPS);
    const [draggingShip, setDraggingShip] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(null);
    const [isHorizontal, setIsHorizontal] = useState(true); // Default ship placement direction: Horizontal

    // Reset board and available ships when `gameStarted` changes
    useEffect(() => {
        if (!gameStarted) {
            setPlayerBoard(Array(10).fill(null).map(() => Array(10).fill(null)));
            setAvailableShips(INITIAL_SHIPS);
        }
    }, [gameStarted]);

    // Handle drag start event for ships
    const handleDragStart = (ship) => {
        setDraggingShip(ship);
    };

    // Handle hover event to preview ship placement
    const handleDragOver = (row, col) => {
        if (draggingShip) {
            setHoverPosition({ row, col, size: draggingShip.size });
        }
    };

    // Handle ship placement when dropped
    const handleDrop = (row, col) => {
        if (!draggingShip) return;
        const { id, size } = draggingShip;

        // **Ensure the ship does not exceed board boundaries**
        if (isHorizontal && col + size > 10) {
            alert("Ship cannot be placed! It exceeds the board boundaries.");
            setHoverPosition(null);
            return;
        }
        if (!isHorizontal && row + size > 10) {
            alert("Ship cannot be placed! It exceeds the board boundaries.");
            setHoverPosition(null);
            return;
        }

        // **Check for overlapping ships**
        for (let i = 0; i < size; i++) {
            const checkRow = row + (isHorizontal ? 0 : i);
            const checkCol = col + (isHorizontal ? i : 0);
            if (playerBoard[checkRow][checkCol] !== null) {
                alert("Ships cannot overlap!");
                setHoverPosition(null);
                return;
            }
        }

        // **Update player board with the placed ship**
        const newBoard = playerBoard.map((r, rIdx) =>
            r.map((c, cIdx) =>
                (rIdx === row && cIdx >= col && cIdx < col + size && isHorizontal) ||
                (cIdx === col && rIdx >= row && rIdx < row + size && !isHorizontal)
                    ? id
                    : c
            )
        );

        setPlayerBoard(newBoard);
        setDraggingShip(null);
        setHoverPosition(null);
        setAvailableShips(availableShips.filter(ship => ship.id !== id));

        // Send updated board data to parent component
        onBoardUpdate(newBoard);
    };

    // **Render player board**
    const generatePlayerBoard = () => {
        return playerBoard.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                    // Fix ship preview (shadow) when hovering over board
                    let isShadow = false;
                    if (hoverPosition) {
                        if (isHorizontal) {
                            isShadow = hoverPosition.row === rowIndex && 
                                      colIndex >= hoverPosition.col && 
                                      colIndex < hoverPosition.col + hoverPosition.size;
                        } else {
                            isShadow = hoverPosition.col === colIndex && 
                                      rowIndex >= hoverPosition.row && 
                                      rowIndex < hoverPosition.row + hoverPosition.size;
                        }
                    }

                    return (
                        <td
                            key={`${rowIndex}-${colIndex}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                handleDragOver(rowIndex, colIndex);
                            }}
                            onDrop={() => handleDrop(rowIndex, colIndex)}
                            className={cell ? "ship" : isShadow ? "ship-shadow" : ""}
                        >
                            {cell ? <div className="ship"></div> : null}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div className="ship-placement-container">
            <h3>Player Board</h3>

            <div className="board">
                <table>
                    <tbody>{generatePlayerBoard()}</tbody>
                </table>
            </div>

            <div className="ships-container">
                {/* Display available ships for placement */}
                {availableShips.length > 0 ? (
                    availableShips.map((ship) => (
                        <div
                            key={ship.id}
                            className="ship-preview"
                            draggable
                            onDragStart={() => handleDragStart(ship)}
                            style={{
                                width: isHorizontal ? `${ship.size * 25}px` : "25px",
                                height: isHorizontal ? "25px" : `${ship.size * 25}px`,
                            }}
                        >
                            {ship.size}x1
                        </div>
                    ))
                ) : (
                    <p>All ships placed!</p>
                )}
                
                {/* Rotate button to change ship orientation */}
                <button className="rotate-btn" onClick={() => setIsHorizontal(!isHorizontal)}>
                    Rotate {isHorizontal ? "Vertical" : "Horizontal"}
                </button>
            </div>
        </div>
    );
};

export default ShipPlacement;

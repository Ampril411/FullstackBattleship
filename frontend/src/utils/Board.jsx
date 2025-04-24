import React, { useState } from "react";
import "../styles/Game.css";

const Board = ({ board, isPlayer, onCellClick }) => {
    const [hoveredCell, setHoveredCell] = useState(null);

    return (
        <div className="board-container">
            <h3 className="board-title">{isPlayer ? "Your Board" : "Enemy Board"}</h3>
            <div className="board">
                <table>
                    <tbody>
                        {board.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, colIndex) => {
                                    const isHovered =
                                        hoveredCell &&
                                        hoveredCell[0] === rowIndex &&
                                        hoveredCell[1] === colIndex &&
                                        !isPlayer &&
                                        !cell.hit;

                                    return (
                                        <td
                                            key={colIndex}
                                            onClick={() => !isPlayer && onCellClick(rowIndex, colIndex)}
                                            onMouseEnter={() => setHoveredCell([rowIndex, colIndex])}
                                            onMouseLeave={() => setHoveredCell(null)}
                                            className={`
                                                cell
                                                ${cell.hit ? (cell.ship ? "hit" : "misses") : ""}
                                                ${isPlayer && cell.ship && !cell.hit ? "ship" : ""}
                                                ${isHovered ? "hover-highlight" : ""}
                                            `}
                                        >
                                            {cell.hit
                                                ? cell.ship
                                                    ? "H"
                                                    : "X"
                                                : isPlayer && cell.ship
                                                ? <div className="ship-dot"></div>
                                                : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Board;
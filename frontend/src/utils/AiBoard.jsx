import "../styles/Game.css"; 

// Function to generate an AI board with randomly placed ships
export const AiBoard = (board) => {
    // Validate if the provided board is a valid 10x10 grid
    if (!board || board.length !== 10 || board[0].length !== 10) {
        console.error("Error: Invalid board initialization", board);
        return Array.from({ length: 10 }, () =>
            Array.from({ length: 10 }, () => ({ ship: false, hit: false }))
        ); // Ensure a valid 10x10 board is returned
    }

    // Define the sizes of the ships to be placed on the board
    const shipSize = [5, 4, 3, 3, 2]; // Aircraft Carrier, Battleship, Submarine, Destroyer, Patrol Boat

    // Clone the provided board to avoid modifying the original reference
    let newBoard = board.map(row => row.map(cell => ({ ...cell })));

    // Place each ship randomly on the board
    shipSize.forEach((size) => {
        let placed = false;
        while (!placed) {
            let row = Math.floor(Math.random() * 10);
            let col = Math.floor(Math.random() * 10);
            let horizontal = Math.random() > 0.5; // Randomly determine ship orientation

            // Check if the ship can be placed at the selected position
            if (canPlaceShip(newBoard, row, col, size, horizontal)) {
                // Place the ship by marking the appropriate board cells
                for (let i = 0; i < size; i++) {
                    newBoard[row + (horizontal ? 0 : i)][col + (horizontal ? i : 0)].ship = true;
                }
                placed = true;
            }
        }
    });

    return newBoard;
};

// Helper function to check if a ship can be placed at a specific location
const canPlaceShip = (board, row, col, size, horizontal) => {
    // Ensure the ship does not extend beyond the board boundaries
    if (horizontal && col + size > 10) return false;
    if (!horizontal && row + size > 10) return false;

    // Check if the ship placement overlaps with existing ships
    for (let i = 0; i < size; i++) {
        let checkRow = row + (horizontal ? 0 : i);
        let checkCol = col + (horizontal ? i : 0);

        // Prevent accessing undefined board indices
        if (checkRow >= 10 || checkCol >= 10 || board[checkRow] === undefined || board[checkRow][checkCol] === undefined) {
            return false;
        }

        if (board[checkRow][checkCol].ship) return false; // Ensure no overlap with existing ships
    }
    return true;
};

export default AiBoard;

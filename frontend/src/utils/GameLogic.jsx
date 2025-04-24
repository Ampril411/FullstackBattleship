export const generateEmptyBoard = () =>
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ ship: false, hit: false }))
    );
  
export const placeShipsRandomly = () => {
const board = generateEmptyBoard();
const sizes = [5, 4, 3, 3, 2];
for (const size of sizes) {
    let placed = false;
    while (!placed) {
    const dir = Math.random() < 0.5 ? 0 : 1;
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    let fits = true;
    for (let i = 0; i < size; i++) {
        const r = dir ? row + i : row;
        const c = dir ? col : col + i;
        if (r > 9 || c > 9 || board[r][c].ship) { fits = false; break; }
    }
    if (!fits) continue;
    for (let i = 0; i < size; i++) {
        const r = dir ? row + i : row;
        const c = dir ? col : col + i;
        board[r][c].ship = true;
    }
    placed = true;
    }
}
return board;
};

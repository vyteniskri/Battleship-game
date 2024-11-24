class Game {
    constructor() {
        this.ships = [
            { id: 1, size: 5 },
            { id: 2, size: 4 },
            { id: 3, size: 3 },
            { id: 4, size: 3 },
            { id: 5, size: 2 },
            { id: 6, size: 2 },
            { id: 7, size: 2 },
            { id: 8, size: 1 },
            { id: 9, size: 1 },
            { id: 10, size: 1 }
        ];
        this.shotsRemaining = 25;
        this.board = this.createGameBoard();
    }

    createGameBoard() {
        const board = Array(10).fill(null).map(() => Array(10).fill(0));
        this.ships.forEach((size) => this.placeShip(board, size));
        return board;
        
    }

    placeShip(board, ship) {
        const { id, size } = ship;
        let placed = false;
        while (!placed) {
            const isVertical = Math.random() > 0.5;
            const startRow = Math.floor(Math.random() * (isVertical ? 10 - size : 10));
            const startCol = Math.floor(Math.random() * (isVertical ? 10 : 10 - size));
            let canPlace = true;

            for (let i = 0; i < size; i++) {
                const row = startRow + (isVertical ? i : 0);
                const col = startCol + (isVertical ? 0 : i);
                if (board[row][col] !== 0 || !this.canPlace(board, row, col)) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                for (let i = 0; i < size; i++) {
                    const row = startRow + (isVertical ? i : 0);
                    const col = startCol + (isVertical ? 0 : i);
                    board[row][col] = id;
                }
                placed = true;
              }
  
        }
    }

    canPlace(board, row, col) {
        const neighbors = [
            [-1, -1], [1, 1], [1, -1], [-1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        return neighbors.every(([dx, dy]) => {
            const x = row + dx, y = col + dy;
            return x < 0 || y < 0 || x >= 10 || y >= 10 || board[x][y] === 0;
        });
    }
}

module.exports = Game;
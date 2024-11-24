var express = require("express");
var router = express.Router();

router.post("/", (req, res) =>{
    const { gameId, row, col } = req.body;
    const gameController = req.app.locals.gameController;

    const gameState = gameController.getGameBoard(gameId);

    if (!gameState) {
        return res.status(400).json({ error: 'Invalid game ID' });
    }

    const { board } = gameState;
    if (row < 0 || col < 0 || row >= 10 || col >= 10) {
        return res.status(400).json({ error: 'Invalid coordinates' });
    }

    if (board[row][col] === 'X' || board[row][col] === 'O') {
        return res.status(400).json({ error: 'Already guessed' });
    }

    if (board[row][col] === 0) {
        board[row][col] = 'O'; 
        gameState.shotsRemaining--;
        if (gameState.shotsRemaining === 0){
            return res.json({ result: 'miss', shotsRemaining: gameState.shotsRemaining, message: 'You lost' });
        }
        return res.json({ result: 'miss', shotsRemaining: gameState.shotsRemaining });
    } 
    else {
        const hitShipId = board[row][col];
        board[row][col] = 'X'; 
        const sunk = !board.flat().includes(hitShipId);

        const allSunk = gameState.ships.every((ship) => {
            return !board.flat().includes(ship.id); 
        });

        if (allSunk) {
            return res.json({ result: 'sunk', shotsRemaining: gameState.shotsRemaining, message: 'Game won!' });
        } 
        else {
            return res.json({ result: sunk ? 'sunk' : 'hit', shotsRemaining: gameState.shotsRemaining });
        }
      }
});

module.exports = router;
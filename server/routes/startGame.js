var express = require("express");
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get("/", (req, res) => {
    const gameId = uuidv4();
    const gameController = req.app.locals.gameController;
    gameController.startNewGame(gameId);
    const gameState = gameController.differentGames.get(gameId);

    res.json({ gameId, message: 'Game started', shotsRemaining: gameState.shotsRemaining });   
});

module.exports = router;
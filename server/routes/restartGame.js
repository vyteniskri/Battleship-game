var express = require("express");
var router = express.Router();

router.post("/", (req, res) => {
    const { gameId } = req.body;
    const gameController = req.app.locals.gameController;
    gameController.startNewGame(gameId);
    const gameState = gameController.differentGames.get(gameId);

    res.json({ message: 'Game restarted', shotsRemaining: gameState.shotsRemaining });
});

module.exports = router;
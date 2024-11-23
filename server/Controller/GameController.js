const Game = require('../Model/Game');

class GameController {

    constructor() {
        this.differentGames = new Map();
    }
  
    startNewGame(clientId) {
        const game = new Game();
        this.differentGames.set(clientId, game);
    }
  
    getGameBoard(clientId) {
        const game = this.differentGames.get(clientId);
        return game ? game : null;
    }
}

module.exports = GameController;
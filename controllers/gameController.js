const Game = require('../public/js/main');

exports.startCombat = (req, res) => {
    const { player1, player2 } = req.body;

    if (!player1 || !player2) {
        return res.status(400).json({ message: "Both players are required." });
    }

    let game = new Game(player1, player2);
    res.json({ message: "Game started", gameId: game.id });
};

exports.getGameState = (req, res) => {
    const { gameId } = req.params;
    let game = games[gameId];

    if (!game) {
        return res.status(404).json({ message: "Game not found." });
    }

    res.json(game.getState());
};

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/start', gameController.startCombat);
router.get('/state/:gameId', gameController.getGameState);

module.exports = router;

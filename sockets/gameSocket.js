const events = require("events");
const protocol = require('../config/protocol');
const Game = require('../public/js/main'); // Game logic

const emitter = new events.EventEmitter();

// Game state variables
const clientNames = {};
const opponents = {};
const games = {};
const idToClient = {};
let waitingForPair = null;

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`🟢 New player connected: ${socket.id}`);
        handlePlayer(socket);
    });
};

// Handle new player connection
function handlePlayer(client) {
    idToClient[client.id] = client;

    client.on(protocol.request.CONSOLE_LOG, (data) => {
        console.log("📩 Message from client:", data["txt"]);
    });

    client.on(protocol.request.NICKNAME, (data) => {
        clientNames[client.id] = data['name'];
        console.log(`🎮 Player "${data['name']}" joined. ID=${client.id}`);

        if (!waitingForPair) {
            console.log("Waiting for opponent...");
            waitingForPair = client;
            sendToClient(client.id, protocol.response.WAITING, null);
        } else {
            createGame(client);
        }
    });

    client.on('disconnecting', () => {
        handleDisconnect(client);
    });
}

// Create a new game and pair opponents
function createGame(client) {
    setOpponent(client);
    
    console.log("🎲 Creating game...");
    let game = new Game(client.id, opponents[client.id].id, clientNames);
    
    games[client.id] = game;
    games[opponents[client.id].id] = game;
    
    startGame(game);
}

// Assign opponents to each other
function setOpponent(client) {
    opponents[client.id] = waitingForPair;
    opponents[waitingForPair.id] = client;
    
    console.log(`🔗 Match: ${clientNames[client.id]} vs ${clientNames[waitingForPair.id]}`);

    sendToClient(waitingForPair.id, protocol.response.OPPONENT, { opponent: clientNames[client.id] });
    sendToClient(client.id, protocol.response.OPPONENT, { opponent: clientNames[waitingForPair.id] });

    waitingForPair = null;
}

// Start game process
function startGame(game) {
    console.log("🚀 Starting game...");
    sendToClients(game.players, protocol.response.GAME_START, null);
    game.init_game();

    for (let player of game.players) {
        idToClient[player].on(protocol.request.ANSWER, (data) => {
            data["player"] = player;
            sendToClients(game.players, game.next(data));
            sendToClients(game.players, game.update_info(clientNames));
        });
    }
}

// Handle player disconnection
function handleDisconnect(client) {
    console.log(`❌ Player ${client.id} disconnected.`);

    try {
        let opponent = opponents[client.id];
        if (opponent) {
            delete opponents[opponent.id];
            sendToClient(opponent.id, protocol.response.OPPONENT_LEFT, null);
        }
    } catch {
        console.log("Opponent does not exist. Continuing disconnect handling.");
    }

    delete opponents[client.id];
    delete clientNames[client.id];
    delete games[client.id];
}

// Utility functions
function sendToClient(clientId, rType, data) {
    idToClient[clientId].emit(rType, data);
}

function sendToClients(clientIds, message) {
    for (let clientId of clientIds) {
        sendToClient(clientId, message.r_type, message.data);
    }
}

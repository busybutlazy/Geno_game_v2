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
    console.log("handlePlayer start")
    client.on('disconnecting',(reason)=>{
        console.log(`⚠️ Client ${client.id} disconnecting:`, reason);
        if (waitingForPair===client){
            waitingForPair=null;
        }
        handleDisconnect(client);
        console.log(reason);
        return
    })
    idToClient[client.id] = client;
    console.log("handlePlayer end")
    handleConnect(client)
}

function handleConnect(client){
    console.log("handleConnect start")
    client.on(protocol.request.CONSOLE_LOG, (data) => {
        console.log("📩 Message from client:", data["txt"]);
    });

    client.on(protocol.request.NICKNAME, (data) => {
        clientNames[client.id] = data['name'];
        console.log(`🎮 Player "${data['name']}" joined. ID=${client.id}`);

        if (!waitingForPair) {
            console.log("Waiting for opponent...");
            waitingForPair = client;
            console.log(`📩 Sending WAITING to ${client.id}`);
            console.log("protocol.response.WAITING",protocol.response.WAITING)
            sendFormat(protocol.response.WAITING, null,[client.id]);
            console.log(`✅ WAITING sent successfully`);
        } else {
            console.log("createGame")
            createGame(client);
        }
    });

    
}



// Create a new game and pair opponents
function createGame(client) {
    setOpponent(client);
    
    console.log("🎲 Creating game...");
    let game = new Game(client.id, opponents[client.id].id, clientNames);
    
    games[client.id] = game;
    games[opponents[client.id].id] = game;

    set_ans_stage(game)
}

// Assign opponents to each other
function setOpponent(client) {
    opponents[client.id] = waitingForPair;
    opponents[waitingForPair.id] = client;
    
    console.log(`🔗 Match: ${clientNames[client.id]} vs ${clientNames[waitingForPair.id]}`);

    sendFormat(protocol.response.OPPONENT, { opponent: clientNames[client.id] },[waitingForPair.id]);
    sendFormat(protocol.response.OPPONENT, { opponent: clientNames[waitingForPair.id] },[client.id]);

    waitingForPair = null;
}

function set_ans_stage(game){
    console.log("Setting")
    console.log("game players=",clientNames[game.players[0]]," , ",clientNames[game.players[1]])
    for (let p of game.players){
        idToClient[p].on(protocol.request.SET_ANSWER,function(data){
            console.log("set_ans")
            sendToClient(game.set_ans(p,data))
            if(game.all_set()){
                startGame(game)
            }
        });
    }
    game.init_game();
    // game_processing(game)
}

// Start game process
function startGame(game) {
    console.log("🚀 Starting game...");
    sendFormat(protocol.response.GAME_START, null,game.players);
    game.game_start();
    sendToClient(game.update_info(clientNames));
    for (let player of game.players) {
        idToClient[player].on(protocol.request.ANSWER, (data) => {
            data["player"] = player;
            sendToClient(game.next(data));
            sendToClient(game.update_info(clientNames));
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
            sendFormat(protocol.response.OPPONENT_LEFT,null,opponent.id,);
        }
    } catch {
        console.log("Opponent does not exist. Continuing disconnect handling.");
    }

    delete opponents[client.id];
    delete clientNames[client.id];
    delete games[client.id];
}

// Utility functions
function sendToClient({target, rType, data}) {
    try{
        for (let clientId of target){
            console.log("rType:",rType)
            idToClient[clientId].emit(rType, data);
        }
    }catch{
        console.error("❌ sendFormat error:", error);
    }
}

function sendFormat(rType,data,target){
    formatMsg={"rType":rType,"data":data,"target":target}
    sendToClient(formatMsg)
}
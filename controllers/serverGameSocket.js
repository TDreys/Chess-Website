const chess = require('chess');
const socketio = require('socket.io');

currentGames = {}
io = null;

class ChessGame{
    game = null;
    player1 = null;
    player2 = null;
    turn = null;

    constructor(){
        this.player1 = new Player();
        this.player2 = new Player()
    }
}

class Player{
    id = null;
    ready = null;
}

function createSocket(server){
    io = socketio(server, {
        cors: {
            origin: ['*']
        }
    });

    io.on('connection', socket => {
        socket.on('disconnect',handleDisconnect)
        socket.on('createGame', handleCreateGame)
        socket.on('joinGame',  handleJoinGame)
        socket.on('ready',handleReady)
        socket.on('move',handleMove)
    })
}

function handleCreateGame(){
    do{
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        var gameID = ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
    }while(currentGames[gameID] === null)

    this.join(gameID)
    currentGames[gameID] = new ChessGame()
    currentGames[gameID].player1.ready = false
    currentGames[gameID].player1.id = this.id

    this.emit('gameID', gameID)
}

function startGame(gameID){
    gameClient = chess.create({ PGN : true })
    currentGames[gameID].game = gameClient
    currentGames[gameID].turn = currentGames[gameID].player1.id

    //send to players
    io.to(gameID).emit('game start', gameClient.getStatus(), currentGames[gameID].turn)
}

function handleReady(gameID, ready){
    let game = currentGames[gameID]
    game.player1.id == this.id ? game.player1.ready = ready : game.player2.ready = ready

    if(game.player1.ready & game.player2.ready){
        startGame(gameID)
    }
}

function handleJoinGame(gameID){
    if(currentGames[gameID] != null){
        currentGames[gameID].player2.ready = false
        currentGames[gameID].player2.id = this.id
        this.join(gameID)
    }
}


function handleDisconnect(){

}

function handleMove(gameID, move){
    //check correct turn
    if(this.id == currentGames[gameID].turn){
        //check valid move
        try {
            currentGames[gameID].game.move(move)
            io.to(gameID).emit('move', currentGames[gameID].game.getStatus())
            currentGames[gameID].turn == currentGames[gameID].player1.id ? currentGames[gameID].turn = currentGames[gameID].player2.id:currentGames[gameID].turn = currentGames[gameID].player1.id
        } 
        catch (error) {
            this.emit('invalidMove', currentGames[gameID].game.getStatus())
        }
    }
    else{
        this.emit('invalidMove', currentGames[gameID].game.getStatus())
    }
}

module.exports = {
    createSocket
}


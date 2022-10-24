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

    this.emit('joined', true,  gameID)
}

function startGame(gameID){
    gameClient = chess.create({ PGN : true })
    currentGames[gameID].game = gameClient
    currentGames[gameID].turn = currentGames[gameID].player1.id

    //send to players
    io.to(gameID).emit('game start', gameClient.getStatus(), currentGames[gameID].turn)
}

function handleReady(gameID, ready){
    let gameToHandle = currentGames[gameID]
    gameToHandle.player1.id == this.id ? gameToHandle.player1.ready = ready : gameToHandle.player2.ready = ready

    if(gameToHandle.player1.ready & gameToHandle.player2.ready){
        startGame(gameID)
    }
}

function handleJoinGame(gameID){
    let gameToHandle = currentGames[gameID]
    if(gameToHandle != null){
        gameToHandle.player2.ready = false
        gameToHandle.player2.id = this.id
        this.join(gameID)
        this.emit('joined', true, gameID)    
    }
    else{
        this.emit('joined', false, gameID)
    }
}


function handleDisconnect(){

}

function handleMove(gameID, move){

    let gameToHandle = currentGames[gameID]

    //check correct turn
    if(this.id == gameToHandle.turn){
        //check valid move
        try {
            let lastMove = gameToHandle.game.move(move)
            let status = gameToHandle.game.getStatus()
            io.to(gameID).emit('move', status, lastMove)

            if(status.isCheckmate){
                io.to(gameID).emit('game end', gameToHandle.turn)
            }else if(status.isRepetition || status.isStalemate){
                io.to(gameID).emit('game end', true)
            }else{
                gameToHandle.turn == gameToHandle.player1.id ? gameToHandle.turn = gameToHandle.player2.id : gameToHandle.turn = gameToHandle.player1.id
            }
        } 
        catch (error) {
            this.emit('invalidMove', gameToHandle.game.getStatus())
        }
    }
    else{
        this.emit('invalidMove', gameToHandle.game.getStatus())
    }
}

module.exports = {
    createSocket
}


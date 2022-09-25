const socketio = require('socket.io')
const chess = require('chess')

currentGames = {}

function createSocket(server){
    let io = socketio(server, {
        cors: {
            origin: ['*']
        }
    });

    io.on('connection', socket => {
        socket.on('disconnect',handleDisconnect)
        socket.on('createGame',handleCreateGame)
        socket.on('joinGame',handleJoinGame)
        socket.on('move',handleMove)
    })
}

function handleDisconnect(){

}

function handleCreateGame(){

}

function handleMove(){

}

function handleJoinGame(){

}


module.exports = {
    createSocket
}


import socketIOClient from "socket.io-client";

export let socket = null;

export let gameID = null;

export const connect = function(){
    socket = socketIOClient('http://localhost:5000',{ transports : ['websocket'] })
    console.log('connected')

    socket.on('gameID', (arg) => {
        gameID = arg
    })
}

export const createGame = function(){
    socket.emit('createGame')
}

export const joinGame = function(gameID){
    socket.emit('joinGame', gameID)
}

export const ready = function(ready){
    socket.emit('ready', gameID, ready)
}

export const movePiece = function(){
    
}
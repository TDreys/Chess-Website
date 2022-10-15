import socketIOClient from "socket.io-client";

export let socket = null;

export let roomID = null;

export const connect = function(){
    socket = socketIOClient('http://localhost:5000',{ transports : ['websocket'] })
    console.log('connected')

    socket.on('roomID', (arg) => {
        roomID = arg
    })
}

export const createGame = function(){
    socket.emit('createGame')
}

export const joinGame = function(roomID){
    socket.emit('joinGame', roomID)
}

export const movePiece = function(){
    
}
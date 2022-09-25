import socketIOClient from "socket.io-client";

export let socket = null;

export const connect = function(){
    console.log('connected')
    socket = socketIOClient('http://localhost:5000')
}

export const joinGame = function(roomID){

}

export const movePiece = function(){
    
}
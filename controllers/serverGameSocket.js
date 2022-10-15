const socketio = require('socket.io');
//const chess = require('chess')

currentGames = {}

function createSocket(server){
    let io = socketio(server, {
        cors: {
            origin: ['*']
        }
    });

    io.on('connection', socket => {
        console.log('new connection')
        socket.on('disconnect',handleDisconnect)

        socket.on('createGame',() => {
            //create id
            do{
                var firstPart = (Math.random() * 46656) | 0;
                var secondPart = (Math.random() * 46656) | 0;
                var roomID = ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
            }while(currentGames[roomID] === null)

            socket.join(roomID)
            currentGames[roomID] = 'create new game'
            socket.emit('roomID', roomID)
            console.log(roomID)
        })

        socket.on('joinGame',(roomID) => {
            console.log('join', roomID)
            socket.join(roomID)
            console.log(currentGames)
        })

        socket.on('move',handleMove)
    })
}


function handleDisconnect(){

}

function handleMove(){

}

module.exports = {
    createSocket
}


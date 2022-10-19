import {useState, useEffect, useRef} from 'react';
import Board from './chessBoard/Board'
import socketIOClient from "socket.io-client";
import '../css/styles.css'

function Game (){

    const ref = useRef(null)

    const [status, setStatus] = useState(null)
    const [controlState, setControlState] = useState('waiting')
    const [ready, setReady] = useState(false)
    const [socket, setSocket] = useState(null);
    const [gameID, setGameID] = useState(null);

    const connect = function(){
        let newsocket = socketIOClient('http://localhost:5000',{ transports : ['websocket'] })
    
        newsocket.on('gameID', (arg) => {
            setGameID(arg)
        })

        newsocket.on('game start', () => {
            setControlState('playing')
        })

        newsocket.on('status', (arg) => {
            setStatus(arg)
        })

        newsocket.on('invalidMove', () => {

        })

        setSocket(newsocket)
        setControlState('settingUp')
    }

    const createGame = function(){
        socket.emit('createGame')
        //todo validate connection
        setControlState('readying')
    }
    
    const joinGame = function(gameID){
        socket.emit('joinGame', gameID)
        setGameID(gameID)
        //todo validate connection
        setControlState('readying')
    }
    
    const readyUp = function(){
        socket.emit('ready', gameID, !ready)
        setReady(!ready)
    }
    
    const movePiece = (e) => {
        console.log(e.detail , status)
        let dest = [String.fromCharCode(e.detail.dest[0] + 97), e.detail.dest[1] + 1]
        let src = [String.fromCharCode(e.detail.source[0] + 97), e.detail.source[1] + 1]
        for (const [key, value] of Object.entries(status.notatedMoves)) {
            if(value.dest.file === dest[0] && value.dest.rank === dest[1] && value.src.file == src[0] && value.src.rank === src[1]){
                console.log(key)
                socket.emit('move', gameID, key)
            }
        }
    }

    const gameStatusToPieces = function(status){
        let pieces = []
        if(status != null){
            status.board.squares.forEach((square) => {
                if(square.piece != null){
                    let rank = square.rank - 1
                    let file = square.file.charCodeAt(0) - 97
                    let notation = (square.piece.side.name == 'white' ? 'w':'b') + square.piece.notation
                    pieces.push({notation: notation, transform:[file,rank], currentPosition:[file,rank]})
                }
            });
        }
        return pieces
    }

    useEffect(() => {
        const gameDiv = ref.current

        gameDiv.addEventListener('pieceDropped', movePiece, true)
        
        return () => {
            gameDiv.removeEventListener('pieceDropped', movePiece, true)
        }

    },[movePiece]);

    let gameControls = null;
    if(controlState === 'waiting'){
        gameControls = (
            <div className='gameInfo'>
                <button onClick={connect}>Play</button>
            </div>
        )
    }
    else if(controlState === 'settingUp'){
        gameControls = (
            <div className='gameInfo'>
                <button onClick={createGame}>New Game</button>
                <div>
                    <input id='gameIDInput' placeholder='Game Code' type="text" />
                    <button onClick={() => {joinGame(document.getElementById('gameIDInput').value)}}>Join Game</button>
                </div>
            </div>
        )
    }
    else if(controlState === 'readying'){
        gameControls = (
            <div className='gameInfo'>
                <h1>{gameID}</h1>
                <button onClick={readyUp}>{ready ? 'Unready' : 'Ready Up'}</button>
            </div>
        )
    }
    else if(controlState === 'playing'){
        gameControls = (
            <div className='gameInfo'>

            </div>
        )
    }

    return (
        <div ref={ref} className='game'>
            <Board pieces = {gameStatusToPieces(status)} />
            {gameControls}
        </div>
    );
}
 
export default Game;
import {useState, useEffect, useRef} from 'react';
import Board from './chessBoard/Board'
import socketIOClient from "socket.io-client";
import '../css/styles.css'

function Game (){

    const ref = useRef(null)

    const [pieces, setPieces] = useState([
        {name: 'wr', position: [0,0]},
        {name: 'wk', position: [1,0]},
        {name: 'wb', position: [2,0]},
        {name: 'bp', position: [2,6]}
    ])

    const [controlState, setControlState] = useState('waiting')
    const [ready, setReady] = useState(false)
    const [socket, setSocket] = useState(null);
    const [gameID, setGameID] = useState(null);

    const connect = function(){
        let newsocket = socketIOClient('http://localhost:5000',{ transports : ['websocket'] })
        console.log('connected')
    
        newsocket.on('gameID', (arg) => {
            console.log('game id received')
            setGameID(arg)
        })

        newsocket.on('game start', (arg) => {
            setControlState('playing')

            //set pieces
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
    
    const movePiece = function(){
        
    }

    function test(){

    }

    useEffect(() => {

        const gameDiv = ref.current

        gameDiv.addEventListener('pieceDropped', test, true)
        
        return () => {
            gameDiv.removeEventListener('pieceDropped', test, true)
        }

    },[]);

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
            <Board pieces = {pieces} />
            {gameControls}
        </div>
    );
}
 
export default Game;
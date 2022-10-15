import {useState, useEffect, useRef} from 'react';
import Board from './chessBoard/Board'
import '../css/styles.css'
import * as socket from '../services/clientSocketService'

function Game (){

    const ref = useRef(null)

    const [controlState, setControlState] = useState('waiting')

    const [pieces, setPieces] = useState([
        {name: 'wr', position: [0,0]},
        {name: 'wk', position: [1,0]},
        {name: 'wb', position: [2,0]},
        {name: 'bp', position: [2,6]}
    ])

    function play(){
        socket.connect()
        setControlState('settingUp')
    }

    function createGame(){
        socket.createGame()
        //todo validate connection
        setControlState('playing')
    }

    async function joinGame(){
        let roomID = document.getElementById('roomIDInput').value
        socket.joinGame(roomID)
        socket.roomID = roomID
        //todo validate connection
        setControlState('playing')
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

    return (
        <div ref={ref} className='game'>
            <Board pieces = {pieces} />
            <div className='gameInfo'>
                {controlState === 'waiting' && <button onClick={play}>Play</button>}
                {controlState === 'settingUp' && 
                <>
                    <button onClick={createGame}>New Game</button>
                    <div>
                        <input id='roomIDInput' placeholder='Room Code' type="text" />
                        <button onClick={joinGame}>Join Game</button>
                    </div>
                </>
                }
                {controlState === 'playing' && <></>}
            </div>
        </div>
    );
}
 
export default Game;
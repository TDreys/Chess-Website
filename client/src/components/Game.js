import {useState, useEffect, useRef} from 'react';
import Board from './chessBoard/Board'
import GameControls from './GameControls';
import '../css/styles.css'
import * as socket from '../services/clientSocketService'

function Game (){

    const ref = useRef(null)

    const [pieces, setPieces] = useState([
        {name: 'wr', position: [0,0]},
        {name: 'wk', position: [1,0]},
        {name: 'wb', position: [2,0]},
        {name: 'bp', position: [2,6]}
    ])

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
            <GameControls />
        </div>
    );
}
 
export default Game;
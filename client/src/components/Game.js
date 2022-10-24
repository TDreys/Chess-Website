import {useState, useEffect, useRef} from 'react';
import Board from './chessBoard/Board'
import socketIOClient from "socket.io-client";
import {Howl} from 'howler';
import '../css/styles.css'
import movePieceSound from '../assets/sounds/movePiece.wav'
import moveErrorSound from '../assets/sounds/moveError.wav'
import moveCaptureSound from '../assets/sounds/moveCapture.wav'
import moveCheckSound from '../assets/sounds/moveCheck.wav'
import gameStartSound from '../assets/sounds/gameStart.wav'
import gameEndSound from '../assets/sounds/gameEnd.wav'

function Game (){

    const ref = useRef(null)

    const [status, setStatus] = useState(null)
    const [controlState, setControlState] = useState('waiting')
    const [ready, setReady] = useState(false)
    const [socket, setSocket] = useState(null);
    const [gameID, setGameID] = useState(null);
    const [isWhite, setIsWhite] = useState(true);

    const connect = function(){
        let newsocket = socketIOClient('http://localhost:5000',{ transports : ['websocket'] })
    
        newsocket.on('gameID', (ID) => {
            setGameID(ID)
        })

        newsocket.on('game start', (status, whiteID) => {
            setIsWhite(whiteID == newsocket.id)
            setStatus(status)
            setControlState('playing')

            playSound(gameStartSound)
        })

        newsocket.on('move', (status, lastMove) => {
            setStatus(status)

            console.log(status.notatedMoves)

            if(status.isCheck){
                playSound(moveCheckSound)
            }else if(lastMove.move.capturedPiece != null){
                playSound(moveCaptureSound)
            }else{
                playSound(movePieceSound)
            }
        })

        newsocket.on('invalidMove', (status) => {
            setStatus(status)
            playSound(moveErrorSound)
        })

        newsocket.on('game end', (winner) => {
            if(winner == true){
                console.log('draw')
            }
            else{
                console.log(winner == newsocket.id ? 'you win' : ' you lose')
            }
            playSound(gameEndSound)
        })

        setSocket(newsocket)
        setControlState('settingUp')
    }

    const createGame = function(){
        socket.emit('createGame')
        setControlState('readying')
    }
    
    const joinGame = function(gameID){
        socket.emit('joinGame', gameID)
        setGameID(gameID)
        //todo validate game exists
        setControlState('readying')
    }
    
    const readyUp = function(){
        socket.emit('ready', gameID, !ready)
        setReady(!ready)
    }
    
    const movePiece = (e) => {
        let dest = [String.fromCharCode(e.detail.dest[0] + 97), e.detail.dest[1] + 1]
        let src = [String.fromCharCode(e.detail.source[0] + 97), e.detail.source[1] + 1]
        let foundMove = null;
        for (const [key, value] of Object.entries(status.notatedMoves)) {
            if(value.dest.file === dest[0] && value.dest.rank === dest[1] && value.src.file == src[0] && value.src.rank === src[1]){
                foundMove = key
            }
        }
        socket.emit('move', gameID, foundMove)
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
            <>
                <button onClick={connect}>Play</button>
            </>
        )
    }
    else if(controlState === 'settingUp'){
        gameControls = (
            <>
                <button onClick={createGame}>New Game</button>
                <div>
                    <input id='gameIDInput' placeholder='Game Code' type="text" />
                    <button onClick={() => {joinGame(document.getElementById('gameIDInput').value)}}>Join Game</button>
                </div>
            </>
        )
    }
    else if(controlState === 'readying'){
        gameControls = (
            <>
                <h1>{gameID}</h1>
                <button onClick={readyUp}>{ready ? 'Unready' : 'Ready Up'}</button>
            </>
        )
    }
    else if(controlState === 'playing'){
        gameControls = (
            <></>
        )
    }

    return (
        <div ref={ref} className='row mt-4'>
            <div className='col-6 offset-1 align-self-center justify-content-center'>
                <Board pieces = {gameStatusToPieces(status)} flipped={!isWhite}/>
            </div>
            <div className='col-3 d-flex align-self-center justify-content-center'>
                {gameControls}
            </div>
        </div>
    );
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

const playSound = function(sound){
    var soundToPlay = new Howl({
        src: [sound]
      });
      soundToPlay.play();
}
 
export default Game;
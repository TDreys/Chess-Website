import React from 'react'
import {useState} from 'react';
import * as socket from '../services/clientSocketService'

export default function GameControls() {

    const [controlState, setControlState] = useState('waiting')
    const [ready, setReady] = useState(false)


    function play(){
        socket.connect()
        setControlState('settingUp')
    }

    function createGame(){
        socket.createGame()
        //todo validate connection
        setControlState('readying')
    }

    function joinGame(){
        let gameID = document.getElementById('gameIDInput').value
        socket.joinGame(gameID)
        socket.gameID = gameID
        //todo validate connection
        setControlState('readying')
    }

    function readyUp(){
        if(ready){
            socket.ready(true)
        }
        else{
            socket.ready(false)
        }
    }

    if(controlState === 'waiting'){
        return(
            <div className='gameInfo'>
                <button onClick={play}>Play</button>
            </div>
        )
    }
    else if(controlState === 'settingUp'){
        return(
            <div className='gameInfo'>
                <button onClick={createGame}>New Game</button>
                <div>
                    <input id='gameIDInput' placeholder='Game Code' type="text" />
                    <button onClick={joinGame}>Join Game</button>
                </div>
            </div>
        )
    }
    else if(controlState === 'readying'){
        return(
            <div className='gameInfo'>
                <h1>{socket.gameID}</h1>
                <button onClick={readyUp}>{ready ? 'Unready' : 'Ready'}</button>
            </div>
        )
    }
    else if(controlState === 'playing'){
        return(
            <div className='gameInfo'>

            </div>
        )
    }
}

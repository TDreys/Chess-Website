import React , {useState, useRef, useEffect} from 'react'

export default function Piece(props) {

    const style = {
        transform: 'translate('+ props.position[0] * 100 +'%,'+ (700 - (props.position[1] * 100)) + '%)',
    }

    return (
        <div
            data-key = {props.itemKey}
            style={style} 
            className={'piece ' + props.name}> 
        </div>
    )
}

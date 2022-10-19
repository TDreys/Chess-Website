import React from 'react'

export default function Piece(props) {

    const style = {
        transform: 'translate('+ props.transform[0] * 100 +'%,'+ (700 - (props.transform[1] * 100)) + '%)',
    }

    return (
        <div
            data-pieceitemsindex = {props.pieceItemsIndex}
            style={style} 
            className={'piece ' + props.notation}> 
        </div>
    )
}

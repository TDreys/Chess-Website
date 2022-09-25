import React, { useEffect, useRef , useState }from 'react'
import '../../css/pieces.css'
import Piece from './Piece'

export default function Board(props) {

    const ref = useRef(null)

    var active = false
    var target = null

    const [pieces, setPieces] = useState(structuredClone(props.pieces))

    //set state when props change
    useEffect(() => {
        setPieces(structuredClone(props.pieces))
    },[props.pieces])

    //set state on init
    useEffect(() => {
        const boardDiv = ref.current;
          
        boardDiv.addEventListener("mousedown", dragStart, false);
        boardDiv.addEventListener("mouseup", dragEnd, false);
        boardDiv.addEventListener("mousemove", drag, false);
        
        return () => {
            boardDiv.removeEventListener("mousedown", dragStart, false);
            boardDiv.removeEventListener("mouseup", dragEnd, false);
            boardDiv.removeEventListener("mousemove", drag ,false);
        }
        
      },[]);

    const dragStart = (e) => {
        if (e.target.className.includes('piece')) {
            var mouseX = e.clientX - ref.current.offsetLeft 
            var mouseY = e.clientY - ref.current.offsetTop

            target = e.target
            var xPos = (mouseX - target.offsetWidth/2)/(ref.current.offsetWidth/8)
            var yPos = 7-((mouseY - target.offsetHeight/2)/(ref.current.offsetHeight/8))

            setPieces(pieces => {
                let updated = structuredClone(pieces)
                updated[target.dataset.key].position = [xPos, yPos]
                return updated
            })

            active = true;
        }
    }

    const drag = (e) => {
        if (active) {
            e.preventDefault();
        
            var mouseX = e.clientX - ref.current.offsetLeft 
            var mouseY = e.clientY - ref.current.offsetTop 

            var xPos = (mouseX - target.offsetWidth/2)/(ref.current.offsetWidth/8)
            var yPos = 7-((mouseY - target.offsetHeight/2)/(ref.current.offsetHeight/8))

            setPieces(pieces => {
                let updated = structuredClone(pieces)
                updated[target.dataset.key].position = [xPos, yPos]
                return updated
            })
        }
    }

    const dragEnd = (e) => {
        if(active){
            var mouseX = e.clientX - ref.current.offsetLeft 
            var mouseY = e.clientY - ref.current.offsetTop

            var xPos = Math.floor(mouseX/(ref.current.offsetWidth/8))
            var yPos = 7-Math.floor(mouseY/(ref.current.offsetHeight/8))

            setPieces(pieces => {
                let updated = structuredClone(pieces)
                updated[target.dataset.key].position = [xPos, yPos]
                return updated
            })

            const event = new CustomEvent('pieceDropped',{
                detail: {text:'rah'},
                bubbles: true,
            })
            ref.current.dispatchEvent(event)
        }
        active = false;
    }

    return (
        <div ref = {ref} className='board'>
            {pieces.map((piece, i) => {
                return <Piece key={i} itemKey={i} name = {piece.name} position = {piece.position}/>
            })}
        </div>
    )
}

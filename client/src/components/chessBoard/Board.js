import React, { useEffect, useRef , useState }from 'react'
import '../../css/pieces.css'
import Piece from './Piece'

export default function Board(props) {

    const ref = useRef(null)

    const [pieceItems, setPieceItems] = useState([])
    const [active, setActive] = useState(false)
    const [clickTarget, setClickTarget] = useState(null)

    //set state when props change
    useEffect(() => {
        let newPieces = structuredClone(props.pieces)
        if(props.flipped){
            newPieces.forEach(piece => {
                piece.transform = [7 - piece.transform[0], 7 - piece.transform[1]]
                piece.currentPosition = [7 - piece.currentPosition[0], 7 - piece.currentPosition[1]]
            });
        }
        setPieceItems(newPieces)
    },[props])

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
        
      });

    const dragStart = (e) => {
        if (e.target.className.includes('piece')) {
            let mouseX = e.clientX - ref.current.offsetLeft 
            let mouseY = e.clientY - ref.current.offsetTop

            setClickTarget(e.target)
            let tempClickTarget = e.target

            let xPos = (mouseX - tempClickTarget.offsetWidth/2)/(ref.current.offsetWidth/8)
            let yPos = 7-((mouseY - tempClickTarget.offsetHeight/2)/(ref.current.offsetHeight/8))

            setPieceItems(pieces => {
                let updated = structuredClone(pieces)
                updated[tempClickTarget.dataset.pieceitemsindex].transform = [xPos, yPos]
                return updated
            })

            setActive(true);
        }
    }

    const drag = (e) => {
        if (active) {
            e.preventDefault();
        
            var mouseX = e.clientX - ref.current.offsetLeft 
            var mouseY = e.clientY - ref.current.offsetTop 

            var xPos = (mouseX - clickTarget.offsetWidth/2)/(ref.current.offsetWidth/8)
            var yPos = 7-((mouseY - clickTarget.offsetHeight/2)/(ref.current.offsetHeight/8))

            setPieceItems(pieces => {
                let updated = structuredClone(pieces)
                updated[clickTarget.dataset.pieceitemsindex].transform = [xPos, yPos]
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

            let source = pieceItems[clickTarget.dataset.pieceitemsindex].currentPosition
            let dest = [xPos, yPos]

            console.log(source, dest)
            if(source[0] != dest[0] || source[1] != dest[1]) {
                const event = new CustomEvent('pieceDropped',{
                    detail: {
                        source: props.flipped ? [7 - source[0], 7 - source[1]] : source,
                        dest: props.flipped ? [7 - dest[0], 7 - dest[1]] : dest
                    },
                    bubbles: true,
                })
                ref.current.dispatchEvent(event)
            }

            setPieceItems(pieces => {
                let updated = structuredClone(pieces)
                updated[clickTarget.dataset.pieceitemsindex].transform = dest
                updated[clickTarget.dataset.pieceitemsindex].currentPosition = dest
                return updated
            })

        }
        setActive(false);
    }

    return (
        <div ref = {ref} className='board'>
            {pieceItems.map((piece, i) => {
                return <Piece 
                    key={i} 
                    pieceItemsIndex={i} 
                    notation = {piece.notation} 
                    transform = {piece.transform}
                />
            })}
        </div>
    )
}

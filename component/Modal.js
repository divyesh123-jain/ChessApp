import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";


function Modal({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");

  // onDrop function
  function onDrop() {} // <- 3
  
  // Game component returned jsx
  return (
    <>
  
<div className="w-1/3">
    <div className="board " style={{
        
        display: 'flex',
      
        margin: "auto", 
        paddingTop:"10",
        paddingBottom:"10",
        alignItems: 'center',
        maxWidth: 690,
        maxHeight: 900,
        flexGrow: 3,
      }}>
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
        />
      </div>
      </div>
    
    </>
  );
}

export default Modal;
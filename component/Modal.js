import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect } from 'react';

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());
  // console.log('🚀 ~ PlayRandomMoveEngine ~ game:', game);

  // const chess = new Chess();

  // while (!chess.isGameOver()) {
  //   const moves = chess.moves();
  //   const move = moves[Math.floor(Math.random() * moves.length)];
  //   // console.log("🚀 ~ PlayRandomMoveEngine ~ move:", move);
  //   chess.move(move);
  // }
  // console.log(chess.pgn());

  function makeAMove(move) {
    const gameCopy = cloneDeep(game);
    // console.log("🚀 ~ makeAMove ~ gameCopy:", gameCopy);
    // const moves = gameCopy.moves();
    if (
      gameCopy.isGameOver() ||
      gameCopy.isDraw() ||
      gameCopy.moves().length === 0
    ) {
      // exit if the game is over
      console.log('game over');
      return;
    }
    const result = gameCopy.move(move);
    setGame(gameCopy);
        // console.log('Checkmated? ', game.isCheckmate());
        // console.log('Check? ', game.isCheck());

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });
    // console.log('Checkmated? ', game.isCheckmate());
    // console.log('Check? ', game.isCheck());

    // illegal move
    if (move === null) {
      console.log('Illegal move!');
      return false;
    }
    // setTimeout(makeRandomMove, 200);
    return true;
  }

  useEffect(() => {
    console.log('Checkmated? ', game.isCheckmate());
    console.log('Check? ', game.isCheck());
    console.log('Game over? ', game.isGameOver());
  }, [game]);

  // return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;

  return (
    <div className="w-[400px]">
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}
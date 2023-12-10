import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function PlayRandomMoveEngine() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
    try {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to a queen for example simplicity
      });
      // console.log(game.turn());

      if (move === null) {
        console.log('Illegal move!');
        return false;
      }
    } catch (error) {
      console.log('This is a illegal move');
      console.log('Who got turn right now? ', game.turn() === 'b' ? 'black' : 'white');
    }

    // console.log('Checkmated? ', game.isCheckmate());
    // console.log('Check? ', game.isCheck());

    // illegal move

    // setTimeout(makeRandomMove, 200);
    return true;
  }

  useEffect(() => {
    console.log('Checkmated? ', game.isCheckmate());
    // console.log('Check? ', game.isCheck());
    // console.log('Game over? ', game.isGameOver());
    // console.log(game.turn());

    if (game.isCheckmate()) {
      openModal();
      console.log('The Winner is: ', game.turn() === 'w' ? 'black' : 'white');
    }
  }, [game]);

  function announceWinnerAndCongratulate(game) {
    // Determine the winner
    const winnerColor = game.turn() === 'w' ? 'black' : 'white';
  
    // Log the winner's color in the console
    console.log('The Winner is:', winnerColor);
  
    // Create a message for the winner
    const congratulatoryMessage = 'Well played and the winner is ' + (winnerColor === 'black' ? 'black' : 'white') + '! Congratulations on your win!';
  
    // Display the message outside the console
    alert(congratulatoryMessage);
  }
  // return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;

  return (
    <>
      {/* <div className=" flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Chess champion, you are! 🏆👑
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Well played and the winner is  and congrats on your win!
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Yay!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div style={{
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 690,
        maxHeight: 900,
        flexGrow: 3,
      }}>
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      </div>
    </>
  );
}
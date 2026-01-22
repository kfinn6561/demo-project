/**
 * GameStatus component - Displays turn indicator and game end messages
 */

import { Color, GameStatus as GameStatusEnum } from "../lib/types";

interface GameStatusProps {
  currentTurn: Color;
  gameStatus: GameStatusEnum;
  winner: Color | null;
}

export default function GameStatus({
  currentTurn,
  gameStatus,
  winner,
}: GameStatusProps) {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case GameStatusEnum.CHECKMATE:
        return (
          <div className="text-2xl font-bold text-red-600">
            Checkmate! {winner === Color.WHITE ? "White" : "Black"} wins!
          </div>
        );
      case GameStatusEnum.STALEMATE:
        return (
          <div className="text-2xl font-bold text-yellow-600">
            Stalemate! Game is a draw.
          </div>
        );
      case GameStatusEnum.DRAW:
        return (
          <div className="text-2xl font-bold text-yellow-600">
            Draw!
          </div>
        );
      case GameStatusEnum.CHECK:
        return (
          <div className="text-xl font-semibold text-orange-600">
            Check! {currentTurn === Color.WHITE ? "White" : "Black"} to move.
          </div>
        );
      case GameStatusEnum.IN_PROGRESS:
      default:
        return (
          <div className="text-xl font-semibold">
            {currentTurn === Color.WHITE ? "White" : "Black"} to move
          </div>
        );
    }
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md min-h-[80px] flex items-center justify-center">
      {getStatusMessage()}
    </div>
  );
}

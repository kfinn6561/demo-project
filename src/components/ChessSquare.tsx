/**
 * ChessSquare component - Renders a single square on the chess board
 */

import { Square } from "../lib/types";
import ChessPiece from "./ChessPiece";

interface ChessSquareProps {
  square: Square;
  onClick: () => void;
}

export default function ChessSquare({ square, onClick }: ChessSquareProps) {
  const { position, piece, isHighlighted } = square;
  const { row, col } = position;

  // Determine square color (checkerboard pattern)
  const isLightSquare = (row + col) % 2 === 0;
  const squareColor = isLightSquare ? "bg-amber-100" : "bg-amber-600";

  return (
    <button
      onClick={onClick}
      className={`
        relative w-16 h-16 flex items-center justify-center
        ${squareColor}
        hover:opacity-80 transition-opacity
        ${isHighlighted ? "ring-4 ring-green-500 ring-inset" : ""}
      `}
      aria-label={`Square ${String.fromCharCode(97 + col)}${8 - row}`}
    >
      {piece && <ChessPiece piece={piece} />}
      {isHighlighted && !piece && (
        <div className="w-4 h-4 bg-green-500 rounded-full opacity-60" />
      )}
    </button>
  );
}

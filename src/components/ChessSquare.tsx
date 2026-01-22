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

  // Check if this is a capturable square (highlighted square with opponent piece)
  const isCapturable = isHighlighted && piece;

  return (
    <button
      onClick={onClick}
      className={`
        chess-square
        relative w-16 h-16 flex items-center justify-center
        ${squareColor}
        ${isHighlighted ? "highlighted" : ""}
        ${isHighlighted && !isCapturable ? "ring-4 ring-green-500 ring-inset" : ""}
        ${isCapturable ? "ring-4 ring-red-500 ring-inset" : ""}
      `}
      aria-label={`Square ${String.fromCharCode(97 + col)}${8 - row}`}
    >
      {piece && <ChessPiece piece={piece} />}
      {isHighlighted && !piece && (
        <div className="highlight-dot w-4 h-4 bg-green-500 rounded-full" />
      )}
      {isCapturable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="highlight-ring w-14 h-14 border-4 border-red-500 rounded-full" />
        </div>
      )}
    </button>
  );
}

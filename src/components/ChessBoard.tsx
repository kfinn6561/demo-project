/**
 * ChessBoard component - Renders the 8x8 chess board grid
 */

"use client";

import { Board, Position } from "../lib/types";
import ChessSquare from "./ChessSquare";

interface ChessBoardProps {
  board: Board;
  onSquareClick: (position: Position) => void;
}

export default function ChessBoard({ board, onSquareClick }: ChessBoardProps) {
  return (
    <div className="inline-block border-4 border-gray-800 shadow-2xl">
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              square={square}
              onClick={() => onSquareClick(square.position)}
            />
          ))
        )}
      </div>
    </div>
  );
}

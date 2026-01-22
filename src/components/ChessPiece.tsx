/**
 * ChessPiece component - Renders a chess piece using Unicode symbols
 */

import { memo } from "react";
import { Piece, PieceType, Color } from "../lib/types";

interface ChessPieceProps {
  piece: Piece;
}

const PIECE_SYMBOLS: Record<Color, Record<PieceType, string>> = {
  [Color.WHITE]: {
    [PieceType.KING]: "♔",
    [PieceType.QUEEN]: "♕",
    [PieceType.ROOK]: "♖",
    [PieceType.BISHOP]: "♗",
    [PieceType.KNIGHT]: "♘",
    [PieceType.PAWN]: "♙",
  },
  [Color.BLACK]: {
    [PieceType.KING]: "♚",
    [PieceType.QUEEN]: "♛",
    [PieceType.ROOK]: "♜",
    [PieceType.BISHOP]: "♝",
    [PieceType.KNIGHT]: "♞",
    [PieceType.PAWN]: "♟",
  },
};

function ChessPieceComponent({ piece }: ChessPieceProps) {
  const symbol = PIECE_SYMBOLS[piece.color][piece.type];

  return (
    <span
      className="text-3xl sm:text-5xl leading-none select-none"
      role="img"
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ChessPieceComponent);

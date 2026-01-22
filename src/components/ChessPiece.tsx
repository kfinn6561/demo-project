/**
 * ChessPiece component - Renders a chess piece using Unicode symbols
 */

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

export default function ChessPiece({ piece }: ChessPieceProps) {
  const symbol = PIECE_SYMBOLS[piece.color][piece.type];

  return (
    <span
      className="text-5xl leading-none select-none"
      role="img"
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  );
}

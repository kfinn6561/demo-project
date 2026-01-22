/**
 * Core type definitions for the chess game application.
 * These types represent the fundamental entities and enums used throughout the game.
 */

/**
 * Enumeration of chess piece types
 */
export enum PieceType {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  PAWN = "pawn",
}

/**
 * Enumeration of player colors
 */
export enum Color {
  WHITE = "white",
  BLACK = "black",
}

/**
 * Represents a position on the chess board
 * Row 0 = rank 8 (black's back rank, top of board)
 * Row 7 = rank 1 (white's back rank, bottom of board)
 * Col 0 = file 'a', Col 7 = file 'h'
 */
export interface Position {
  row: number; // 0-7
  col: number; // 0-7
}

/**
 * Represents a chess piece on the board
 */
export interface Piece {
  id: string; // Unique identifier (e.g., "white-king", "black-pawn-1")
  type: PieceType;
  color: Color;
  position: Position;
  hasMoved: boolean; // Track for castling and pawn first-move rules
}

/**
 * Represents a single square on the chess board
 */
export interface Square {
  position: Position;
  piece: Piece | null; // null if empty
  isHighlighted: boolean; // UI state for move highlighting
}

/**
 * Type of special chess moves
 */
export enum SpecialMoveType {
  CASTLE_KINGSIDE = "castle-kingside",
  CASTLE_QUEENSIDE = "castle-queenside",
  EN_PASSANT = "en-passant",
  PROMOTION = "promotion",
}

/**
 * Represents a single chess move
 */
export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  specialMove?: SpecialMoveType;
  timestamp: number; // Unix timestamp in milliseconds
}

/**
 * Represents the current game status
 */
export enum GameStatus {
  IN_PROGRESS = "in-progress",
  CHECK = "check",
  CHECKMATE = "checkmate",
  STALEMATE = "stalemate",
  DRAW = "draw",
}

/**
 * 8x8 grid of squares representing the chess board
 */
export type Board = Square[][];

/**
 * Root state object representing the entire game
 */
export interface GameState {
  board: Board;
  currentTurn: Color;
  selectedPiece: Piece | null;
  moveHistory: Move[];
  gameStatus: GameStatus;
  winner: Color | null;
}

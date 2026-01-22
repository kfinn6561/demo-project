/**
 * Game state initialization and management functions
 */

import {
  Board,
  Square,
  Piece,
  PieceType,
  Color,
  Position,
  GameState,
  GameStatus,
} from "./types";

/**
 * Creates a piece with the given properties
 */
function createPiece(
  id: string,
  type: PieceType,
  color: Color,
  position: Position
): Piece {
  return {
    id,
    type,
    color,
    position,
    hasMoved: false,
  };
}

/**
 * Initializes an 8x8 chess board with all pieces in their starting positions
 * Row 0 = Black's back rank (top)
 * Row 7 = White's back rank (bottom)
 */
export function initializeBoard(): Board {
  // Create empty 8x8 board
  const board: Board = [];
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      board[row][col] = {
        position: { row, col },
        piece: null,
        isHighlighted: false,
      };
    }
  }

  // Set up black pieces (row 0 and 1)
  const blackBackRank: PieceType[] = [
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.ROOK,
  ];

  for (let col = 0; col < 8; col++) {
    // Black back rank
    board[0][col].piece = createPiece(
      `black-${blackBackRank[col]}-${col}`,
      blackBackRank[col],
      Color.BLACK,
      { row: 0, col }
    );

    // Black pawns
    board[1][col].piece = createPiece(
      `black-pawn-${col}`,
      PieceType.PAWN,
      Color.BLACK,
      { row: 1, col }
    );
  }

  // Set up white pieces (row 6 and 7)
  const whiteBackRank: PieceType[] = [
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.ROOK,
  ];

  for (let col = 0; col < 8; col++) {
    // White pawns
    board[6][col].piece = createPiece(
      `white-pawn-${col}`,
      PieceType.PAWN,
      Color.WHITE,
      { row: 6, col }
    );

    // White back rank
    board[7][col].piece = createPiece(
      `white-${whiteBackRank[col]}-${col}`,
      whiteBackRank[col],
      Color.WHITE,
      { row: 7, col }
    );
  }

  return board;
}

/**
 * Creates the initial game state with a fresh board
 */
export function createInitialGameState(): GameState {
  return {
    board: initializeBoard(),
    currentTurn: Color.WHITE,
    selectedPiece: null,
    moveHistory: [],
    gameStatus: GameStatus.IN_PROGRESS,
    winner: null,
  };
}

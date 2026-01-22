/**
 * Move generation and validation with check prevention
 */

import {
  Piece,
  Position,
  Board,
  PieceType,
  Color,
} from "./types";
import {
  isValidPosition,
  isValidPawnMove,
  isValidRookMove,
  isValidKnightMove,
  isValidBishopMove,
  isValidQueenMove,
  isValidKingMove,
} from "./chess-rules";

/**
 * Generates all pseudo-legal moves for a piece (before check validation)
 * Returns array of valid destination positions
 */
export function getPseudoLegalMoves(piece: Piece, board: Board): Position[] {
  const moves: Position[] = [];

  // Check all possible positions on the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const targetPos: Position = { row, col };

      // Skip current position
      if (targetPos.row === piece.position.row && targetPos.col === piece.position.col) {
        continue;
      }

      // Check if move is valid based on piece type
      let isValid = false;
      switch (piece.type) {
        case PieceType.PAWN:
          isValid = isValidPawnMove(piece, targetPos, board);
          break;
        case PieceType.ROOK:
          isValid = isValidRookMove(piece, targetPos, board);
          break;
        case PieceType.KNIGHT:
          isValid = isValidKnightMove(piece, targetPos, board);
          break;
        case PieceType.BISHOP:
          isValid = isValidBishopMove(piece, targetPos, board);
          break;
        case PieceType.QUEEN:
          isValid = isValidQueenMove(piece, targetPos, board);
          break;
        case PieceType.KING:
          isValid = isValidKingMove(piece, targetPos, board);
          break;
      }

      if (isValid) {
        moves.push(targetPos);
      }
    }
  }

  return moves;
}

/**
 * Generates all legal moves for a piece (pseudo-legal moves that don't leave king in check)
 */
export function getLegalMoves(piece: Piece, board: Board): Position[] {
  const pseudoLegalMoves = getPseudoLegalMoves(piece, board);

  // Filter out moves that would leave own king in check
  return pseudoLegalMoves.filter(move => !leavesKingInCheck(board, piece, move));
}

/**
 * Simulates a move and checks if it would leave the player's king in check
 */
function leavesKingInCheck(board: Board, piece: Piece, targetPos: Position): boolean {
  // Create a copy of the board to simulate the move
  const simulatedBoard = simulateMove(board, piece, targetPos);

  // Check if the player's king is in check after the simulated move
  return isKingInCheck(simulatedBoard, piece.color);
}

/**
 * Creates a copy of the board with a simulated move applied
 */
function simulateMove(board: Board, piece: Piece, targetPos: Position): Board {
  // Deep copy the board
  const newBoard: Board = board.map(row =>
    row.map(square => ({
      ...square,
      piece: square.piece ? { ...square.piece, position: { ...square.piece.position } } : null,
    }))
  );

  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  // Find the piece in the new board
  const movingPiece = newBoard[fromRow][fromCol].piece;
  if (!movingPiece) return newBoard;

  // Apply the move
  newBoard[toRow][toCol].piece = {
    ...movingPiece,
    position: { row: toRow, col: toCol },
    hasMoved: true,
  };
  newBoard[fromRow][fromCol].piece = null;

  return newBoard;
}

/**
 * Checks if the king of the specified color is currently in check
 */
export function isKingInCheck(board: Board, color: Color): boolean {
  // Find the king's position
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.type === PieceType.KING && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) {
    // King not found (shouldn't happen in valid game)
    return false;
  }

  // Check if any opponent piece can attack the king
  const opponentColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.color === opponentColor) {
        // Check if this opponent piece can attack the king's position
        const canAttack = canPieceAttackPosition(piece, kingPos, board);
        if (canAttack) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Checks if a piece can attack a specific position
 * This is similar to pseudo-legal move generation but doesn't filter by check
 */
function canPieceAttackPosition(piece: Piece, targetPos: Position, board: Board): boolean {
  switch (piece.type) {
    case PieceType.PAWN:
      return isValidPawnMove(piece, targetPos, board);
    case PieceType.ROOK:
      return isValidRookMove(piece, targetPos, board);
    case PieceType.KNIGHT:
      return isValidKnightMove(piece, targetPos, board);
    case PieceType.BISHOP:
      return isValidBishopMove(piece, targetPos, board);
    case PieceType.QUEEN:
      return isValidQueenMove(piece, targetPos, board);
    case PieceType.KING:
      return isValidKingMove(piece, targetPos, board);
    default:
      return false;
  }
}

/**
 * Checks if the specified color is in checkmate
 * (king is in check and has no legal moves to escape)
 */
export function isCheckmate(board: Board, color: Color): boolean {
  // First, check if king is in check
  if (!isKingInCheck(board, color)) {
    return false;
  }

  // Check if any piece of this color has a legal move
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(piece, board);
        if (legalMoves.length > 0) {
          return false; // Found a legal move, not checkmate
        }
      }
    }
  }

  return true; // No legal moves available while in check
}

/**
 * Checks if the specified color is in stalemate
 * (not in check but has no legal moves)
 */
export function isStalemate(board: Board, color: Color): boolean {
  // First, check if king is NOT in check
  if (isKingInCheck(board, color)) {
    return false;
  }

  // Check if any piece of this color has a legal move
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(piece, board);
        if (legalMoves.length > 0) {
          return false; // Found a legal move, not stalemate
        }
      }
    }
  }

  return true; // No legal moves available while not in check
}

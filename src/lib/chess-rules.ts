/**
 * Chess rules validation and move generation utilities
 */

import { Position, Piece, PieceType, Color, Board } from "./types";

/**
 * Checks if a position is within the valid board bounds (0-7 for row and col)
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row <= 7 &&
    position.col >= 0 &&
    position.col <= 7
  );
}

/**
 * Checks if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Creates a new position object
 */
export function createPosition(row: number, col: number): Position {
  return { row, col };
}

/**
 * Validates pawn movement rules
 * - Forward 1 square (or 2 on first move)
 * - Diagonal capture only
 * - En passant capture
 */
export function isValidPawnMove(
  piece: Piece,
  targetPos: Position,
  board: Board,
  lastMove?: { piece: Piece; from: Position; to: Position } | null
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const direction = piece.color === Color.WHITE ? -1 : 1;
  const startRow = piece.color === Color.WHITE ? 6 : 1;
  const rowDiff = toRow - fromRow;
  const colDiff = Math.abs(toCol - fromCol);

  const targetSquare = board[toRow][toCol];
  const targetPiece = targetSquare.piece;

  // Forward move (1 or 2 squares)
  if (colDiff === 0) {
    // One square forward
    if (rowDiff === direction && !targetPiece) {
      return true;
    }
    // Two squares forward on first move
    if (
      !piece.hasMoved &&
      fromRow === startRow &&
      rowDiff === direction * 2 &&
      !targetPiece &&
      !board[fromRow + direction][fromCol].piece
    ) {
      return true;
    }
  }

  // Diagonal capture
  if (colDiff === 1 && rowDiff === direction) {
    // Regular capture
    if (targetPiece && targetPiece.color !== piece.color) {
      return true;
    }

    // En passant capture
    if (!targetPiece && lastMove) {
      const enPassantRow = piece.color === Color.WHITE ? 3 : 4;
      const lastMovePiece = lastMove.piece;

      // Check if last move was a pawn moving two squares
      if (
        fromRow === enPassantRow &&
        lastMovePiece.type === PieceType.PAWN &&
        lastMovePiece.color !== piece.color &&
        Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
        lastMove.to.row === fromRow &&
        lastMove.to.col === toCol
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validates rook movement rules
 * - Horizontal or vertical lines only
 */
export function isValidRookMove(
  piece: Piece,
  targetPos: Position,
  board: Board
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  // Must move horizontally or vertically (not both)
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  // Check if path is clear
  if (!isPathClear(piece.position, targetPos, board)) {
    return false;
  }

  // Check target square
  const targetPiece = board[toRow][toCol].piece;
  return !targetPiece || targetPiece.color !== piece.color;
}

/**
 * Validates knight movement rules
 * - L-shaped moves (2 in one direction, 1 in perpendicular)
 */
export function isValidKnightMove(
  piece: Piece,
  targetPos: Position,
  board: Board
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Knight moves in L-shape: 2+1 or 1+2
  const isLShape = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

  if (!isLShape) {
    return false;
  }

  // Check target square
  const targetPiece = board[toRow][toCol].piece;
  return !targetPiece || targetPiece.color !== piece.color;
}

/**
 * Validates bishop movement rules
 * - Diagonal lines only
 */
export function isValidBishopMove(
  piece: Piece,
  targetPos: Position,
  board: Board
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Must move diagonally (same distance in both directions)
  if (rowDiff !== colDiff || rowDiff === 0) {
    return false;
  }

  // Check if path is clear
  if (!isPathClear(piece.position, targetPos, board)) {
    return false;
  }

  // Check target square
  const targetPiece = board[toRow][toCol].piece;
  return !targetPiece || targetPiece.color !== piece.color;
}

/**
 * Validates queen movement rules
 * - Combination of rook and bishop (horizontal, vertical, or diagonal)
 */
export function isValidQueenMove(
  piece: Piece,
  targetPos: Position,
  board: Board
): boolean {
  // Queen can move like a rook or bishop
  return isValidRookMove(piece, targetPos, board) || isValidBishopMove(piece, targetPos, board);
}

/**
 * Validates king movement rules
 * - One square in any direction
 * - Castling (kingside and queenside)
 */
export function isValidKingMove(
  piece: Piece,
  targetPos: Position,
  board: Board
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Regular king move: one square in any direction
  if (rowDiff <= 1 && colDiff <= 1) {
    const targetPiece = board[toRow][toCol].piece;
    return !targetPiece || targetPiece.color !== piece.color;
  }

  // Check for castling (2 squares horizontally)
  if (rowDiff === 0 && colDiff === 2 && !piece.hasMoved) {
    return canCastle(piece, targetPos, board);
  }

  return false;
}

/**
 * Checks if castling is valid
 * Requirements:
 * - King hasn't moved
 * - Rook hasn't moved
 * - Path between king and rook is clear
 * - King is not in check
 * - King doesn't move through check
 * - King doesn't end in check
 */
export function canCastle(
  king: Piece,
  targetPos: Position,
  board: Board
): boolean {
  if (king.hasMoved) return false;

  const { row, col: kingCol } = king.position;
  const { col: targetCol } = targetPos;

  // Determine if kingside or queenside
  const isKingside = targetCol > kingCol;
  const rookCol = isKingside ? 7 : 0;
  const rook = board[row][rookCol].piece;

  // Check if rook exists and hasn't moved
  if (!rook || rook.type !== PieceType.ROOK || rook.hasMoved || rook.color !== king.color) {
    return false;
  }

  // Check if path is clear between king and rook
  const direction = isKingside ? 1 : -1;
  const startCol = kingCol + direction;
  const endCol = isKingside ? rookCol - 1 : rookCol + 1;

  for (let col = startCol; isKingside ? col <= endCol : col >= endCol; col += direction) {
    if (board[row][col].piece !== null) {
      return false;
    }
  }

  // Note: Check validation (king not in check, doesn't move through check)
  // will be handled by the legal move generator
  return true;
}

/**
 * Checks if the path between two positions is clear of obstacles
 * Works for horizontal, vertical, and diagonal paths
 * Does not check the target position itself
 */
export function isPathClear(from: Position, to: Position, board: Board): boolean {
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  // Check each square along the path (excluding start and end)
  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol].piece !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

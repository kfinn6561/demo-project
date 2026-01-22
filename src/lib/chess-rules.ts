/**
 * Chess rules validation and move generation utilities
 */

import { Position } from "./types";

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

/**
 * Game state initialization and management functions
 */

"use client";

import { useState, useCallback } from "react";
import {
  Board,
  Square,
  Piece,
  PieceType,
  Color,
  Position,
  GameState,
  GameStatus,
  Move,
  SpecialMoveType,
} from "./types";
import {
  getLegalMoves,
  isKingInCheck,
  isCheckmate,
  isStalemate,
} from "./move-generator";
import { positionsEqual } from "./chess-rules";

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
    lastMove: null,
  };
}

/**
 * Custom hook for managing chess game state
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );

  /**
   * Handles square click - either selects a piece or moves a selected piece
   */
  const handleSquareClick = useCallback(
    (position: Position) => {
      // Don't allow moves if game is over
      if (
        gameState.gameStatus === GameStatus.CHECKMATE ||
        gameState.gameStatus === GameStatus.STALEMATE ||
        gameState.gameStatus === GameStatus.DRAW
      ) {
        return;
      }

      const clickedSquare = gameState.board[position.row][position.col];
      const clickedPiece = clickedSquare.piece;

      // If no piece is selected
      if (!gameState.selectedPiece) {
        // Select piece if it belongs to the current player
        if (clickedPiece && clickedPiece.color === gameState.currentTurn) {
          selectPiece(clickedPiece);
        }
      } else {
        // If piece is already selected
        // If clicking the same piece, deselect it
        if (
          clickedPiece &&
          clickedPiece.id === gameState.selectedPiece.id
        ) {
          deselectPiece();
        }
        // If clicking another piece of the same color, select that piece instead
        else if (
          clickedPiece &&
          clickedPiece.color === gameState.currentTurn
        ) {
          selectPiece(clickedPiece);
        }
        // If clicking a highlighted square (valid move), execute the move
        else if (clickedSquare.isHighlighted) {
          executeMove(gameState.selectedPiece, position);
        }
        // If clicking a non-highlighted square, deselect (cancel selection)
        else {
          deselectPiece();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState]
  );

  /**
   * Selects a piece and highlights its legal moves
   */
  const selectPiece = useCallback(
    (piece: Piece) => {
      const legalMoves = getLegalMoves(piece, gameState.board, gameState.lastMove);

      // Create new board with highlights
      const newBoard = gameState.board.map((row) =>
        row.map((square) => ({
          ...square,
          isHighlighted: legalMoves.some((move) =>
            positionsEqual(move, square.position)
          ),
        }))
      );

      setGameState({
        ...gameState,
        selectedPiece: piece,
        board: newBoard,
      });
    },
    [gameState]
  );

  /**
   * Deselects the current piece and removes highlights
   */
  const deselectPiece = useCallback(() => {
    // Remove all highlights
    const newBoard = gameState.board.map((row) =>
      row.map((square) => ({
        ...square,
        isHighlighted: false,
      }))
    );

    setGameState({
      ...gameState,
      selectedPiece: null,
      board: newBoard,
    });
  }, [gameState]);

  /**
   * Executes a move if legal
   */
  const executeMove = useCallback(
    (piece: Piece, targetPos: Position) => {
      // Check if move is legal
      const legalMoves = getLegalMoves(piece, gameState.board, gameState.lastMove);
      const isLegalMove = legalMoves.some((move) =>
        positionsEqual(move, targetPos)
      );

      if (!isLegalMove) {
        // Invalid move - just deselect
        deselectPiece();
        return;
      }

      // Create new board with the move applied
      const newBoard = gameState.board.map((row) =>
        row.map((square) => ({ ...square, isHighlighted: false }))
      );

      const { row: fromRow, col: fromCol } = piece.position;
      const { row: toRow, col: toCol } = targetPos;

      // Capture piece if present
      let capturedPiece = newBoard[toRow][toCol].piece;
      let specialMove: SpecialMoveType | undefined;

      // Handle special moves

      // Castling
      if (piece.type === PieceType.KING && Math.abs(toCol - fromCol) === 2) {
        specialMove = toCol > fromCol ? SpecialMoveType.CASTLE_KINGSIDE : SpecialMoveType.CASTLE_QUEENSIDE;

        // Move the rook
        const rookFromCol = toCol > fromCol ? 7 : 0;
        const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        const rook = newBoard[fromRow][rookFromCol].piece;

        if (rook) {
          newBoard[fromRow][rookToCol].piece = {
            ...rook,
            position: { row: fromRow, col: rookToCol },
            hasMoved: true,
          };
          newBoard[fromRow][rookFromCol].piece = null;
        }
      }

      // En passant
      if (
        piece.type === PieceType.PAWN &&
        Math.abs(toCol - fromCol) === 1 &&
        !capturedPiece &&
        gameState.lastMove
      ) {
        // Capture the pawn that moved two squares
        const enPassantRow = piece.color === Color.WHITE ? 3 : 4;
        if (fromRow === enPassantRow) {
          capturedPiece = newBoard[fromRow][toCol].piece;
          newBoard[fromRow][toCol].piece = null;
          specialMove = SpecialMoveType.EN_PASSANT;
        }
      }

      // Move the piece
      let movedPiece = {
        ...piece,
        position: targetPos,
        hasMoved: true,
      };

      // Pawn promotion to rook (automatic)
      if (piece.type === PieceType.PAWN && (toRow === 0 || toRow === 7)) {
        movedPiece = {
          ...movedPiece,
          type: PieceType.ROOK,
          id: `${piece.color}-rook-promoted-${Date.now()}`,
        };
        specialMove = SpecialMoveType.PROMOTION;
      }

      newBoard[toRow][toCol].piece = movedPiece;
      newBoard[fromRow][fromCol].piece = null;

      // Create move record
      const move: Move = {
        piece,
        from: piece.position,
        to: targetPos,
        capturedPiece: capturedPiece || undefined,
        specialMove,
        timestamp: Date.now(),
      };

      // Toggle turn
      const nextTurn =
        gameState.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;

      // Check for check, checkmate, or stalemate
      let newGameStatus = GameStatus.IN_PROGRESS;
      let winner: Color | null = null;

      if (isCheckmate(newBoard, nextTurn)) {
        newGameStatus = GameStatus.CHECKMATE;
        winner = gameState.currentTurn; // Current player wins
      } else if (isStalemate(newBoard, nextTurn)) {
        newGameStatus = GameStatus.STALEMATE;
        winner = null;
      } else if (isKingInCheck(newBoard, nextTurn)) {
        newGameStatus = GameStatus.CHECK;
      }

      // Update game state
      setGameState({
        board: newBoard,
        currentTurn: nextTurn,
        selectedPiece: null,
        moveHistory: [...gameState.moveHistory, move],
        gameStatus: newGameStatus,
        winner,
        lastMove: move,
      });
    },
    [gameState, deselectPiece]
  );

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  return {
    gameState,
    handleSquareClick,
    resetGame,
  };
}

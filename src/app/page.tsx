/**
 * Main chess game page
 */

"use client";

import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import { useGameState } from "../lib/game-state";

export default function Home() {
  const { gameState, handleSquareClick, resetGame } = useGameState();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center p-4 sm:p-8">
      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Chess Game</h1>

        <GameStatus
          currentTurn={gameState.currentTurn}
          gameStatus={gameState.gameStatus}
          winner={gameState.winner}
        />

        <ChessBoard board={gameState.board} onSquareClick={handleSquareClick} />

        <button
          onClick={resetGame}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
        >
          New Game
        </button>
      </div>
    </main>
  );
}

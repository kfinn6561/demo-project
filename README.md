# Chess Game Web Application

A fully-featured, web-based chess game for two players built with Next.js, React, and TypeScript.

## Features

### Core Gameplay
- **Complete Chess Rules**: All standard chess piece movements (pawn, rook, knight, bishop, queen, king)
- **Move Validation**: Only legal moves allowed, including check prevention
- **Check & Checkmate**: Automatic detection of check, checkmate, and stalemate conditions
- **Piece Captures**: Visual feedback for capturable pieces with red ring indicators

### Special Moves
- **Castling**: Both kingside and queenside castling with full rule validation
- **En Passant**: Pawn capture with proper opportunity tracking
- **Pawn Promotion**: Automatic promotion to rook when pawns reach the opposite end

### User Experience
- **Move Highlighting**: Green dots for empty legal moves, red rings for captures
- **Visual Feedback**: Smooth animations and hover effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Turn Indicator**: Clear display of whose turn it is and game status
- **New Game Button**: Reset the game at any time

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Play

1. **Start a Game**: The game begins automatically with White's turn
2. **Select a Piece**: Click on any of your pieces to see available moves
   - Green dots indicate empty squares you can move to
   - Red rings indicate opponent pieces you can capture
3. **Make a Move**: Click on a highlighted square to move your piece
4. **Cancel Selection**: Click on a non-highlighted square or the same piece to deselect
5. **Win the Game**: Checkmate your opponent's king to win!
6. **New Game**: Click the "New Game" button to start over

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main chess game page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles and animations
├── components/
│   ├── ChessBoard.tsx    # 8x8 board grid component
│   ├── ChessSquare.tsx   # Individual square component
│   ├── ChessPiece.tsx    # Piece rendering with Unicode symbols
│   ├── GameStatus.tsx    # Turn indicator and game status
│   └── ErrorBoundary.tsx # Error handling component
└── lib/
    ├── types.ts          # TypeScript interfaces and enums
    ├── chess-rules.ts    # Chess rule validation logic
    ├── move-generator.ts # Legal move generation
    └── game-state.ts     # React state management hooks
```

## Technologies Used

- **Next.js 14+**: React framework with App Router
- **React 18+**: UI component library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Unicode Chess Pieces**: No external assets required

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Key Implementation Details

- **State Management**: React hooks (useState, useCallback) with custom `useGameState` hook
- **Move Validation**: Two-phase validation (piece rules → check validation)
- **Performance**: React.memo optimization for board squares and pieces
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive**: Mobile-first design with Tailwind breakpoints

## Game Rules Implemented

### Standard Moves
- **Pawn**: Forward 1-2 squares (first move), diagonal capture only
- **Rook**: Horizontal and vertical lines
- **Knight**: L-shaped moves (2+1 squares)
- **Bishop**: Diagonal lines
- **Queen**: Combination of rook and bishop
- **King**: One square in any direction

### Special Rules
- **Check**: King under attack must move to safety
- **Checkmate**: No legal moves available while in check (game over)
- **Stalemate**: No legal moves available but not in check (draw)
- **Castling**: King and rook special move (requirements fully validated)
- **En Passant**: Special pawn capture immediately after opponent's double-square move
- **Pawn Promotion**: Automatic promotion to rook at opposite end

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is part of a demonstration and learning exercise.

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## Acknowledgments

Built with Claude Code as part of the Specify template implementation workflow.

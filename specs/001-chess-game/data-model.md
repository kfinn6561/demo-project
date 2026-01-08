# Data Model: Chess Game Web Application

**Feature**: Chess Game Web Application
**Date**: 2026-01-08
**Purpose**: Define core data structures and their relationships

## Core Entities

### 1. PieceType

Enumeration of chess piece types.

```typescript
enum PieceType {
  KING = 'king',
  QUEEN = 'queen',
  ROOK = 'rook',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  PAWN = 'pawn'
}
```

**Attributes**: N/A (enum)
**Validation**: One of six valid types
**Rationale**: Type-safe piece identification

### 2. Color

Enumeration of player colors.

```typescript
enum Color {
  WHITE = 'white',
  BLACK = 'black'
}
```

**Attributes**: N/A (enum)
**Validation**: One of two valid colors
**Rationale**: Represents player sides per spec FR-003

### 3. Position

Represents a location on the chess board.

```typescript
interface Position {
  row: number;    // 0-7 (rank 1-8, inverted for rendering)
  col: number;    // 0-7 (file a-h)
}
```

**Attributes**:
- `row`: Integer 0-7, where row 0 = rank 8 (top, black's back rank), row 7 = rank 1 (bottom, white's back rank)
- `col`: Integer 0-7, where col 0 = file 'a', col 7 = file 'h'

**Validation**:
- `0 <= row <= 7`
- `0 <= col <= 7`

**Relationships**: Used by Piece (current position) and Move (from/to positions)

**Rationale**: Array-based indexing for efficient board access

### 4. Piece

Represents a chess piece on the board.

```typescript
interface Piece {
  id: string;              // Unique identifier (e.g., "white-king", "black-pawn-1")
  type: PieceType;         // King, Queen, Rook, etc.
  color: Color;            // White or Black
  position: Position;      // Current location on board
  hasMoved: boolean;       // Tracking for castling and pawn first-move rules
}
```

**Attributes**:
- `id`: Unique string identifier for React keys and piece tracking
- `type`: Type of piece (affects movement rules)
- `color`: Player who owns this piece
- `position`: Current board position
- `hasMoved`: Boolean flag, initially false, set to true after first move

**Validation**:
- `id` must be unique across all pieces
- `position` must be valid (within board bounds)
- Kings: exactly 1 per color
- Pawns: max 8 per color, row 0 or 7 (back ranks) only if promoted

**State Transitions**:
1. **Initial** → `hasMoved: false`
2. **After first move** → `hasMoved: true` (permanent)
3. **Captured** → removed from game state

**Relationships**:
- Owned by Player (via color)
- Occupies one Square (via position)
- Subject of Move operations

**Rationale**: `hasMoved` tracks castling eligibility (kings/rooks) and pawn double-move availability per FR-010, FR-011

### 5. Square

Represents a single square on the chess board.

```typescript
interface Square {
  position: Position;       // Location on board
  piece: Piece | null;      // Piece occupying this square (null if empty)
  isHighlighted: boolean;   // UI state for move highlighting (P2 feature)
}
```

**Attributes**:
- `position`: Board coordinates
- `piece`: Reference to piece on this square, or null if unoccupied
- `isHighlighted`: UI state for displaying valid move indicators (FR-015, User Story 2)

**Validation**:
- `position` must be unique (no two squares at same position)
- At most one piece per square

**State Transitions**:
- **Empty** → `piece: null, isHighlighted: false`
- **Occupied** → `piece: <Piece>, isHighlighted: false`
- **Selected destination** → `isHighlighted: true` (when piece selected)
- **After move** → piece reference updated or set to null

**Relationships**:
- Part of Board (8x8 grid)
- May contain one Piece

**Rationale**: Encapsulates square state for rendering and interaction

### 6. Move

Represents a single chess move.

```typescript
interface Move {
  piece: Piece;                  // Piece being moved
  from: Position;                // Starting position
  to: Position;                  // Destination position
  capturedPiece?: Piece;         // Piece captured (if any)
  specialMove?: SpecialMoveType; // Castle, en passant, promotion
  timestamp: number;             // When move was made (for move history future)
}

enum SpecialMoveType {
  CASTLE_KINGSIDE = 'castle-kingside',
  CASTLE_QUEENSIDE = 'castle-queenside',
  EN_PASSANT = 'en-passant',
  PROMOTION = 'promotion'      // Auto-rook per spec clarification
}
```

**Attributes**:
- `piece`: Which piece moved
- `from`: Starting position
- `to`: Ending position
- `capturedPiece`: Optional captured piece (for undo future, not MVP)
- `specialMove`: Optional flag for special move types
- `timestamp`: Unix timestamp (milliseconds) when move executed

**Validation**:
- `from` ≠ `to`
- `from` must be piece's current position before move
- `to` must be valid according to chess rules for piece type
- Move must not leave own king in check (FR-005)

**Relationships**:
- References source Piece
- May reference captured Piece
- Appended to GameState.moveHistory

**Rationale**: Complete move record for game replay (deferred) and undo (deferred)

### 7. GameState

Root state object representing entire game.

```typescript
interface GameState {
  board: Board;                    // 8x8 grid of squares
  currentTurn: Color;              // Whose turn it is
  selectedPiece: Piece | null;     // Currently selected piece (UI state)
  moveHistory: Move[];             // All moves made (for future features)
  gameStatus: GameStatus;          // In progress, check, checkmate, stalemate, draw
  winner: Color | null;            // Winner if game ended (null if draw or in progress)
}

type Board = Square[][];           // 8x8 array

enum GameStatus {
  IN_PROGRESS = 'in-progress',
  CHECK = 'check',
  CHECKMATE = 'checkmate',
  STALEMATE = 'stalemate',
  DRAW = 'draw'                    // Reserved for future (threefold repetition, fifty-move)
}
```

**Attributes**:
- `board`: 2D array representing all 64 squares
- `currentTurn`: Which player moves next (FR-003)
- `selectedPiece`: Piece clicked by user (null if none selected)
- `moveHistory`: Array of all moves (length 0 at game start)
- `gameStatus`: Current game state (FR-006, FR-007, FR-008)
- `winner`: Color of winning player (null if draw or game ongoing)

**Validation**:
- `board` dimensions must be 8x8
- `currentTurn` must alternate after each valid move
- `gameStatus = CHECKMATE` → `winner` must be non-null
- `gameStatus = STALEMATE/DRAW` → `winner` must be null
- `selectedPiece` must be of color `currentTurn` (can't select opponent's pieces)

**State Transitions**:
1. **Initial state** → Board set up, currentTurn = WHITE, gameStatus = IN_PROGRESS
2. **Piece selected** → selectedPiece set, target squares highlighted
3. **Move executed** → Board updated, currentTurn flipped, selectedPiece cleared, move added to history
4. **Check detected** → gameStatus = CHECK
5. **Checkmate** → gameStatus = CHECKMATE, winner set
6. **Stalemate** → gameStatus = STALEMATE, winner = null
7. **New game** → Reset to initial state

**Relationships**:
- Contains Board (composition)
- References current Player via currentTurn
- Contains Move history (composition)

**Initialization**:
```typescript
function createInitialGameState(): GameState {
  return {
    board: initializeBoard(),  // Set up pieces in starting positions
    currentTurn: Color.WHITE,
    selectedPiece: null,
    moveHistory: [],
    gameStatus: GameStatus.IN_PROGRESS,
    winner: null
  };
}
```

**Rationale**: Single source of truth for entire game state, managed by React Context

### 8. Player

Logical entity representing one side of the game (not a data structure, derived from GameState).

**Derived Attributes**:
- `color`: WHITE or BLACK
- `pieces`: Filter `board.flat().map(sq => sq.piece).filter(p => p?.color === color)`
- `isInCheck`: Computed from board state and king position
- `legalMoves`: Computed from all pieces and current board state

**Rationale**: Not stored explicitly per YAGNI - derived when needed from board state

## Entity Relationships

```text
GameState
├── board: Board (8x8 array of Squares)
│   └── Square[][]
│       └── Square { position, piece?, isHighlighted }
│           └── piece?: Piece { type, color, position, hasMoved }
├── currentTurn: Color (WHITE | BLACK)
├── selectedPiece?: Piece
├── moveHistory: Move[]
│   └── Move { piece, from, to, capturedPiece?, specialMove? }
├── gameStatus: GameStatus
└── winner?: Color
```

## Data Flow

### Move Execution Flow

1. User clicks piece → `selectedPiece` updated, `isHighlighted` set on valid destination squares
2. User clicks destination → Validate move:
   - Check piece movement rules (type-specific)
   - Verify destination not occupied by own piece
   - Simulate move and check if own king in check
3. If valid:
   - Update `board` (move piece, capture if applicable, clear square)
   - Create `Move` object, append to `moveHistory`
   - Toggle `currentTurn`
   - Check for check/checkmate/stalemate → update `gameStatus`
   - Clear `selectedPiece` and highlights
4. If invalid:
   - Keep `selectedPiece`, show error (or do nothing per spec FR-004)

### Check Detection Flow

1. After each move, scan board for opponent's king position
2. For each current player's piece, check if it can reach king's position
3. If any piece can → `gameStatus = CHECK`

### Checkmate Detection Flow

1. If `gameStatus = CHECK`:
2. Generate all legal moves for player in check
3. For each legal move, simulate and check if king still in check
4. If no legal moves escape check → `gameStatus = CHECKMATE`, `winner = opponent`

### Stalemate Detection Flow

1. If `gameStatus ≠ CHECK`:
2. Generate all legal moves for current player
3. If no legal moves available → `gameStatus = STALEMATE`, `winner = null`

## Storage & Persistence

**MVP**: No persistence required per spec Assumption 5
- GameState lives in React Context
- Lost on page refresh (acceptable per spec)

**Future**: Could serialize GameState to localStorage or database
```typescript
// Future enhancement (not MVP)
function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

function deserializeGameState(json: string): GameState {
  return JSON.parse(json);
}
```

## Performance Considerations

**Memory**:
- GameState size: ~2-3 KB (64 squares + ~32 pieces + move history)
- Negligible for modern browsers (target budget: <100 KB total)

**Computation**:
- Legal move generation: O(n) where n = number of pieces (~30 avg)
- Check detection: O(n²) worst case (each piece vs. each enemy piece)
- Performance target: <10ms for move validation (well under 100ms feedback budget)

**Optimization Strategy** (if needed):
- Incremental check detection (only check pieces that could have created check)
- Memoize legal moves for current board position
- Move generation cache invalidated on board state change

## Type Safety

All entities defined as TypeScript interfaces/enums for compile-time validation:
- Prevents invalid piece types
- Ensures position bounds checking
- Type-safe move validation
- IDE autocomplete and refactoring support

## Summary

Data model supports all FR-001 through FR-015 requirements with clean separation of concerns:
- **Entities**: Piece, Square, Board (domain objects)
- **State**: GameState (root state container)
- **Operations**: Move (action record)
- **Computed**: Player, legal moves (derived from board state)

No external data sources or API contracts needed (fully client-side).

# Research: Chess Game Web Application

**Feature**: Chess Game Web Application
**Date**: 2026-01-08
**Purpose**: Document technology choices, rationale, and alternatives considered

## Research Areas

### 1. Frontend Framework Selection

**Decision**: Next.js 14+ with TypeScript

**Rationale**:
- **Next.js**: Provides React framework with zero-config setup, built-in TypeScript support, optimized bundling, and fast refresh for development
- **TypeScript**: Type safety critical for chess logic complexity (piece types, move validation, game state)
- **React**: Component model maps naturally to chess UI (board → squares → pieces)
- **App Router**: Modern Next.js architecture with better performance and simpler data fetching patterns

**Alternatives Considered**:
- **Vanilla JavaScript + HTML/CSS**: Rejected - Too much boilerplate for state management and DOM updates
- **Vue.js**: Rejected - React ecosystem more mature for testing libraries and tooling
- **SvelteKit**: Rejected - Smaller community, fewer learning resources, less tooling support
- **Plain React (Create React App)**: Rejected - CRA deprecated, Next.js provides better DX and optimization

### 2. State Management Approach

**Decision**: React Context API + useState hooks

**Rationale**:
- Single-device local game = simple state (no distributed state, no server sync)
- Game state fits in memory (~1KB for 64 squares + piece positions + game metadata)
- Context provides clean prop-drilling solution for deeply nested components
- No need for Redux/Zustand complexity for this use case per YAGNI principle

**Alternatives Considered**:
- **Redux Toolkit**: Rejected - Over-engineered for local state with no async actions or middleware needs
- **Zustand**: Rejected - Additional dependency when React hooks sufficient
- **Jotai/Recoil**: Rejected - Atomic state unnecessary for cohesive game state object
- **useReducer**: Considered - Good fit for complex state transitions, may refactor if useState becomes unwieldy

### 3. Chess Rules Engine

**Decision**: Custom TypeScript implementation

**Rationale**:
- Educational value in understanding chess rules deeply
- Full control over rule implementation and edge cases
- No external chess library dependencies = smaller bundle size
- Spec requirements (auto-rook promotion, stalemate-only draws) are non-standard, easier to customize
- Estimated ~300-400 LOC for complete rules implementation

**Alternatives Considered**:
- **chess.js**: Rejected - 20KB library, includes features we don't need (PGN, FEN, full draw rules), harder to customize for auto-rook promotion
- **chessboard.jsx**: Rejected - UI-only library, doesn't handle game logic
- **Stockfish.js**: Rejected - Chess engine for AI opponents, massive overkill (several MB)
- **Hybrid (chess.js for validation, custom UI)**: Rejected - Adds dependency when custom solution is straightforward

### 4. Piece Rendering

**Decision**: Unicode chess symbols (♔♕♖♗♘♙ / ♚♛♜♝♞♟)

**Rationale**:
- Per spec clarification: Unicode chosen for simplicity
- No image assets to load = faster initial render
- Accessible (screen readers can interpret text)
- Scales with CSS font-size (responsive design trivial)
- Cross-browser compatible (supported in all modern browsers)

**Implementation**:
```typescript
const PIECE_SYMBOLS = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
}
```

**Alternatives Considered**:
- **SVG Graphics**: Rejected per clarification - More design work, additional files
- **Image Sprites**: Rejected per clarification - Requires asset management, loading time
- **Icon Font (Font Awesome)**: Rejected per clarification - External dependency

### 5. Styling Approach

**Decision**: CSS Modules + Tailwind CSS

**Rationale**:
- CSS Modules: Component-scoped styles prevent class name collisions
- Tailwind: Utility-first rapid UI development, built-in Next.js support
- Minimal custom CSS needed (board grid, square colors, piece centering)
- No CSS-in-JS libraries needed (Tailwind + modules sufficient)

**Alternatives Considered**:
- **Styled-components**: Rejected - Runtime cost, adds dependency, overkill for simple layout
- **Plain CSS**: Rejected - No scoping, class name collisions likely
- **SASS/SCSS**: Rejected - Additional build step, Tailwind provides variables/mixins

### 6. Testing Strategy

**Decision**: Jest + React Testing Library (unit/integration)

**Rationale**:
- Jest: Industry standard, excellent TypeScript support, built-in mocking
- React Testing Library: User-centric testing (queries by role/text, not implementation details)
- Focus on two test categories:
  1. **Unit tests**: Chess rules (move validation, check detection, checkmate/stalemate)
  2. **Integration tests**: UI interactions (click piece → see highlights → click square → piece moves)

**Test Priorities** (per constitution IV):
- P1: Move validation for all piece types (king, queen, rook, bishop, knight, pawn)
- P1: Check detection and prevention of moves exposing king
- P1: Checkmate and stalemate detection
- P2: Special moves (castling, en passant, auto-rook promotion)
- P2: UI interaction flows (selection, cancellation, turn alternation)

**Alternatives Considered**:
- **Playwright/Cypress E2E**: Deferred to P3 - Unit/integration sufficient for MVP per YAGNI
- **Vitest**: Rejected - Jest more mature for React, better ecosystem
- **Testing Library + Vitest**: Rejected - Mixing tools adds complexity

### 7. Board Representation

**Decision**: 2D array of squares (8x8)

**Rationale**:
- Intuitive mapping to visual board layout
- Simple indexing: `board[row][col]`
- Easy iteration for rendering and move validation
- Algebraic notation conversion straightforward (a-h = col 0-7, 1-8 = row 7-0)

```typescript
type Square = {
  piece: Piece | null;
  position: { row: number; col: number };
  isHighlighted: boolean;
}

type Board = Square[][];  // 8x8 grid
```

**Alternatives Considered**:
- **1D array (length 64)**: Rejected - Harder to reason about adjacency and diagonals
- **Object with algebraic keys**: Rejected - `board['e4']` less efficient than array indexing
- **Bitboards**: Rejected - Micro-optimization, premature for MVP, harder to debug

### 8. Move Validation Architecture

**Decision**: Two-phase validation (piece rules → check validation)

**Rationale**:
1. **Phase 1** - Generate pseudo-legal moves based on piece type and board state
2. **Phase 2** - Filter out moves that leave own king in check

**Benefits**:
- Separation of concerns (piece logic vs. king safety)
- Easier to test each phase independently
- Performance adequate for 8x8 board (max ~30 pieces, avg 30-40 legal moves/position)

**Implementation Pattern**:
```typescript
function getLegalMoves(piece: Piece, board: Board): Position[] {
  const pseudoLegal = generatePseudoLegalMoves(piece, board);
  return pseudoLegal.filter(move => !leavesKingInCheck(board, piece, move));
}
```

### 9. Performance Optimizations

**Decision**: Minimal optimization, measure if needed

**Rationale** (per YAGNI):
- 8x8 board = small data structure, re-rendering full board on each move is fine
- Modern React (18+) with concurrent features handles this efficiently
- Target: 100ms feedback time easily achievable without optimization
- Defer memoization (React.memo, useMemo) until profiling shows bottlenecks

**Potential Future Optimizations** (if needed):
- Memoize legal move calculations (cache by position hash)
- React.memo on ChessSquare components (prevent re-render of unchanged squares)
- Virtual DOM diffing already optimizes most cases

### 10. Deployment Target

**Decision**: Static export (Next.js static generation)

**Rationale**:
- No backend/API = fully static site
- Can deploy to GitHub Pages, Vercel, Netlify, or any static host
- `next export` generates static HTML/CSS/JS
- Simplifies deployment and reduces hosting costs to zero

**Alternatives Considered**:
- **Vercel (SSR)**: Rejected - No server-side features needed
- **Docker container**: Rejected - Overkill for static site
- **Electron desktop app**: Out of scope per spec (web only)

## Summary

All technology decisions prioritize simplicity, type safety, and alignment with spec requirements. No NEEDS CLARIFICATION items remain. Ready for Phase 1 (Data Model & Contracts).

# Tasks: Chess Game Web Application

**Input**: Design documents from `/specs/001-chess-game/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. This task list focuses on implementation only. Add test tasks separately if TDD approach is desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js app**: `src/app/`, `src/components/`, `src/lib/` at repository root
- Paths shown below follow Next.js 14 App Router convention

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js project with TypeScript in repository root using create-next-app
- [X] T002 [P] Configure TypeScript compiler options in tsconfig.json (strict mode, path aliases)
- [X] T003 [P] Set up ESLint and Prettier configurations in .eslintrc.json and .prettierrc
- [X] T004 [P] Install core dependencies: react@18, react-dom@18, next@14, typescript
- [X] T005 [P] Create directory structure: src/app/, src/components/, src/lib/, src/__tests__/
- [X] T006 [P] Configure Tailwind CSS in tailwind.config.js and src/app/globals.css
- [X] T007 [P] Create Next.js configuration in next.config.js (static export settings)
- [X] T008 [P] Set up package.json scripts (dev, build, start, test, lint, format)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 [P] Define PieceType enum in src/lib/types.ts (KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN)
- [X] T010 [P] Define Color enum in src/lib/types.ts (WHITE, BLACK)
- [X] T011 [P] Define Position interface in src/lib/types.ts (row: number, col: number)
- [X] T012 [P] Define Piece interface in src/lib/types.ts (id, type, color, position, hasMoved)
- [X] T013 [P] Define Square interface in src/lib/types.ts (position, piece, isHighlighted)
- [X] T014 [P] Define Move interface in src/lib/types.ts (piece, from, to, capturedPiece, specialMove)
- [X] T015 [P] Define GameState interface in src/lib/types.ts (board, currentTurn, selectedPiece, moveHistory, gameStatus, winner)
- [X] T016 [P] Define GameStatus enum in src/lib/types.ts (IN_PROGRESS, CHECK, CHECKMATE, STALEMATE)
- [X] T017 [P] Define SpecialMoveType enum in src/lib/types.ts (CASTLE_KINGSIDE, CASTLE_QUEENSIDE, EN_PASSANT, PROMOTION)
- [X] T018 Create board initialization function in src/lib/game-state.ts (8x8 grid with starting positions)
- [X] T019 Create piece movement validation utilities in src/lib/chess-rules.ts (isValidPosition helper)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Play Basic Chess Game (Priority: P1) 🎯 MVP

**Goal**: Enable complete chess game playback with valid moves, captures, and win condition detection

**Independent Test**: Open application, make valid chess moves for both white and black players, verify pieces move according to chess rules, game can reach checkmate

### Implementation for User Story 1

- [X] T020 [P] [US1] Implement pawn movement validation in src/lib/chess-rules.ts (forward 1/2 squares, diagonal capture)
- [X] T021 [P] [US1] Implement rook movement validation in src/lib/chess-rules.ts (horizontal/vertical lines)
- [X] T022 [P] [US1] Implement knight movement validation in src/lib/chess-rules.ts (L-shaped moves)
- [X] T023 [P] [US1] Implement bishop movement validation in src/lib/chess-rules.ts (diagonal lines)
- [X] T024 [P] [US1] Implement queen movement validation in src/lib/chess-rules.ts (rook + bishop combined)
- [X] T025 [P] [US1] Implement king movement validation in src/lib/chess-rules.ts (one square any direction)
- [X] T026 [US1] Implement isPathClear function in src/lib/chess-rules.ts (check obstacles between positions)
- [X] T027 [US1] Implement getLegalMoves function in src/lib/move-generator.ts (generate pseudo-legal moves for piece)
- [X] T028 [US1] Implement check detection function in src/lib/chess-rules.ts (isKingInCheck)
- [X] T029 [US1] Implement move validation with check prevention in src/lib/move-generator.ts (filter moves that expose king)
- [X] T030 [US1] Implement checkmate detection function in src/lib/chess-rules.ts (no legal moves available while in check)
- [X] T031 [US1] Implement stalemate detection function in src/lib/chess-rules.ts (no legal moves available, not in check)
- [X] T032 [P] [US1] Create ChessPiece component in src/components/ChessPiece.tsx (render Unicode symbols)
- [X] T033 [P] [US1] Create ChessSquare component in src/components/ChessSquare.tsx (render single square with click handler)
- [X] T034 [US1] Create ChessBoard component in src/components/ChessBoard.tsx (8x8 grid of squares)
- [X] T035 [US1] Create GameStatus component in src/components/GameStatus.tsx (turn indicator and game end message)
- [X] T036 [US1] Implement game state management with React Context in src/lib/game-state.ts (useGameState hook)
- [X] T037 [US1] Implement piece selection logic in src/lib/game-state.ts (handle square click, update selectedPiece)
- [X] T038 [US1] Implement move execution logic in src/lib/game-state.ts (validate and apply move, toggle turn)
- [X] T039 [US1] Integrate game state updates with checkmate/stalemate detection in src/lib/game-state.ts
- [X] T040 [US1] Create main chess game page in src/app/page.tsx (integrate ChessBoard and GameStatus)
- [X] T041 [US1] Add global styles for board layout in src/app/globals.css (grid, colors, spacing)

**Checkpoint**: At this point, User Story 1 (MVP) should be fully functional and testable independently

---

## Phase 4: User Story 3 - Capture Pieces (Priority: P1) 🎯 MVP

**Goal**: Enable piece captures by moving to opponent-occupied squares

**Independent Test**: Move piece to square with opponent piece, verify captured piece removed and capturing piece occupies square

### Implementation for User Story 3

- [X] T042 [US3] Update move validation to allow captures in src/lib/chess-rules.ts (mark opponent-occupied squares as valid)
- [X] T043 [US3] Implement capture logic in move execution in src/lib/game-state.ts (remove captured piece from board)
- [X] T044 [US3] Update ChessSquare component to visually distinguish capturable squares in src/components/ChessSquare.tsx
- [X] T045 [US3] Update pawn capture validation in src/lib/chess-rules.ts (diagonal capture only, not forward)

**Checkpoint**: At this point, User Stories 1 AND 3 (full MVP) should both work independently

---

## Phase 5: User Story 2 - See Available Moves (Priority: P2)

**Goal**: Highlight legal destination squares when piece is selected

**Independent Test**: Click piece, verify all legal moves highlighted; click highlighted square to move; click elsewhere to cancel selection

### Implementation for User Story 2

- [ ] T046 [US2] Add highlighting state to Square interface (isHighlighted boolean already defined in types)
- [ ] T047 [US2] Implement highlight calculation when piece selected in src/lib/game-state.ts (set isHighlighted for legal moves)
- [ ] T048 [US2] Update ChessSquare component to render highlight indicator in src/components/ChessSquare.tsx (CSS class or overlay)
- [ ] T049 [US2] Add highlight styles to globals.css (background color, border, or dot indicator)
- [ ] T050 [US2] Implement selection cancellation on empty square click in src/lib/game-state.ts (clear selectedPiece and highlights)
- [ ] T051 [US2] Add hover effect for highlighted squares in src/components/ChessSquare.tsx

**Checkpoint**: Move highlighting should work independently while maintaining full gameplay from US1+US3

---

## Phase 6: User Story 4 - Special Moves (Priority: P2)

**Goal**: Implement castling, en passant, and automatic pawn promotion to rook

**Independent Test**: Set up specific board positions, verify each special move works according to chess rules

### Implementation for User Story 4

- [ ] T052 [P] [US4] Implement castling validation in src/lib/chess-rules.ts (king and rook unmoved, path clear, not in check)
- [ ] T053 [P] [US4] Implement castling execution in src/lib/game-state.ts (move both king and rook simultaneously)
- [ ] T054 [P] [US4] Implement en passant validation in src/lib/chess-rules.ts (pawn beside opponent pawn that just moved two squares)
- [ ] T055 [P] [US4] Implement en passant execution in src/lib/game-state.ts (capture pawn behind destination square)
- [ ] T056 [P] [US4] Track en passant opportunity in GameState (lastMove or enPassantSquare field)
- [ ] T057 [US4] Implement automatic pawn promotion to rook in src/lib/game-state.ts (when pawn reaches row 0 or 7)
- [ ] T058 [US4] Update hasMoved tracking for kings and rooks in src/lib/game-state.ts (set true after first move)

**Checkpoint**: All special moves should work while maintaining all previous functionality

---

## Phase 7: User Story 5 - Reset and Start New Game (Priority: P2)

**Goal**: Provide button to reset game to initial state without page refresh

**Independent Test**: Play part of game, click "New Game" button, verify board resets to starting position

### Implementation for User Story 5

- [ ] T059 [P] [US5] Create NewGameButton component in src/components/NewGameButton.tsx (button with click handler)
- [ ] T060 [US5] Implement reset game function in src/lib/game-state.ts (restore initial GameState)
- [ ] T061 [US5] Integrate NewGameButton into main page in src/app/page.tsx (place above or below board)
- [ ] T062 [US5] Style NewGameButton in src/components/NewGameButton.tsx (Tailwind classes or CSS module)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T063 [P] Add responsive design for mobile devices in src/app/globals.css (board scaling, touch-friendly)
- [ ] T064 [P] Implement keyboard accessibility in src/components/ChessSquare.tsx (tab navigation, enter to select)
- [ ] T065 [P] Add loading state for initial render in src/app/page.tsx
- [ ] T066 [P] Optimize re-rendering with React.memo on ChessSquare and ChessPiece components
- [ ] T067 [P] Add error boundary component in src/app/layout.tsx (catch and display runtime errors)
- [ ] T068 [P] Create README.md in repository root (setup instructions, how to play)
- [ ] T069 [P] Add favicon and metadata in src/app/layout.tsx (chess piece icon, page title)
- [ ] T070 Validate all acceptance scenarios from spec.md (manual testing checklist)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - No dependencies on other stories
- **User Story 3 (Phase 4)**: Depends on User Story 1 (extends move validation) - Can integrate immediately after US1
- **User Story 2 (Phase 5)**: Depends on User Story 1 (extends UI interaction) - Independent of US3
- **User Story 4 (Phase 6)**: Depends on User Story 1 (extends move rules) - Independent of US2/US3
- **User Story 5 (Phase 7)**: Depends on User Story 1 (resets game state) - Independent of US2/US3/US4
- **Polish (Phase 8)**: Depends on desired user stories being complete

### User Story Dependencies

```
Foundational (Phase 2) ← BLOCKS ALL
        ↓
User Story 1 (P1) ← MVP CORE
        ↓
        ├→ User Story 3 (P1) ← MVP COMPLETE (extends US1)
        ├→ User Story 2 (P2) ← Can run parallel to US3
        ├→ User Story 4 (P2) ← Can run parallel to US2/US3
        └→ User Story 5 (P2) ← Can run parallel to US2/US3/US4
```

### Critical Path (MVP)

1. Phase 1: Setup (T001-T008)
2. Phase 2: Foundational (T009-T019)
3. Phase 3: User Story 1 - Basic Gameplay (T020-T041)
4. Phase 4: User Story 3 - Captures (T042-T045)
5. STOP → MVP ready for testing and deployment

### Within Each User Story

**User Story 1 (Basic Gameplay)**:
- Parallel: Chess rules for each piece type (T020-T025) can be implemented simultaneously
- Sequential: Legal move generation (T027) requires piece rules (T020-T026)
- Sequential: Check detection (T028) requires legal move generation (T027)
- Sequential: Checkmate/stalemate (T030-T031) requires check detection (T028)
- Parallel: UI components (T032-T035) can be built while game logic is being developed
- Sequential: Game state integration (T036-T041) requires both logic and UI complete

**User Story 3 (Captures)**:
- All tasks sequential (small increment, 4 tasks total)

**User Story 2 (Move Highlighting)**:
- Parallel: T046-T048 (logic + UI) can run concurrently
- Sequential: T049-T051 (styling and refinements) depend on core implementation

**User Story 4 (Special Moves)**:
- Parallel: T052-T055 (castling and en passant logic) can run concurrently
- Sequential: T056-T058 (state tracking and promotion) integrate the logic

**User Story 5 (Reset)**:
- All tasks sequential (simple increment, 4 tasks total)

### Parallel Opportunities

```bash
# Phase 1: Setup - Launch all together
Tasks T001-T008 can all run in parallel (independent configuration files)

# Phase 2: Foundational - Launch type definitions together
Tasks T009-T017 can all run in parallel (independent type definitions in same file)
Tasks T018-T019 sequential (require types first)

# Phase 3: User Story 1 - Launch piece rules together
Tasks T020-T025 in parallel (independent piece validation functions)
Tasks T032-T035 in parallel (independent UI components)

# Phase 4: User Story 3 - Sequential (extends US1)
Tasks T042-T045 sequential (small, tightly coupled)

# Phase 5: User Story 2 - Parallel logic and UI
Tasks T046-T048 in parallel (logic and UI independent initially)

# Phase 6: User Story 4 - Parallel special moves
Tasks T052-T053 in parallel (castling)
Tasks T054-T056 in parallel (en passant)

# Phase 8: Polish - Launch all together
Tasks T063-T069 in parallel (independent improvements)
```

---

## Parallel Example: User Story 1 (Basic Gameplay)

```bash
# Launch all piece movement rules together:
Task T020: "Implement pawn movement validation"
Task T021: "Implement rook movement validation"
Task T022: "Implement knight movement validation"
Task T023: "Implement bishop movement validation"
Task T024: "Implement queen movement validation"
Task T025: "Implement king movement validation"

# While those are being developed, launch UI components in parallel:
Task T032: "Create ChessPiece component"
Task T033: "Create ChessSquare component"
Task T034: "Create ChessBoard component"
Task T035: "Create GameStatus component"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 3 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T019) → **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 - Basic Gameplay (T020-T041)
4. Complete Phase 4: User Story 3 - Captures (T042-T045)
5. **STOP and VALIDATE**: Test MVP independently (full chess game with captures)
6. Deploy/demo MVP

**MVP Scope**: 45 tasks total (T001-T045)
**Estimated Complexity**: ~800 LOC (500 game logic + 300 UI/components)

### Incremental Delivery

1. Complete Setup + Foundational (T001-T019) → Foundation ready
2. Add User Story 1 (T020-T041) → Test independently → **MVP playable but no captures**
3. Add User Story 3 (T042-T045) → Test independently → **MVP complete with captures** → Deploy/Demo
4. Add User Story 2 (T046-T051) → Test independently → Better UX → Deploy/Demo
5. Add User Story 4 (T052-T058) → Test independently → Full chess rules → Deploy/Demo
6. Add User Story 5 (T059-T062) → Test independently → QoL feature → Deploy/Demo
7. Add Polish (T063-T070) → Final refinements → Production release

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T019)
2. Once Foundational is done:
   - **Developer A**: User Story 1 - Basic Gameplay (T020-T041) → **Critical path**
   - **Developer B**: Can start on User Story 2 UI prep (create component stubs for highlighting)
   - **Developer C**: Can start on User Story 4 special moves research/algorithm design
3. After User Story 1 complete:
   - **Developer A**: User Story 3 - Captures (T042-T045) → **Complete MVP**
   - **Developer B**: User Story 2 - Move Highlighting (T046-T051)
   - **Developer C**: User Story 4 - Special Moves (T052-T058)
4. Stories complete and integrate independently

---

## Notes

- **[P] tasks**: Different files, no dependencies, safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability (US1, US2, US3, US4, US5)
- Each user story should be independently completable and testable
- Commit after each task or logical group (e.g., all piece movement rules together)
- Stop at any checkpoint to validate story independently
- **Test tasks NOT included**: Spec does not explicitly request TDD. Add test tasks separately if desired.
- Avoid: Vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 70
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 11 tasks (BLOCKING)
- Phase 3 (US1 - Basic Gameplay): 22 tasks
- Phase 4 (US3 - Captures): 4 tasks
- Phase 5 (US2 - Move Highlighting): 6 tasks
- Phase 6 (US4 - Special Moves): 7 tasks
- Phase 7 (US5 - Reset Game): 4 tasks
- Phase 8 (Polish): 8 tasks

**MVP Scope**: Phases 1-4 (45 tasks)
**Full Feature**: All 70 tasks

**Parallelization**: 35 tasks marked [P] (50% can run in parallel with proper team coordination)

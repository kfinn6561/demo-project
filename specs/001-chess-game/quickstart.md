# Quickstart: Chess Game Web Application

**Feature**: Chess Game Web Application
**Date**: 2026-01-08
**Purpose**: How to set up, run, test, and deploy the chess game

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn** or **pnpm**: Package manager (npm comes with Node.js)
- **Git**: For version control
- **Modern web browser**: Chrome, Firefox, Safari, or Edge (last 2 versions)
- **Text editor/IDE**: VS Code recommended (with TypeScript and ESLint extensions)

## Initial Setup

### 1. Install Dependencies

```bash
# From repository root
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

**Key dependencies installed**:
- `next@14+` - React framework
- `react@18+` & `react-dom@18+` - UI library
- `typescript` - Type safety
- `@types/react` & `@types/node` - TypeScript definitions

**Dev dependencies**:
- `jest` & `@testing-library/react` - Testing
- `eslint` & `prettier` - Code quality
- `tailwindcss` - Styling (if using Tailwind)

### 2. Environment Configuration

No environment variables needed for MVP (fully client-side application).

Optional `.env.local` for future features:
```bash
# Future: Analytics, error tracking, etc.
# NEXT_PUBLIC_ANALYTICS_ID=...
```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

**Expected output**:
```
 ✓ Ready in 1.2s
 ○ Local:        http://localhost:3000
 ○ Network:      http://192.168.1.x:3000
```

**Access the game**:
1. Open browser to `http://localhost:3000`
2. You should see an 8x8 chess board with pieces in starting positions
3. Click a white piece to select it
4. Click a highlighted square to move the piece

**Development features**:
- Fast Refresh: Changes auto-reload without full page refresh
- TypeScript: Type errors shown in terminal and browser console
- Hot Module Replacement: Component state preserved during updates

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test chess-rules.test.ts
```

**Test Categories**:
1. **Unit tests** (`src/__tests__/*.test.ts`):
   - Chess rules validation
   - Move generation logic
   - Check/checkmate detection

2. **Integration tests** (`src/__tests__/*.test.tsx`):
   - Component interactions
   - Game flow (select piece → move → turn change)
   - Win condition triggers

**Coverage targets** (per constitution IV):
- Game logic (`lib/chess-rules.ts`, `lib/move-generator.ts`): 90%+
- UI components: 70%+ (focus on critical paths)
- Overall: 80%+

### Code Quality Checks

```bash
# TypeScript type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# All checks (run before commit)
npm run validate
```

**Pre-commit checklist**:
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)

## Testing the Game

### Manual Testing Checklist

#### P1 Stories (MVP)

**User Story 1: Play Basic Chess Game**
- [ ] Board displays 8x8 grid with alternating colors
- [ ] All 32 pieces in starting positions (white bottom, black top)
- [ ] White's turn indicator shows initially
- [ ] Click white pawn → can move 1 or 2 squares forward
- [ ] After move, turn switches to black
- [ ] Invalid moves rejected (e.g., move pawn sideways)
- [ ] Game detects checkmate and displays winner

**User Story 3: Capture Pieces**
- [ ] Move piece to square with opponent piece → capture occurs
- [ ] Captured piece removed from board
- [ ] Capturing piece occupies captured square

#### P2 Stories (Enhancements)

**User Story 2: See Available Moves**
- [ ] Click piece → piece highlights
- [ ] Valid destination squares highlighted
- [ ] Click highlighted square → piece moves
- [ ] Click elsewhere → selection cancels

**User Story 4: Special Moves**
- [ ] Castling works when conditions met
- [ ] En passant capture works
- [ ] Pawn promotion to rook (automatic)
- [ ] Special moves rejected when conditions not met

**User Story 5: Reset Game**
- [ ] "New Game" button resets board
- [ ] All pieces return to starting positions
- [ ] Turn resets to white

### Edge Cases Testing

- [ ] Prevent moves that expose own king to check
- [ ] Rapid clicking doesn't break state
- [ ] Stalemate detected correctly
- [ ] Game end message displays correctly

## Building for Production

### Create Production Build

```bash
npm run build
```

**Expected output**:
```
 ✓ Compiled successfully
 ✓ Generating static pages (3/3)
 ✓ Finalizing page optimization

Route (app)                    Size     First Load JS
┌ ○ /                         1.2 kB     85.3 kB
└ ○ /favicon.ico              0 B        0 B

○  (Static)  prerendered as static content
```

**Build artifacts** (in `.next/` directory):
- Optimized JavaScript bundles
- CSS stylesheets
- Static HTML pages

### Export Static Site (Optional)

For deployment to static hosting:

```bash
# Add to next.config.js:
# output: 'export'

npm run build
npm run export
```

Creates `out/` directory with static files ready for deployment.

### Preview Production Build

```bash
npm run start
```

Serves production build locally at `http://localhost:3000` for testing.

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Automatic deployments**:
1. Connect GitHub repo to Vercel
2. Every push to main → auto-deploy to production
3. Every PR → auto-deploy to preview URL

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

Or use Netlify UI:
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `out` (if using static export) or `.next` (for SSR)

### Option 3: GitHub Pages

```bash
# Requires static export in next.config.js
npm run build
npm run export

# Deploy to gh-pages branch
npx gh-pages -d out
```

Access at: `https://<username>.github.io/<repo-name>/`

### Option 4: Docker (Future)

Not needed for MVP (static site sufficient), but for future reference:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

**Issue**: `npm install` fails
- **Solution**: Update Node.js to 18+ (`node --version`), clear npm cache (`npm cache clean --force`)

**Issue**: Port 3000 already in use
- **Solution**: Kill process on port 3000 (`lsof -ti:3000 | xargs kill`) or use different port (`npm run dev -- -p 3001`)

**Issue**: TypeScript errors after pulling changes
- **Solution**: Delete `.next/` and `node_modules/`, reinstall (`npm install`), restart dev server

**Issue**: Tests failing
- **Solution**: Check Node version (18+), update Jest config, ensure test environment set to `jsdom`

**Issue**: Build fails with "Out of memory"
- **Solution**: Increase Node memory limit (`NODE_OPTIONS=--max-old-space-size=4096 npm run build`)

### Performance Issues

**Slow initial load** (>2s target):
- Run `npm run build && npm run analyze` to check bundle size
- Look for large dependencies in bundle analyzer
- Consider code splitting or lazy loading (deferred to future)

**Slow move feedback** (>100ms target):
- Open React DevTools profiler
- Check for unnecessary re-renders
- Add `React.memo` to ChessSquare components if needed

## Development Best Practices

### File Organization

```
src/
├── app/              # Next.js pages
├── components/       # React components (one per file)
├── lib/              # Game logic (pure functions)
└── __tests__/        # Tests (mirror src structure)
```

**Naming conventions**:
- Components: PascalCase (`ChessBoard.tsx`)
- Utilities: camelCase (`chess-rules.ts`)
- Tests: `*.test.ts` or `*.test.tsx`
- Types: `types.ts` (one file for shared types)

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feat/add-castling

# 2. Make changes, commit frequently
git add src/lib/chess-rules.ts
git commit -m "feat: implement castling logic"

# 3. Run validation before push
npm run validate

# 4. Push and create PR
git push origin feat/add-castling
```

**Commit message format** (per constitution):
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test updates
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `style:` - Formatting changes

### Code Review Checklist

- [ ] All tests pass
- [ ] TypeScript types defined (no `any`)
- [ ] Functions documented (TSDoc comments for complex logic)
- [ ] No console.logs in production code
- [ ] Performance acceptable (no unnecessary re-renders)
- [ ] Accessible (keyboard navigation works)
- [ ] Constitutional principles followed (YAGNI, simplicity)

## Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Jest: https://jestjs.io/docs
- Testing Library: https://testing-library.com/docs/react-testing-library/intro

### Chess Rules Reference
- FIDE Laws of Chess: https://www.fide.com/fide/handbook.html?id=208&view=article
- Chess Programming Wiki: https://www.chessprogramming.org

### Project-Specific
- Specification: `specs/001-chess-game/spec.md`
- Implementation Plan: `specs/001-chess-game/plan.md`
- Data Model: `specs/001-chess-game/data-model.md`

## Next Steps

1. **For development**: Run `npm run dev` and start implementing User Story 1 (Basic Gameplay)
2. **For testing**: Run `npm test -- --watch` in separate terminal
3. **For deployment**: Follow Vercel deployment steps after MVP complete

See `specs/001-chess-game/tasks.md` (created by `/speckit.tasks`) for detailed implementation task list.

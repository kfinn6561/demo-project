<!--
  Sync Impact Report
  ==================
  Version change: (new constitution) → 1.0.0
  Type: MAJOR (initial ratification)

  Principles defined:
  - I. Clear Documentation
  - II. Simplicity & YAGNI
  - III. Incremental Delivery
  - IV. Test Coverage
  - V. Review & Validation

  Templates status:
  - ✅ plan-template.md: Constitution Check section references this file
  - ✅ spec-template.md: Aligned with documentation and user story principles
  - ✅ tasks-template.md: Aligned with incremental delivery and testing principles
  - ✅ agent-file-template.md: No updates required (runtime guidance only)
  - ⚠ Command files: No agent-specific references found - validation passed

  Follow-up TODOs: None
-->

# demo-project Constitution

## Core Principles

### I. Clear Documentation

Every feature MUST be documented before implementation:

- Specifications define WHAT users need and WHY (no implementation details)
- Implementation plans detail HOW to build (technical decisions, architecture, contracts)
- Task lists break work into independently testable increments
- Each document MUST be complete, unambiguous, and approved before proceeding to next phase
- Code should be self-explanatory; comments explain WHY, not WHAT

**Rationale**: Documentation ensures alignment between stakeholders and developers, prevents
scope creep, and creates a knowledge base for future maintainers. Without clear specs,
features drift from user needs; without plans, implementation becomes ad-hoc and error-prone.

### II. Simplicity & YAGNI

Start simple and build only what is needed now:

- Resist premature abstraction - three similar lines is better than a premature helper function
- No speculative features, configuration options, or architectural patterns
- When solving a problem, choose the simplest solution that works
- Complexity MUST be justified in the plan's Complexity Tracking section
- Refactor when patterns emerge naturally from real usage, not anticipated usage

**Rationale**: Over-engineering creates maintenance burden, cognitive overhead, and technical
debt. Simple code is easier to understand, test, debug, and modify. Future requirements are
unpredictable; building for hypothetical scenarios wastes effort and often solves the wrong
problem.

### III. Incremental Delivery

Ship features in independently testable, user-valuable increments:

- User stories MUST be prioritized (P1, P2, P3) by user value
- Each story MUST be independently implementable and testable
- P1 stories form the Minimum Viable Product (MVP)
- Complete and validate one story before starting the next
- Deploy and gather feedback at each increment

**Rationale**: Incremental delivery reduces risk by validating assumptions early, allows
course correction based on real user feedback, and delivers value progressively rather than
in a single big-bang release. Independent stories enable parallel development and graceful
degradation if priorities shift.

### IV. Test Coverage

Maintain comprehensive test coverage appropriate to risk:

- Unit tests for business logic and edge cases
- Integration tests for inter-service communication and data flows
- Contract tests for API boundaries and shared schemas
- Test coverage MUST increase when bugs are found (regression prevention)
- Tests document expected behavior and serve as executable specifications

**Rationale**: Tests catch regressions, document system behavior, enable confident refactoring,
and reduce debugging time. Appropriate test coverage ensures reliability without over-testing
trivial code. Contract tests prevent breaking changes across service boundaries.

### V. Review & Validation

All work products require validation before proceeding:

- Specifications validated against quality checklist before planning
- Plans reviewed for constitutional compliance before implementation
- Code reviewed for correctness, security, and adherence to principles
- Each phase gate MUST pass before proceeding to next phase
- Validation findings MUST be addressed, not bypassed

**Rationale**: Reviews catch errors early when they're cheapest to fix, ensure constitutional
compliance, transfer knowledge across team members, and maintain consistent quality standards.
Phase gates prevent cascading failures from poor foundations.

## Development Workflow

### Phase Sequence

All features MUST follow this workflow:

1. **Specification** (`/speckit.specify`): Define WHAT and WHY
   - Validation: Spec quality checklist MUST pass
   - Output: `specs/###-feature-name/spec.md`

2. **Planning** (`/speckit.plan`): Define HOW
   - Validation: Constitution Check MUST pass (unjustified complexity fails build)
   - Output: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

3. **Task Breakdown** (`/speckit.tasks`): Define WHEN and WHO
   - Validation: Tasks organized by user story with clear dependencies
   - Output: `tasks.md`

4. **Implementation** (`/speckit.implement`): Execute tasks in priority order
   - Validation: Tests pass, code review approves, story acceptance criteria met
   - Output: Working, tested, documented feature increment

### Cross-Cutting Requirements

- **Security**: Validate inputs at system boundaries; trust internal code and framework guarantees
- **Error Handling**: User-facing errors MUST be actionable; log technical details separately
- **Performance**: Meet domain-specific goals defined in plan's Technical Context
- **Observability**: Structured logging for debugging; metrics for SLA monitoring

## Governance

### Amendment Process

1. Proposed changes MUST include rationale and impact analysis
2. Constitution Check gates in plans MUST be updated to reflect new principles
3. Version MUST increment following semantic versioning:
   - MAJOR: Backward-incompatible governance changes, principle removal/redefinition
   - MINOR: New principle or materially expanded guidance
   - PATCH: Clarifications, wording fixes, non-semantic refinements
4. All dependent templates MUST be reviewed and updated if affected
5. Amendments take effect immediately upon ratification

### Compliance

- All pull requests MUST verify constitutional compliance
- Plans with unjustified complexity violations MUST NOT proceed to implementation
- Specifications with incomplete quality checklists MUST NOT proceed to planning
- Principle violations discovered post-implementation MUST be tracked as technical debt

### Conflict Resolution

- This constitution supersedes all other practices, conventions, and documentation
- In case of ambiguity, favor Simplicity & YAGNI (Principle II)
- When principles conflict, prioritize in order: Clear Documentation → Incremental Delivery →
  Test Coverage → Simplicity → Review

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08

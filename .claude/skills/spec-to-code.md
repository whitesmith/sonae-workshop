---
name: spec-to-code
description: Implement a feature from a spec file using TDD — explore the codebase, plan the approach, write tests first, then implement code to make them pass.
user_invocable: true
---

# Spec to Code (TDD)

You are implementing a feature from a technical specification file using Test-Driven Development. You write tests first, then implement the minimum code needed to make them pass.

## Instructions

### Step 1: Read the spec

The user will provide a spec file path or ticket key (e.g., `SCRUM-9` → `specs/SCRUM-9.md`). Read the spec file to understand:

- What endpoints, services, and components need to be created or modified
- Validation rules and error cases
- Expected request/response shapes
- Acceptance criteria

### Step 2: Explore the codebase

Use the Explore agent to understand the current patterns before writing any code. Focus on files that are similar to what you'll be creating. Key areas:

- **Store**: `server/lib/store.js` — how state is initialized and reset
- **Services**: `server/services/` — business logic patterns (imports, exports, error throwing)
- **Routes**: `server/routes/` — Express router patterns (try/catch, status codes, delegation to services)
- **App registration**: `server/app.js` — how routers are mounted
- **Frontend API**: `src/api.js` — fetch wrapper pattern
- **Components**: `src/components/` — React + Tailwind patterns
- **App state**: `src/App.jsx` — state management and data flow
- **Existing tests**: `tests/unit/`, `tests/integration/` — test structure, assertions, setup patterns
- **Test setup**: `tests/setup.js` — store reset behavior

Only read files relevant to the feature being implemented. Match the patterns you find exactly.

### Step 3: Enter plan mode and design the implementation

Switch to plan mode using the EnterPlanMode tool. Design a step-by-step implementation plan that follows strict TDD order:

**Plan structure (always in this order):**

1. **Store changes** (if any) — smallest possible change to enable the feature
2. **Service layer** — business logic with validation
3. **Unit tests for the service** — write these BEFORE implementing the service
4. **Service implementation** — make the unit tests pass
5. **Route layer** — thin Express handlers
6. **Integration tests** — write these BEFORE implementing routes
7. **Route implementation** — make the integration tests pass
8. **App registration** — mount new routes
9. **Frontend API methods** — add fetch wrappers
10. **Frontend components** — modify/create components
11. **App wiring** — connect state, handlers, and props
12. **Run all tests** — verify everything passes

The plan should reference specific files, function names, error messages, and status codes from the spec. No hand-waving.

Present the plan to the user for approval before proceeding.

### Step 4: Implement using TDD

After plan approval, exit plan mode and implement in strict TDD cycles:

#### Cycle 1: Backend service

1. **Store change**: Make the minimal store modification (e.g., add field to `reset()`)
2. **Write unit tests first**: Create `tests/unit/<name>.test.js` with all test cases from the spec:
   - Happy path tests (get, add, remove, etc.)
   - Validation error tests (throws expected error messages)
   - Edge case tests (duplicates, nonexistent items, etc.)
   - Follow the existing test file patterns exactly (imports, describe/it structure, assertions)
3. **Run unit tests** — confirm they FAIL (this validates the tests are correct)
4. **Implement the service**: Create `server/services/<name>.js` following the existing service pattern
5. **Run unit tests** — confirm they PASS

#### Cycle 2: Backend routes

1. **Write integration tests first**: Create `tests/integration/<name>.test.js` with all test cases from the spec:
   - HTTP method, path, expected status codes
   - Response body assertions
   - Error response assertions
   - Cross-feature edge cases (e.g., "favorites unaffected by cart clear")
   - Follow existing integration test patterns (supertest, app import)
2. **Run integration tests** — confirm they FAIL
3. **Implement the route**: Create `server/routes/<name>.js` following existing router pattern
4. **Mount the route** in `server/app.js`
5. **Run integration tests** — confirm they PASS

#### Cycle 3: Frontend

1. **Add API methods** to `src/api.js`
2. **Modify components** — add new props, UI elements, event handlers
3. **Wire up in `src/App.jsx`** — state, effects, handlers, prop passing

#### Final verification

1. **Run full test suite**: `npm test` — all existing + new tests must pass
2. **Report results** to the user with a summary of what was implemented

### Key rules

- **Never write implementation code before its tests exist.** The test file must be created and confirmed to fail before writing the production code.
- **Match existing patterns exactly.** Import styles, error message formats, status codes, file structure — all should be consistent with the existing codebase.
- **Use the spec as the source of truth.** Don't invent requirements. If something is ambiguous, ask the user.
- **Run tests after each cycle.** Don't batch — verify incrementally.
- **Keep commits logical.** If the user asks you to commit, suggest one commit per TDD cycle or one for the full feature — ask their preference.
- **Frontend has no tests in this project.** Only backend code follows TDD cycles. Frontend changes are implemented directly after backend is verified.

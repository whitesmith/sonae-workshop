---
name: jira-to-spec
description: Fetch a Jira ticket and generate a technical specification document following the project's established patterns and template.
user_invocable: true
---

# Jira to Technical Specification

You are generating a technical specification from a Jira ticket for the Fresh Cart project.

## Instructions

### Step 1: Get the Jira ticket

The user will provide a Jira ticket key (e.g., `SCRUM-9`). Fetch it using the Atlassian MCP tool:

- Use `mcp__atlassian__getJiraIssue` with `responseContentFormat: "markdown"` to get the ticket details.
- If no `cloudId` is known, first use `mcp__atlassian__getAccessibleAtlassianResources` to discover it.
- Extract: summary, description, issue type, acceptance criteria, and any linked issues.

### Step 2: Analyze the codebase

Before writing the spec, understand the current codebase patterns by reading key files:

- **Store**: `server/lib/store.js` — singleton in-memory store with `reset()` method
- **Services**: `server/services/cart.js`, `server/services/products.js` — business logic pattern (import store, export functions, throw errors for validation)
- **Routes**: `server/routes/cart.js`, `server/routes/products.js` — thin Express routers that delegate to services, use try/catch for error responses
- **App registration**: `server/app.js` — how routes are mounted
- **Frontend API**: `src/api.js` — fetch wrapper pattern with `request()` helper
- **Frontend components**: `src/components/` — React components with Tailwind CSS
- **App state**: `src/App.jsx` — root component managing state and API calls
- **Unit tests**: `tests/unit/cart.test.js` — vitest with `describe/it/expect`, test services directly
- **Integration tests**: `tests/integration/cart.test.js` — supertest against the Express app
- **Test setup**: `tests/setup.js` — resets store before each test
- **Product catalog**: `server/data/products.js` — hardcoded product data (use for realistic examples)

Read whichever files are relevant to understand patterns that apply to the feature being specified.

### Step 3: Generate the specification

Write the spec as a markdown file to `specs/<ticket-key>.md` (e.g., `specs/SCRUM-9.md`).

Follow this template structure exactly:

```markdown
# Feature: <Feature Name>

**Ticket:** <TICKET-KEY> | **Type:** <Story/Bug/Task> | **Generated:** <YYYY-MM-DD>

---

## 1. Overview

<2-3 sentence summary of what the feature does, why it matters, and any important constraints. Written from the perspective of the app's behavior, not implementation details.>

## 2. Requirements

### Functional Requirements

- **FR-1:** <requirement>
- **FR-2:** <requirement>
- ...

### Non-Functional Requirements

- **NFR-1:** Follow existing service/route/component patterns established in the codebase
- **NFR-2:** All new backend endpoints have integration tests
- ...add more as needed

## 3. API Specification

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/... | ... |
| POST | /api/... | ... |
| ... | ... | ... |

### Request/Response Examples

<For each endpoint, show request body (if any) and response examples including success and error cases. Use realistic data from the product catalog.>

```
GET /api/...

// Response 200
{ ... }
```

```
POST /api/...

// Request
{ ... }

// Response 201
{ ... }

// Error 4xx
{ "error": "..." }
```

## 4. Data Model

### Store Extension

<Describe what fields to add to the store in `server/lib/store.js`. Include a table:>

| Field | Type | Description |
|-------|------|-------------|
| ... | ... | ... |

<Note any impact on `reset()` method.>

### Response Shape

<Table describing the shape of objects returned by the API:>

| Field | Type | Source |
|-------|------|--------|
| ... | ... | ... |

## 5. Validation Rules

<Bulleted list of validation rules with expected error responses:>

- `fieldName` (endpoint): Rule description. Return `<status>` with `"<error message>"` if violated.
- ...

## 6. Edge Cases

<List of edge cases as questions and answers:>

- What happens when ...? → <answer>
- What happens when ...? → <answer>
- ...

## 7. Files to Create / Modify

### Backend

- `server/services/<name>.js` — <description> (follows `cart.js` pattern)
- `server/routes/<name>.js` — <description> (follows `cart.js` pattern)
- ...

### Frontend

<List new files or modifications to existing files:>

- `src/components/<Name>.jsx` — <description>
- `src/api.js` — <what to add>
- `src/App.jsx` — <what to change>
- ...

### Tests

- `tests/unit/<name>.test.js` — <description>
- `tests/integration/<name>.test.js` — <description>

### Registration

- `server/app.js` — <what to register>

## 8. Acceptance Criteria

<Numbered checklist derived from the Jira ticket's acceptance criteria plus any additional criteria inferred from the spec:>

- **AC-1:** <criterion>
- **AC-2:** <criterion>
- ...
- **AC-N:** All existing tests continue to pass (`npm test`)
- **AC-N+1:** New integration tests cover: <list key scenarios>
- **AC-N+2:** New unit tests cover: <list key scenarios>
```

### Writing Guidelines

- **Be specific**: Use actual field names, HTTP status codes, endpoint paths, and error messages. No hand-waving.
- **Use realistic data**: Pull product examples from `server/data/products.js` for request/response examples.
- **Match existing patterns**: The spec should describe code that looks like it belongs in this codebase. Reference specific existing files as patterns to follow.
- **Error responses**: Always specify the HTTP status code and exact error message string.
- **Keep it actionable**: A developer should be able to implement the feature from this spec alone, without needing to ask clarifying questions.
- **Don't over-specify UI**: For frontend changes, describe behavior and state, not pixel-level details. Trust the developer to match existing Tailwind styles.
- **Include the "boring" stuff**: Store reset behavior, test registration, route mounting — these are easy to forget.

### Step 4: Present the result

After writing the file, give a brief summary of the spec to the user, highlighting:
- The feature name and ticket
- Number of endpoints, files to create/modify
- Any assumptions or decisions you made that the user should review

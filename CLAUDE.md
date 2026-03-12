# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Fresh Cart — a grocery shopping list app with a React frontend and Express backend. In-memory data store (no database). Used as a workshop project.

## Commands

- `npm run dev` — starts both server (port 3001) and client (Vite, port 5173) concurrently
- `npm run dev:server` — server only, with `--watch` for auto-reload
- `npm run dev:client` — Vite dev server only
- `npm test` — run all tests once (`vitest run`)
- `npm run test:watch` — run tests in watch mode
- `npx vitest run tests/unit/cart.test.js` — run a single test file
- `npm run format` — Prettier formatting 

## Architecture

**Two-process setup:** Vite dev server proxies `/api` requests to Express on port 3001 (configured in `vite.config.js`).

### Server (`server/`)
- `index.js` — entry point, starts Express on PORT (default 3001)
- `app.js` — Express app setup, mounts routes at `/api/products` and `/api/cart`
- `routes/` — thin route handlers that delegate to services
- `services/` — business logic (cart operations, product queries)
- `lib/store.js` — singleton in-memory store with `reset()` method
- `lib/discounts.js` — discount validation and calculation (codes: FRESH10, FRESH20, SAVE5)
- `data/products.js` — hardcoded product catalog (16 items across 5 categories)

### Client (`src/`)
- React 18 app, Tailwind CSS for styling
- `api.js` — fetch wrapper for all API calls
- `App.jsx` — root component, manages all state and API interactions
- `components/` — presentational components (ProductGrid, Cart, SearchBar, CategoryFilter, etc.)

### Tests (`tests/`)
- **Vitest** with `globals: true` and `node` environment
- `tests/setup.js` — calls `store.reset()` before each test
- `tests/unit/` — test services and lib functions directly
- `tests/integration/` — test API endpoints via `supertest` against `server/app.js`

## Key Patterns

- All monetary calculations use `Math.round(x * 100) / 100` to avoid floating point issues
- The store is a singleton class; tests reset it via `store.reset()` in the setup file
- Cart API returns the full cart state (items with product details, subtotal, discount, total) on every mutation
- Prettier config: single quotes, trailing commas

## Git Practices

Branch name:
Branches should be named `feature/<short-description>`.
bug: `bug/fix-cart-total`
# Feature: Add Favorites / Wishlist

**Ticket**: SCRUM-9
**Type**: Story
**Generated**: 2026-03-11

## 1. Overview

Allow shoppers to mark products as favorites so they can quickly find items they buy regularly. A heart icon on each product card toggles favorite status, and a "My Favorites" filter shows only favorited products. Favorites are stored server-side and persist across page refreshes. Since the app has no user accounts, favorites are a single shared list.

## 2. Requirements

### Functional Requirements

- [ ] FR-1: Add a favorites service that manages a list of favorite product IDs in the in-memory store
- [ ] FR-2: Add API endpoints to list, add, and remove favorites
- [ ] FR-3: The favorites list endpoint returns full product objects (not just IDs), resolved from the product catalog
- [ ] FR-4: Add a heart icon to each ProductCard that toggles the product's favorite status on click
- [ ] FR-5: Heart appears filled/red when favorited, outlined when not
- [ ] FR-6: Add a "My Favorites" filter option alongside existing category filters in CategoryFilter
- [ ] FR-7: Favorites state is fetched from the backend on initial app load
- [ ] FR-8: Favorites are stored separately from cart data — clearing the cart must not affect favorites

### Non-Functional Requirements

- [ ] NFR-1: Follow existing service/route/component patterns established in the codebase
- [ ] NFR-2: All new backend endpoints have integration tests

## 3. API Specification

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/favorites | List all favorited products (full product objects) |
| POST | /api/favorites | Add a product to favorites |
| DELETE | /api/favorites/:productId | Remove a product from favorites |

### Request/Response Examples

**GET /api/favorites**
```json
// Response 200
[
  { "id": 1, "name": "Banana", "emoji": "🍌", "price": 1.29, "category": "Fruits" },
  { "id": 5, "name": "Whole Milk", "emoji": "🥛", "price": 2.49, "category": "Dairy" }
]
```

**POST /api/favorites**
```json
// Request
{ "productId": 1 }

// Response 201
[
  { "id": 1, "name": "Banana", "emoji": "🍌", "price": 1.29, "category": "Fruits" }
]
```

```json
// Error 404 — product does not exist
{ "error": "Product not found" }

// Error 409 — already favorited
{ "error": "Product is already in favorites" }
```

**DELETE /api/favorites/:productId**
```json
// Response 200
[]  // Updated favorites list
```

```json
// Error 404 — product not in favorites
{ "error": "Product not in favorites" }
```

## 4. Data Model

### Store Extension

Add a `favorites` array to the existing store in `server/lib/store.js`:

| Field | Type | Description |
|-------|------|-------------|
| favorites | number[] | Array of product IDs that have been favorited |

The store's `reset()` method must also clear `this.favorites = []`.

### Favorites Item (resolved for API responses)

| Field | Type | Source |
|-------|------|--------|
| id | number | Product catalog |
| name | string | Product catalog |
| emoji | string | Product catalog |
| price | number | Product catalog |
| category | string | Product catalog |

## 5. Validation Rules

- `productId` (POST /api/favorites): Must reference an existing product in the catalog. Return 404 with `"Product not found"` if not.
- `productId` (POST /api/favorites): Must not already be in favorites. Return 409 with `"Product is already in favorites"` if duplicate.
- `productId` (DELETE /api/favorites/:productId): Must be in the favorites list. Return 404 with `"Product not in favorites"` if not found.

## 6. Edge Cases

- [ ] What happens when a user favorites a product that doesn't exist? → 404 error
- [ ] What happens when a user favorites an already-favorited product? → 409 conflict error
- [ ] What happens when a user removes a product that isn't in favorites? → 404 error
- [ ] What happens when the cart is cleared? → Favorites remain unaffected
- [ ] What happens when the store is reset (server restart)? → Favorites are cleared (in-memory only)
- [ ] What happens when "My Favorites" filter is active but there are no favorites? → Empty product grid

## 7. Files to Create

### Backend
- `server/services/favorites.js` — Business logic: getAll, add, remove (follows cart.js pattern)
- `server/routes/favorites.js` — Express routes: GET, POST, DELETE (follows cart.js pattern)

### Frontend
- No new components needed — modify existing:
  - `src/components/ProductCard.jsx` — Add heart icon toggle
  - `src/components/CategoryFilter.jsx` — Add "My Favorites" filter option
  - `src/App.jsx` — Add favorites state, fetch on load, pass handlers to components
  - `src/api.js` — Add favorites API methods

### Tests
- `tests/unit/favorites.test.js` — Unit tests for favorites service
- `tests/integration/favorites.test.js` — Integration tests for favorites API endpoints

### Registration
- `server/app.js` — Import and mount favorites routes at `/api/favorites`

## 8. Acceptance Criteria

- [ ] AC-1: Heart icon on each product card toggles favorite status via POST/DELETE
- [ ] AC-2: Favorited products show a filled red heart; non-favorites show an outlined heart
- [ ] AC-3: "My Favorites" filter in CategoryFilter displays only favorited products
- [ ] AC-4: Favorites persist after page refresh (fetched from backend on load)
- [ ] AC-5: Clearing the shopping cart does not affect the favorites list
- [ ] AC-6: Favoriting a non-existent product returns 404
- [ ] AC-7: Favoriting an already-favorited product returns 409
- [ ] AC-8: All existing tests continue to pass (`npm test`)
- [ ] AC-9: New integration tests cover: list favorites, add favorite, remove favorite, duplicate add, non-existent product, non-existent remove
- [ ] AC-10: New unit tests cover favorites service logic

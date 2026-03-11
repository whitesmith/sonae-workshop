# Workshop Jira Tickets

Ready to copy-paste into Jira. Each ticket is self-contained.

---

## Ticket 1: Add Favorites / Wishlist Feature

**Title:** Add Favorites / Wishlist Feature
**Type:** Story
**Priority:** High

### Description

#### Background

Users want the ability to mark grocery products as favorites so they can quickly find items they purchase regularly. This is the first step toward a personalized shopping experience. Since the app does not have user accounts yet, favorites will be stored as a single global list in the backend's in-memory store.

#### Requirements

- **Backend:**
  - Create a new favorites service (`server/services/favorites.js`) that manages a list of favorite product IDs in the in-memory store
  - Create new favorites routes (`server/routes/favorites.js`) with the following endpoints:
    - `GET /api/favorites` — returns the list of favorited products (full product objects, not just IDs)
    - `POST /api/favorites` — adds a product to favorites (request body: `{ "productId": "..." }`)
    - `DELETE /api/favorites/:productId` — removes a product from favorites
  - Favorites must be stored separately from cart data in `store.js` so that clearing the cart does not affect favorites
  - Return 404 if attempting to favorite a product ID that does not exist in the catalog
  - Return 409 if attempting to add a product that is already in favorites

- **Frontend:**
  - Add a heart icon to each `ProductCard` component that toggles the product's favorite status on click
  - Heart should appear filled/red when the product is favorited, outlined when not
  - Add a "My Favorites" filter option (alongside existing category filters) that shows only favorited products
  - Favorites state should be fetched from the backend on initial load

#### Acceptance Criteria

- [ ] User can click a heart icon on any product card to add it to favorites
- [ ] Clicking the heart again removes the product from favorites
- [ ] A "My Favorites" filter shows only favorited products
- [ ] Favorites persist across page refreshes (stored in backend)
- [ ] Clearing the shopping cart does not affect the favorites list
- [ ] All new backend endpoints have integration tests
- [ ] All new frontend behavior has unit tests

#### Technical Notes

- Follow existing patterns: see `server/services/cart.js` and `server/routes/cart.js` for reference
- Store favorites as an array of product IDs in `server/lib/store.js`
- The GET endpoint should resolve IDs to full product objects using the product catalog in `server/data/products.js`
- Use Vitest + Supertest for backend tests, matching the existing test setup in `tests/`

---

## Ticket 2: Add Product Reviews

**Title:** Add Product Reviews
**Type:** Story
**Priority:** Medium

### Description

#### Background

To help shoppers make better purchasing decisions, we want to allow product reviews. Each review consists of a text comment and a numeric rating (1-5). This ticket covers backend implementation only — frontend display of reviews will be handled in a follow-up ticket.

#### Requirements

- **Backend:**
  - Create a new reviews service (`server/services/reviews.js`) that manages reviews per product in the in-memory store
  - Create new reviews routes (`server/routes/reviews.js`) with the following endpoints:
    - `GET /api/products/:productId/reviews` — returns all reviews for a given product
    - `POST /api/products/:productId/reviews` — adds a review for a product (request body: `{ "text": "...", "rating": N }`)
  - Each review should be stored with: `id` (auto-generated), `productId`, `text`, `rating`, `createdAt` (ISO timestamp)
  - Validate that `rating` is an integer between 1 and 5
  - Validate that `text` is a non-empty string (max 500 characters)
  - Return 404 if the product ID does not exist in the catalog
  - The GET endpoint should also return an `averageRating` field computed from all reviews for that product

- **No frontend work** is required for this ticket

#### Acceptance Criteria

- [ ] `POST /api/products/:productId/reviews` creates a review and returns 201
- [ ] `GET /api/products/:productId/reviews` returns all reviews for a product plus the average rating
- [ ] Invalid ratings (outside 1-5) return 400
- [ ] Empty or overly long review text returns 400
- [ ] Reviewing a non-existent product returns 404
- [ ] All endpoints have integration tests with at least 3 test cases each

#### Technical Notes

- Store reviews as an object keyed by product ID in `server/lib/store.js`, e.g. `store.reviews = { "prod-1": [...], "prod-2": [...] }`
- Auto-generate review IDs with a simple counter or `crypto.randomUUID()`
- Follow existing patterns in the codebase for route/service structure

---

## Ticket 3: Add Cart Persistence with Local Storage

**Title:** Add Cart Persistence with Local Storage
**Type:** Story
**Priority:** Low

### Description

#### Background

Currently, when a user refreshes the browser, the frontend loses its local reference to the cart state and must re-fetch from the backend. While the backend's in-memory store retains cart data during a single server session, a server restart wipes everything. As a first step toward durability, we want the frontend to cache the cart in `localStorage` so the UI can display the cart immediately on load without waiting for the API, and gracefully handle cases where the backend has restarted.

#### Requirements

- **Frontend only** — no backend changes:
  - After every cart modification (add, update quantity, remove, apply discount, clear), save the current cart state to `localStorage` under the key `fresh-cart`
  - On app startup, read `fresh-cart` from `localStorage` and use it as the initial cart state
  - After loading from `localStorage`, still call `GET /api/cart` to sync with the backend. If the backend cart differs (e.g., server restarted), the frontend should POST items from localStorage to the backend to restore the cart
  - Provide a "Clear Cart" action that also removes the `fresh-cart` key from `localStorage`

#### Acceptance Criteria

- [ ] Cart items are visible immediately on page load from localStorage (no loading spinner for cached data)
- [ ] After a page refresh, the cart shows the same items as before the refresh
- [ ] If the backend is restarted but the frontend has cached data, the cart is restored by re-posting items to the backend
- [ ] Clearing the cart removes data from both backend and localStorage
- [ ] Unit tests cover the localStorage read/write logic

#### Technical Notes

- Use `JSON.parse` / `JSON.stringify` for serialization; wrap in try-catch to handle corrupted data
- Consider creating a small utility module (e.g., `src/lib/cartStorage.js`) to encapsulate localStorage logic and make it testable
- The sync-on-startup logic should handle the backend returning a different cart state gracefully — prefer the most recently modified version

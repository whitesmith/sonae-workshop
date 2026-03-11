# Favorites Feature — Planning Call Notes
**Date:** March 3, 2026
**Attendees:** Ana, Pedro, Sofia, Marco

---

Ana: ok so the main thing for next sprint is letting people favorite products. like a wishlist basically
Pedro: yeah heart icon on each product card, toggling adds/removes from favorites
Sofia: do we need a separate page for favorites or just a filter?
Ana: filter is fine, like the category filters we already have. "My Favorites" option somewhere
Pedro: makes sense. backend needs a new endpoint right? POST to add, DELETE to remove, GET to list
Marco: should we tie favorites to user accounts?
Ana: we don't have users yet lol
Marco: right right
Sofia: just use a single global favorites list for now, keep it simple. just a list of product IDs
Ana: yeah that works, same pattern as the cart — in-memory store

Pedro: question — should favorites survive when you clear the cart? like if someone resets cart do they lose favorites too
Sofia: no definitely not, those should be separate. different storage in the store
Ana: agreed, favorites are independent of cart state

Marco: oh while we're at it should we think about product ratings? like 1-5 stars
Ana: let's not scope creep this, we can do ratings later as a separate ticket
Marco: fair enough just thinking ahead
Pedro: yeah let's keep this focused

**Action items:**
- [ ] Backend: new favorites service + routes (GET/POST/DELETE /api/favorites)
- [ ] Frontend: heart icon on ProductCard component, toggle on click
- [ ] Frontend: add "My Favorites" filter option alongside categories
- [ ] Store: separate favorites array in store.js, don't touch cart logic
- [ ] Pedro to write the Jira ticket

Sofia: oh and the response from GET /api/favorites should return the full product objects not just IDs
Ana: good call, join against the product catalog in the service layer
Pedro: got it, will handle that in the service

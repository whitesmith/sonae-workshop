const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getCategories: () => request('/products/categories'),
  getCart: () => request('/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (productId) =>
    request(`/cart/items/${productId}`, { method: 'DELETE' }),
  applyDiscount: (code) =>
    request('/cart/discount', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  removeDiscount: () => request('/cart/discount', { method: 'DELETE' }),
  getFavorites: () => request('/favorites'),
  addFavorite: (productId) =>
    request(`/favorites/${productId}`, { method: 'POST' }),
  removeFavorite: (productId) =>
    request(`/favorites/${productId}`, { method: 'DELETE' }),
};

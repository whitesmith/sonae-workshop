import { store } from '../lib/store.js';
import { getProductById } from './products.js';

export function getFavorites() {
  return store.favorites;
}

export function addFavorite(productId) {
  const product = getProductById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (store.favorites.includes(productId)) {
    throw new Error('Product already in favorites');
  }

  store.favorites.push(productId);
  return { productId, product };
}

export function removeFavorite(productId) {
  const index = store.favorites.indexOf(productId);
  if (index === -1) {
    throw new Error('Product not in favorites');
  }

  store.favorites.splice(index, 1);
  return { productId };
}

export function getFavoriteProducts() {
  return store.favorites.map((id) => getProductById(id));
}

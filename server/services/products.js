import { products } from '../data/products.js';

export function getAllProducts({ category, search } = {}) {
  let result = [...products];

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(term));
  }

  return result;
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}

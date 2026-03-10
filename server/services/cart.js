import { store } from '../lib/store.js';
import { getProductById } from './products.js';
import { calculateDiscount } from '../lib/discounts.js';
import { validateDiscount } from '../lib/discounts.js';

export function getCart() {
  const items = store.cart.items.map((item) => {
    const product = getProductById(item.productId);
    return {
      ...item,
      product,
      lineTotal: Math.round(product.price * item.quantity * 100) / 100,
    };
  });

  const subtotal =
    Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) /
    100;
  const discountAmount = calculateDiscount(subtotal, store.cart.discount);
  const total = Math.round((subtotal - discountAmount) * 100) / 100;

  return {
    items,
    discount: store.cart.discount,
    subtotal,
    discountAmount,
    total,
  };
}

export function addItem(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Quantity must be a positive integer');
  }

  const product = getProductById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const existing = store.cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    store.cart.items.push({ productId, quantity });
  }

  return getCart();
}

export function updateItem(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Quantity must be a positive integer');
  }

  const item = store.cart.items.find((i) => i.productId === productId);
  if (!item) {
    throw new Error('Item not in cart');
  }

  item.quantity = quantity;
  return getCart();
}

export function removeItem(productId) {
  const index = store.cart.items.findIndex((i) => i.productId === productId);
  if (index === -1) {
    throw new Error('Item not in cart');
  }

  store.cart.items.splice(index, 1);
  return getCart();
}

export function applyDiscount(code) {
  const discount = validateDiscount(code);
  if (!discount) {
    throw new Error('Invalid discount code');
  }

  store.cart.discount = discount;
  return getCart();
}

export function removeDiscount() {
  store.cart.discount = null;
  return getCart();
}

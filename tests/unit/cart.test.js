import { describe, it, expect } from 'vitest';
import * as cartService from '../../server/services/cart.js';

describe('Cart Service', () => {
  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const cart = cartService.addItem(1, 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('increments quantity for existing item', () => {
      cartService.addItem(1, 1);
      const cart = cartService.addItem(1, 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    it('rejects invalid quantity', () => {
      expect(() => cartService.addItem(1, 0)).toThrow(
        'Quantity must be a positive integer',
      );
      expect(() => cartService.addItem(1, -1)).toThrow(
        'Quantity must be a positive integer',
      );
      expect(() => cartService.addItem(1, 1.5)).toThrow(
        'Quantity must be a positive integer',
      );
    });

    it('rejects invalid product', () => {
      expect(() => cartService.addItem(999, 1)).toThrow('Product not found');
    });
  });

  describe('updateItem', () => {
    it('updates quantity of existing item', () => {
      cartService.addItem(1, 1);
      const cart = cartService.updateItem(1, 5);
      expect(cart.items[0].quantity).toBe(5);
    });

    it('throws for item not in cart', () => {
      expect(() => cartService.updateItem(1, 5)).toThrow('Item not in cart');
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      cartService.addItem(1, 1);
      const cart = cartService.removeItem(1);
      expect(cart.items).toHaveLength(0);
    });

    it('throws for item not in cart', () => {
      expect(() => cartService.removeItem(1)).toThrow('Item not in cart');
    });
  });

  describe('getCart', () => {
    it('calculates subtotal correctly', () => {
      cartService.addItem(1, 2); // Bananas 0.99 x 2 = 1.98
      cartService.addItem(5, 1); // Milk 1.29 x 1 = 1.29
      const cart = cartService.getCart();
      expect(cart.subtotal).toBe(3.27);
      expect(cart.total).toBe(3.27);
    });

    it('applies discount to total', () => {
      cartService.addItem(1, 2); // 1.98
      cartService.addItem(5, 1); // 1.29 = subtotal 3.27
      cartService.applyDiscount('SONAE10'); // 10% off
      const cart = cartService.getCart();
      expect(cart.subtotal).toBe(3.27);
      expect(cart.discountAmount).toBe(0.33);
      expect(cart.total).toBe(2.94);
    });
  });

  describe('applyDiscount', () => {
    it('applies valid discount code', () => {
      cartService.addItem(1, 1);
      const cart = cartService.applyDiscount('SONAE10');
      expect(cart.discount).not.toBeNull();
      expect(cart.discount.code).toBe('SONAE10');
    });

    it('rejects invalid discount code', () => {
      expect(() => cartService.applyDiscount('FAKE')).toThrow(
        'Invalid discount code',
      );
    });
  });

  describe('removeDiscount', () => {
    it('removes applied discount', () => {
      cartService.addItem(1, 1);
      cartService.applyDiscount('SONAE10');
      const cart = cartService.removeDiscount();
      expect(cart.discount).toBeNull();
      expect(cart.discountAmount).toBe(0);
    });
  });
});

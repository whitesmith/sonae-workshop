import { describe, it, expect } from 'vitest';
import * as favoritesService from '../../server/services/favorites.js';

describe('Favorites Service', () => {
  describe('getFavorites', () => {
    it('returns empty array initially', () => {
      expect(favoritesService.getFavorites()).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('adds a product to favorites', () => {
      const result = favoritesService.addFavorite(1);
      expect(result.productId).toBe(1);
      expect(result.product).toBeDefined();
      expect(result.product.id).toBe(1);
      expect(favoritesService.getFavorites()).toEqual([1]);
    });

    it('throws for duplicate favorite', () => {
      favoritesService.addFavorite(1);
      expect(() => favoritesService.addFavorite(1)).toThrow(
        'Product already in favorites',
      );
    });

    it('throws for nonexistent product', () => {
      expect(() => favoritesService.addFavorite(999)).toThrow(
        'Product not found',
      );
    });
  });

  describe('removeFavorite', () => {
    it('removes a product from favorites', () => {
      favoritesService.addFavorite(1);
      const result = favoritesService.removeFavorite(1);
      expect(result.productId).toBe(1);
      expect(favoritesService.getFavorites()).toEqual([]);
    });

    it('throws for product not in favorites', () => {
      expect(() => favoritesService.removeFavorite(1)).toThrow(
        'Product not in favorites',
      );
    });
  });
});

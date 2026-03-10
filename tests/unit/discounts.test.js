import { describe, it, expect } from 'vitest';
import {
  validateDiscount,
  calculateDiscount,
} from '../../server/lib/discounts.js';

describe('validateDiscount', () => {
  it('returns discount for valid code', () => {
    const result = validateDiscount('SONAE10');
    expect(result).toEqual({
      code: 'SONAE10',
      type: 'percentage',
      value: 10,
      label: '10% off',
    });
  });

  it('is case insensitive', () => {
    const result = validateDiscount('sonae10');
    expect(result).not.toBeNull();
    expect(result.code).toBe('SONAE10');
  });

  it('returns null for invalid code', () => {
    expect(validateDiscount('INVALID')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(validateDiscount('')).toBeNull();
    expect(validateDiscount(null)).toBeNull();
    expect(validateDiscount(undefined)).toBeNull();
  });
});

describe('calculateDiscount', () => {
  it('calculates percentage discount', () => {
    const discount = { type: 'percentage', value: 10 };
    expect(calculateDiscount(100, discount)).toBe(10);
  });

  it('calculates fixed discount', () => {
    const discount = { type: 'fixed', value: 5 };
    expect(calculateDiscount(20, discount)).toBe(5);
  });

  it('caps fixed discount at subtotal', () => {
    const discount = { type: 'fixed', value: 5 };
    expect(calculateDiscount(3, discount)).toBe(3);
  });

  it('returns 0 when no discount', () => {
    expect(calculateDiscount(100, null)).toBe(0);
  });

  it('rounds percentage discount to 2 decimal places', () => {
    const discount = { type: 'percentage', value: 10 };
    expect(calculateDiscount(9.99, discount)).toBe(1);
  });
});

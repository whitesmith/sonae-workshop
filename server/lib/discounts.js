const DISCOUNT_CODES = {
  FRESH10: { type: 'percentage', value: 10, label: '10% off' },
  FRESH20: { type: 'percentage', value: 20, label: '20% off' },
  SAVE5: { type: 'fixed', value: 5, label: '€5 off' },
};

export function validateDiscount(code) {
  const discount = DISCOUNT_CODES[code?.toUpperCase()];
  if (!discount) return null;
  return { code: code.toUpperCase(), ...discount };
}

export function calculateDiscount(subtotal, discount) {
  if (!discount) return 0;
  if (discount.type === 'percentage') {
    return Math.round(subtotal * (discount.value / 100) * 100) / 100;
  }
  if (discount.type === 'fixed') {
    return Math.min(discount.value, subtotal);
  }
  return 0;
}

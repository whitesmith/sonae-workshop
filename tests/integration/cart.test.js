import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/app.js';

describe('Cart API', () => {
  it('returns empty cart initially', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });

  it('adds item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(2);
  });

  it('updates item quantity', async () => {
    await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 1 });
    const res = await request(app)
      .patch('/api/cart/items/1')
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body.items[0].quantity).toBe(5);
  });

  it('removes item from cart', async () => {
    await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 1 });
    const res = await request(app).delete('/api/cart/items/1');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });

  it('applies discount code', async () => {
    await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 1 });
    const res = await request(app)
      .post('/api/cart/discount')
      .send({ code: 'SONAE10' });
    expect(res.status).toBe(200);
    expect(res.body.discount).not.toBeNull();
    expect(res.body.discountAmount).toBeGreaterThan(0);
  });

  it('rejects invalid discount code', async () => {
    const res = await request(app)
      .post('/api/cart/discount')
      .send({ code: 'INVALID' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid discount code');
  });

  it('removes discount', async () => {
    await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 1 });
    await request(app)
      .post('/api/cart/discount')
      .send({ code: 'SONAE10' });
    const res = await request(app).delete('/api/cart/discount');
    expect(res.status).toBe(200);
    expect(res.body.discount).toBeNull();
  });
});

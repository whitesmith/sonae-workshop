import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/app.js';

describe('Favorites API', () => {
  it('returns empty array initially', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('adds a favorite', async () => {
    const res = await request(app).post('/api/favorites/1');
    expect(res.status).toBe(201);
    expect(res.body.productId).toBe(1);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.id).toBe(1);
  });

  it('GET returns full product objects', async () => {
    await request(app).post('/api/favorites/1');
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(1);
    expect(res.body[0].name).toBeDefined();
  });

  it('rejects duplicate favorite', async () => {
    await request(app).post('/api/favorites/1');
    const res = await request(app).post('/api/favorites/1');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Product already in favorites');
  });

  it('removes a favorite', async () => {
    await request(app).post('/api/favorites/1');
    const res = await request(app).delete('/api/favorites/1');
    expect(res.status).toBe(200);
    expect(res.body.productId).toBe(1);

    const get = await request(app).get('/api/favorites');
    expect(get.body).toEqual([]);
  });

  it('rejects removing non-favorited product', async () => {
    const res = await request(app).delete('/api/favorites/1');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Product not in favorites');
  });

  it('favorites persist independently of cart clear', async () => {
    await request(app).post('/api/favorites/1');
    await request(app)
      .post('/api/cart/items')
      .send({ productId: 1, quantity: 1 });
    await request(app).delete('/api/cart/items/1');

    const res = await request(app).get('/api/favorites');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(1);
  });
});

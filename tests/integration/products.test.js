import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/app.js';

describe('GET /api/products', () => {
  it('returns all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Fruits');
    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.category === 'Fruits')).toBe(true);
  });

  it('filters by search term', async () => {
    const res = await request(app).get('/api/products?search=banana');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Bananas');
  });
});

describe('GET /api/products/categories', () => {
  it('returns category list', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.status).toBe(200);
    expect(res.body).toContain('Fruits');
    expect(res.body).toContain('Dairy');
  });
});

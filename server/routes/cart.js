import { Router } from 'express';
import * as cartService from '../services/cart.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(cartService.getCart());
});

router.post('/items', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = cartService.addItem(productId, quantity ?? 1);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/items/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;
    const cart = cartService.updateItem(productId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/items/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const cart = cartService.removeItem(productId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/discount', (req, res) => {
  try {
    const { code } = req.body;
    const cart = cartService.applyDiscount(code);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/discount', (req, res) => {
  const cart = cartService.removeDiscount();
  res.json(cart);
});

export default router;

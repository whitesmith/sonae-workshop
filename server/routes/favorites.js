import { Router } from 'express';
import * as favoritesService from '../services/favorites.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(favoritesService.getFavoriteProducts());
});

router.post('/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const result = favoritesService.addFavorite(productId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const result = favoritesService.removeFavorite(productId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

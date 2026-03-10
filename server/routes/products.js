import { Router } from 'express';
import { getAllProducts, getCategories } from '../services/products.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search } = req.query;
  const products = getAllProducts({ category, search });
  res.json(products);
});

router.get('/categories', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

export default router;

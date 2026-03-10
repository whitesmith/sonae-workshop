import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total: 0,
    discount: null,
    discountAmount: 0,
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    const data = await api.getCart();
    setCart(data);
  }, []);

  useEffect(() => {
    async function init() {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      await fetchCart();
      setLoading(false);
    }
    init();
  }, [fetchCart]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.getProducts(params).then(setProducts);
  }, [search, category]);

  const addToCart = async (productId) => {
    const data = await api.addToCart(productId);
    setCart(data);
  };

  const updateQuantity = async (productId, quantity) => {
    const data = await api.updateCartItem(productId, quantity);
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const data = await api.removeFromCart(productId);
    setCart(data);
  };

  const applyDiscount = async (code) => {
    const data = await api.applyDiscount(code);
    setCart(data);
  };

  const removeDiscount = async () => {
    const data = await api.removeDiscount();
    setCart(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            SONAE Shopping List
          </h1>
          <span className="text-sm text-gray-500">
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-4 space-y-3">
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter
                categories={categories}
                selected={category}
                onChange={setCategory}
              />
            </div>
            <ProductGrid products={products} onAddToCart={addToCart} />
          </div>

          <div className="w-96 flex-shrink-0">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onApplyDiscount={applyDiscount}
              onRemoveDiscount={removeDiscount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

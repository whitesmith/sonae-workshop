import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  onAddToCart,
  favorites,
  onToggleFavorite,
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No products found.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => onAddToCart(product.id)}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
        />
      ))}
    </div>
  );
}

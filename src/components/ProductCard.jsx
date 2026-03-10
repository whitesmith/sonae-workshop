export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow">
      <span className="text-5xl mb-3">{product.emoji}</span>
      <h3 className="font-medium text-gray-900">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-3">{product.category}</p>
      <p className="text-lg font-bold text-gray-900 mb-3">
        &euro;{product.price.toFixed(2)}
      </p>
      <button
        onClick={onAdd}
        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

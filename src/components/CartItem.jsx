export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{item.product.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {item.product.name}
        </p>
        <p className="text-sm text-gray-500">
          &euro;{item.product.price.toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center text-sm"
        >
          -
        </button>
        <span className="w-6 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
        >
          +
        </button>
      </div>
      <p className="w-16 text-right font-medium">
        &euro;{item.lineTotal.toFixed(2)}
      </p>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        &times;
      </button>
    </div>
  );
}

import CartItem from './CartItem';
import DiscountInput from './DiscountInput';

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemove,
  onApplyDiscount,
  onRemoveDiscount,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={(qty) =>
                  onUpdateQuantity(item.productId, qty)
                }
                onRemove={() => onRemove(item.productId)}
              />
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>&euro;{cart.subtotal.toFixed(2)}</span>
            </div>

            <DiscountInput
              discount={cart.discount}
              discountAmount={cart.discountAmount}
              onApply={onApplyDiscount}
              onRemove={onRemoveDiscount}
            />

            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>&euro;{cart.total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';

export default function DiscountInput({
  discount,
  discountAmount,
  onApply,
  onRemove,
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = async () => {
    try {
      setError('');
      await onApply(code);
      setCode('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (discount) {
    return (
      <div className="flex justify-between items-center text-green-600">
        <div className="flex items-center gap-2">
          <span>{discount.label}</span>
          <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
            {discount.code}
          </span>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 text-sm"
          >
            &times;
          </button>
        </div>
        <span>-&euro;{discountAmount.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleApply}
          disabled={!code}
          className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

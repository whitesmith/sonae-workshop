export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          !selected
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

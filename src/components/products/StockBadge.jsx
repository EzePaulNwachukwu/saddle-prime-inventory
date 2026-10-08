export default function StockBadge({ quantity }) {
  const isLow = quantity < 10;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {quantity} {isLow ? '· Low' : '· OK'}
    </span>
  );
}

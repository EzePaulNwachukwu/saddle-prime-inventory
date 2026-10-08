import { formatCurrency } from '../../utils/formatCurrency';

export default function SalesTable({ sales }) {
  if (sales.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">No sales found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Unit Price</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Sold By</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sales.map((sale, i) => (
            <tr key={sale._id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
              <td className="px-4 py-3 font-medium text-slate-800">{sale.productName}</td>
              <td className="px-4 py-3 text-slate-600">{sale.quantitySold}</td>
              <td className="px-4 py-3 text-slate-600">{formatCurrency(sale.unitPrice)}</td>
              <td className="px-4 py-3 font-medium text-slate-800">
                {formatCurrency(sale.totalAmount)}
              </td>
              <td className="px-4 py-3 text-slate-500">{sale.soldBy?.username}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(sale.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

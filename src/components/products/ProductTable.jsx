import { formatCurrency } from '../../utils/formatCurrency';
import useAuth from '../../hooks/useAuth';
import StockBadge from './StockBadge';

export default function ProductTable({ products, onEdit, onDelete, onSell, readOnly = false }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (products.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Supplier</th>
            {!readOnly && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product, i) => (
            <tr key={product._id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
              <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
              <td className="px-4 py-3 text-slate-500">{product.category}</td>
              <td className="px-4 py-3">
                <StockBadge quantity={product.quantity} />
              </td>
              <td className="px-4 py-3 text-slate-600">{formatCurrency(product.price)}</td>
              <td className="px-4 py-3 text-slate-500">{product.supplier}</td>
              {!readOnly && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {onSell && (
                      <button
                        onClick={() => onSell(product)}
                        disabled={product.quantity === 0}
                        className="rounded-lg border border-primary-200 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Sell
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

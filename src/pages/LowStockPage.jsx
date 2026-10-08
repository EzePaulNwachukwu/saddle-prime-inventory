import { useEffect, useState } from 'react';
import * as productApi from '../api/productApi';
import ProductTable from '../components/products/ProductTable';
import Pagination from '../components/shared/Pagination';
import usePagination from '../hooks/usePagination';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function LowStockPage() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productApi.getLowStock();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // The low-stock report isn't paginated server-side (it's expected to stay short),
  // so pagination is applied client-side over the full result.
  const totalPages = Math.max(Math.ceil(products.length / limit), 1);
  const pageProducts = products.slice((page - 1) * limit, page * limit);
  const pagination = { page, limit, totalCount: products.length, totalPages };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Low Stock Report</h2>
        <p className="text-sm text-slate-500">
          Products with quantity below 10 — reorder these soon.
        </p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading report..." />
      ) : (
        <>
          <ProductTable products={pageProducts} readOnly />
          <Pagination pagination={pagination} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import * as productApi from '../api/productApi';
import ProductTable from '../components/products/ProductTable';
import ProductFilters from '../components/products/ProductFilters';
import ProductFormModal from '../components/products/ProductFormModal';
import SellProductModal from '../components/products/SellProductModal';
import Pagination from '../components/shared/Pagination';
import usePagination from '../hooks/usePagination';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { getErrorMessage } from '../utils/getErrorMessage';
import { toProductFilterParams, emptyProductFilters } from '../utils/productFilterParams';

export default function ProductsPage() {
  const { page, limit, setPage, nextPage, prevPage, reset } = usePagination();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(emptyProductFilters);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sellingProduct, setSellingProduct] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productApi.getAll({ page, limit, ...toProductFilterParams(filters) });
      setProducts(res.data);
      setPagination(res.pagination);
      setCategories((prev) => Array.from(new Set([...prev, ...res.data.map((p) => p.category)])).sort());
      setSuppliers((prev) => Array.from(new Set([...prev, ...res.data.map((p) => p.supplier)])).sort());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  const handleFiltersChange = (next) => {
    setFilters(next);
    reset();
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingProduct) {
      await productApi.update(editingProduct._id, formData);
    } else {
      await productApi.create(formData);
    }
    setModalOpen(false);
    if (!editingProduct && page !== 1) {
      setPage(1);
    } else {
      await loadProducts();
    }
  };

  const handleSold = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setSellingProduct(null);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await productApi.remove(product._id);
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadProducts();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500">Manage your store's inventory.</p>
        </div>
        <button
          onClick={handleAdd}
          className="whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add Product
        </button>
      </div>

      <ProductFilters
        filters={filters}
        onChange={handleFiltersChange}
        categories={categories}
        suppliers={suppliers}
      />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading products..." />
      ) : (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSell={setSellingProduct}
          />
          <Pagination pagination={pagination} onPrev={prevPage} onNext={nextPage} />
        </>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {sellingProduct && (
        <SellProductModal
          product={sellingProduct}
          onClose={() => setSellingProduct(null)}
          onSold={handleSold}
        />
      )}
    </div>
  );
}

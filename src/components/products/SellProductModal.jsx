import { useState } from 'react';
import Modal from '../common/Modal';
import ErrorBanner from '../common/ErrorBanner';
import { getErrorMessage } from '../../utils/getErrorMessage';
import * as saleApi from '../../api/saleApi';

export default function SellProductModal({ product, onClose, onSold }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await saleApi.record(product._id, Number(quantity));
      onSold({ ...product, quantity: product.quantity - Number(quantity) });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={`Sell "${product.name}"`} onClose={onClose}>
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <p className="mb-4 text-sm text-slate-500">
        Currently in stock: <span className="font-medium text-slate-700">{product.quantity}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Quantity sold
          </label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-60"
          >
            {saving ? 'Recording...' : 'Record Sale'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

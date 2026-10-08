import { useState } from 'react';
import Modal from '../common/Modal';
import ErrorBanner from '../common/ErrorBanner';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function UserFormModal({ user, onClose, onSave }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({
    username: user?.username || '',
    password: '',
    role: user?.role || 'staff',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await onSave({ role: form.role });
      } else {
        await onSave({ username: form.username, password: form.password, role: form.role });
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit User Role' : 'Add User'} onClose={onClose}>
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </>
        )}
        {isEdit && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Username</label>
            <input
              value={user.username}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

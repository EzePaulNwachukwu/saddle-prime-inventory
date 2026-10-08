import { useEffect, useState } from 'react';
import * as userApi from '../api/userApi';
import * as authApi from '../api/authApi';
import useAuth from '../hooks/useAuth';
import UserTable from '../components/users/UserTable';
import UserFormModal from '../components/users/UserFormModal';
import Pagination from '../components/shared/Pagination';
import usePagination from '../hooks/usePagination';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { page, limit, setPage, nextPage, prevPage } = usePagination();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.getAll({ page, limit });
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingUser) {
      await userApi.update(editingUser._id, formData);
      setModalOpen(false);
      await loadUsers();
    } else {
      await authApi.register(formData.username, formData.password, formData.role);
      setModalOpen(false);
      if (page !== 1) {
        setPage(1);
      } else {
        await loadUsers();
      }
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    setError('');
    try {
      await userApi.remove(user._id);
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadUsers();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Users</h2>
          <p className="text-sm text-slate-500">Manage staff and admin accounts.</p>
        </div>
        <button
          onClick={handleAdd}
          className="whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add User
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading users..." />
      ) : (
        <>
          <UserTable
            users={users}
            currentUserId={currentUser?._id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination pagination={pagination} onPrev={prevPage} onNext={nextPage} />
        </>
      )}

      {modalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

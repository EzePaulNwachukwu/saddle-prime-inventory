import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkActive = 'bg-primary-50 text-primary-700';
const linkInactive = 'text-slate-500 hover:bg-slate-50 hover:text-slate-700';

export default function Sidebar() {
  const { user } = useAuth();

  const navClass = ({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`;

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-bold text-white">
          S
        </div>
        <span className="font-semibold text-slate-800">Saddle Prime</span>
      </div>

      <NavLink to="/dashboard" className={navClass}>
        Dashboard
      </NavLink>
      <NavLink to="/products" className={navClass}>
        Products
      </NavLink>
      <NavLink to="/products/low-stock" className={navClass}>
        Low Stock
      </NavLink>
      {user?.role === 'admin' && (
        <>
          <NavLink to="/sales" className={navClass}>
            Sales
          </NavLink>
          <NavLink to="/activity-log" className={navClass}>
            Activity Log
          </NavLink>
          <NavLink to="/users" className={navClass}>
            Users
          </NavLink>
        </>
      )}
    </aside>
  );
}

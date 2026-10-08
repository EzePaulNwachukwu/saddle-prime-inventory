import { useEffect, useState } from 'react';
import * as productApi from '../api/productApi';
import * as userApi from '../api/userApi';
import * as saleApi from '../api/saleApi';
import useAuth from '../hooks/useAuth';
import DateRangeFilter from '../components/shared/DateRangeFilter';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { getErrorMessage } from '../utils/getErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';
import { toDateRangeParams } from '../utils/dateRangeParams';

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent || 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

const isSameDay = (a, b) => a.toDateString() === b.toDateString();
const shortDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// Derives a human label ("Today" / "Sep 1, 2026" / "Sep 1 – Sep 3, 2026") from the
// summary response's own startDate/endDate, rather than from local filter state.
function formatSummaryLabel(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return isSameDay(start, new Date())
      ? 'Today'
      : start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return `${shortDate(start)} – ${shortDate(end)}, ${end.getFullYear()}`;
}

function SalesSummaryCard() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await saleApi.getSummary(toDateRangeParams(from, to));
        if (!cancelled) setSummary(data);
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
  }, [from, to]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-3">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Sales</p>
          <p className="text-lg font-semibold text-slate-800">
            {summary ? formatSummaryLabel(summary.startDate, summary.endDate) : '—'}
          </p>
        </div>
        <DateRangeFilter
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onToday={() => {
            setFrom('');
            setTo('');
          }}
          onClear={() => {
            setFrom('');
            setTo('');
          }}
        />
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading sales summary..." />
      ) : (
        summary && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="mt-1 text-2xl font-semibold text-primary-600">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Sales Count</p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">
                {summary.totalSalesCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Units Sold</p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">
                {summary.totalUnitsSold}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [lowStock, inventoryValue, users] = await Promise.all([
          productApi.getLowStock(),
          productApi.getInventoryValue(),
          isAdmin ? userApi.getAll({ page: 1, limit: 1 }) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setStats({
          totalProducts: inventoryValue.totalProductTypes,
          lowStockCount: lowStock.length,
          totalValue: inventoryValue.totalValue,
          totalUsers: users?.pagination.totalCount ?? null,
        });
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
  }, [isAdmin]);

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold text-slate-800">
        Welcome back, {user?.username}
      </h2>
      <p className="mb-6 text-sm text-slate-500">Here's what's happening in your store today.</p>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading dashboard..." />
      ) : (
        stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard label="Total Products" value={stats.totalProducts} />
            <SummaryCard
              label="Low Stock Items"
              value={stats.lowStockCount}
              accent="text-red-600"
            />
            <SummaryCard
              label="Total Inventory Value"
              value={formatCurrency(stats.totalValue)}
            />
            {isAdmin && (
              <>
                <SalesSummaryCard />
                <SummaryCard label="Total Users" value={stats.totalUsers} />
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}

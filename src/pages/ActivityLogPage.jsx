import { useEffect, useState } from 'react';
import * as activityLogApi from '../api/activityLogApi';
import ActivityLogTable from '../components/activity/ActivityLogTable';
import DateRangeFilter from '../components/shared/DateRangeFilter';
import Pagination from '../components/shared/Pagination';
import usePagination from '../hooks/usePagination';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { getErrorMessage } from '../utils/getErrorMessage';
import { toDateRangeParams } from '../utils/dateRangeParams';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function ActivityLogPage() {
  const { page, limit, nextPage, prevPage, reset } = usePagination();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await activityLogApi.getAll({ page, limit, ...toDateRangeParams(from, to) });
        if (!cancelled) {
          setLogs(res.data);
          setPagination(res.pagination);
        }
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
  }, [page, limit, from, to]);

  const handleFromChange = (value) => {
    setFrom(value);
    reset();
  };

  const handleToChange = (value) => {
    setTo(value);
    reset();
  };

  const handleToday = () => {
    const today = todayStr();
    setFrom(today);
    setTo(today);
    reset();
  };

  const handleClear = () => {
    setFrom('');
    setTo('');
    reset();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Activity Log</h2>
          <p className="text-sm text-slate-500">Everything going on in the store.</p>
        </div>
        <DateRangeFilter
          from={from}
          to={to}
          onFromChange={handleFromChange}
          onToChange={handleToChange}
          onToday={handleToday}
          onClear={handleClear}
        />
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading ? (
        <Spinner label="Loading activity..." />
      ) : (
        <>
          <ActivityLogTable logs={logs} />
          <Pagination pagination={pagination} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  );
}

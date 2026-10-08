const actionLabels = {
  CREATE_PRODUCT: 'Product Added',
  UPDATE_PRODUCT: 'Product Updated',
  DELETE_PRODUCT: 'Product Deleted',
  REGISTER_USER: 'User Added',
  UPDATE_USER: 'User Updated',
  DELETE_USER: 'User Deleted',
  RECORD_SALE: 'Sale',
};

export default function ActivityLogTable({ logs }) {
  if (logs.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">No activity found.</p>;
  }

  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
      {logs.map((log) => (
        <div key={log._id} className="flex items-start justify-between gap-4 px-4 py-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                {actionLabels[log.action] || log.action}
              </span>
              <span className="text-sm font-medium text-slate-700">{log.user?.username}</span>
            </div>
            <p className="text-sm text-slate-600">{log.description}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
            {new Date(log.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

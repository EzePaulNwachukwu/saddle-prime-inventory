// Turns yyyy-mm-dd "from"/"to" strings into a createdAt range param that covers
// the full day, so "to" doesn't get truncated to midnight and exclude that day's records.
export const toDateRangeParams = (from, to) => {
  const createdAt = {};
  if (from) createdAt.gte = `${from}T00:00:00.000Z`;
  if (to) createdAt.lte = `${to}T23:59:59.999Z`;
  return Object.keys(createdAt).length ? { createdAt } : {};
};

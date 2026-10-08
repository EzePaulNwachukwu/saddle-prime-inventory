// Turns the ProductFilters form state into query params, omitting anything left blank
// so cleared filters remove that param entirely rather than sending an empty string.
export const toProductFilterParams = (filters) => {
  const params = {};

  if (filters.name) params.name = { regex: filters.name };
  if (filters.category) params.category = filters.category;
  if (filters.supplier) params.supplier = filters.supplier;

  const price = {};
  if (filters.priceMin) price.gte = filters.priceMin;
  if (filters.priceMax) price.lte = filters.priceMax;
  if (Object.keys(price).length) params.price = price;

  const quantity = {};
  if (filters.quantityMin) quantity.gte = filters.quantityMin;
  if (filters.quantityMax) quantity.lte = filters.quantityMax;
  if (Object.keys(quantity).length) params.quantity = quantity;

  return params;
};

export const emptyProductFilters = {
  name: '',
  category: '',
  supplier: '',
  priceMin: '',
  priceMax: '',
  quantityMin: '',
  quantityMax: '',
};

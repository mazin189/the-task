import api from './api';

export const createInvoice = async (items) => {
  const { data } = await api.post('/invoices', { items });
  return data.data;
};

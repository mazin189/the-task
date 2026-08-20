import api from './api';

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data.data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (product) => {
  const { data } = await api.post('/products', product);
  return data.data;
};

export const updateProduct = async (id, product) => {
  const { data } = await api.patch(`/products/${id}`, product);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};

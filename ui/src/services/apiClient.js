import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const API_BASE_URL = `${backendUrl}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Productos
export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

// Órdenes
export const getOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await apiClient.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};

export default apiClient;


import apiClientAxios from './client';


export const createOrder = async (orderData: Order) => {
  const response = await apiClientAxios.post('/orders', orderData);
  return response.data.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await apiClientAxios.get(`/orders/${orderId}`);
  return response.data.data;
};

export const getAllOrders = async () => {
  const response = await apiClientAxios.get('/orders');
  return response.data.data;
};
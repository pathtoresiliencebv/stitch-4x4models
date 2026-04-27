import { fetchAPI } from './api-config';
import type { Order, CreateOrderData } from '@/types/order';

export const orderService = {
  async create(data: CreateOrderData): Promise<Order> {
    return fetchAPI<Order>('/entities/Order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async get(id: string): Promise<Order> {
    return fetchAPI<Order>(`/entities/Order/${id}`);
  },

  async list(limit = 50): Promise<Order[]> {
    const { records } = await fetchAPI<{ records: Order[] }>(`/entities/Order?limit=${limit}&sort_by=-created_date`);
    return records;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    const { records } = await fetchAPI<{ records: Order[] }>(
      `/entities/Order?q=${JSON.stringify({ order_number: orderNumber })}`
    );
    return records[0] || null;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    return fetchAPI<Order>(`/entities/Order/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async updatePaymentStatus(id: string, paymentStatus: Order['payment_status']): Promise<Order> {
    return fetchAPI<Order>(`/entities/Order/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  },
};
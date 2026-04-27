import type { CartItem } from './cart';

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  featured_image_url?: string;
  sku?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_date: string;
  updated_date: string;
  created_by?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method?: string;
}

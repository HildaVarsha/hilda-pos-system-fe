import type { MenuItem } from './menu.types';
import type { RestaurantTable } from './table.types';

export type OrderStatus =
  'PENDING' | 'ACCEPTED' | 'COOKING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI';

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  menuItemId: string;
  menuItem: MenuItem;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amountPaid: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  notes: string | null;
  subtotal: string;
  taxAmount: string;
  grandTotal: string;
  tableId: string;
  table: RestaurantTable;
  createdById: string;
  createdBy: { id: string; name: string; email: string };
  items: OrderItem[];
  payment: Payment | null;
  acceptedAt: string | null;
  cookingAt: string | null;
  readyAt: string | null;
  servedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderInput {
  tableId: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export type KitchenAction = 'ACCEPT' | 'COOKING' | 'READY';

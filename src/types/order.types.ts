import type { MenuItem } from './menu.types';
import type { RestaurantTable } from './table.types';

export type OrderStatus =
  'PENDING' | 'ACCEPTED' | 'COOKING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export type OrderType = 'DINE_IN' | 'PARCEL';

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
  orderType: OrderType;
  customerName: string | null;
  notes: string | null;
  subtotal: string;
  taxAmount: string;
  grandTotal: string;
  /** Null for PARCEL orders — they never occupy a table. */
  tableId: string | null;
  table: RestaurantTable | null;
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
  orderType: OrderType;
  /** Required for DINE_IN, omitted for PARCEL. */
  tableId?: string;
  /** Required for PARCEL, optional for DINE_IN. */
  customerName?: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export type KitchenAction = 'ACCEPT' | 'COOKING' | 'READY';

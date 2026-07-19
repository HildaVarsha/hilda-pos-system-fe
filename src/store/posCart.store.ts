import { create } from 'zustand';
import type { MenuItem } from '@/types/menu.types';
import type { OrderType } from '@/types/order.types';

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface PosCartState {
  orderType: OrderType;
  selectedTableId: string | null;
  customerName: string;
  lines: CartLine[];
  orderNotes: string;
  setOrderType: (orderType: OrderType) => void;
  selectTable: (tableId: string | null) => void;
  setCustomerName: (name: string) => void;
  addItem: (menuItem: MenuItem) => void;
  incrementQuantity: (menuItemId: string) => void;
  decrementQuantity: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  setLineNotes: (menuItemId: string, notes: string) => void;
  setOrderNotes: (notes: string) => void;
  clearCart: () => void;
}

export const usePosCartStore = create<PosCartState>((set) => ({
  orderType: 'DINE_IN',
  selectedTableId: null,
  customerName: '',
  lines: [],
  orderNotes: '',

  // Switching modes resets the table/customer selection so a stale
  // dine-in table can't leak into a parcel order (or vice versa) —
  // the cart items themselves are kept, since the receptionist is
  // usually just correcting which mode they meant to pick.
  setOrderType: (orderType) => set({ orderType, selectedTableId: null }),

  selectTable: (tableId) => set({ selectedTableId: tableId }),

  setCustomerName: (name) => set({ customerName: name }),

  addItem: (menuItem) =>
    set((state) => {
      const existing = state.lines.find((line) => line.menuItem.id === menuItem.id);
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line.menuItem.id === menuItem.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        };
      }
      return { lines: [...state.lines, { menuItem, quantity: 1, notes: '' }] };
    }),

  incrementQuantity: (menuItemId) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.menuItem.id === menuItemId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    })),

  decrementQuantity: (menuItemId) =>
    set((state) => ({
      lines: state.lines
        .map((line) =>
          line.menuItem.id === menuItemId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    })),

  removeItem: (menuItemId) =>
    set((state) => ({ lines: state.lines.filter((line) => line.menuItem.id !== menuItemId) })),

  setLineNotes: (menuItemId, notes) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.menuItem.id === menuItemId ? { ...line, notes } : line,
      ),
    })),

  setOrderNotes: (notes) => set({ orderNotes: notes }),

  clearCart: () => set({ lines: [], orderNotes: '', selectedTableId: null, customerName: '' }),
}));

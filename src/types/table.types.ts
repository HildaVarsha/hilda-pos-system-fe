export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableInput {
  number: number;
  capacity: number;
}

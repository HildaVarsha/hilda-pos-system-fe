export interface DashboardSummary {
  ordersToday: {
    total: number;
    pending: number;
    cooking: number;
    ready: number;
    completed: number;
  };
  revenueToday: number;
  tables: {
    available: number;
    occupied: number;
    reserved: number;
  };
}

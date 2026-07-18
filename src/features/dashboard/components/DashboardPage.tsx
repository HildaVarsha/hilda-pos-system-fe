import {
  ClipboardList,
  Clock,
  Flame,
  CheckCircle2,
  IndianRupee,
  Table2,
  DoorOpen,
  DoorClosed,
} from 'lucide-react';
import { CardSkeleton, ErrorState } from '@components/ui';
import { useDashboardSummary } from '../hooks/useDashboardSummary';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof ClipboardList;
  tone: 'neutral' | 'warning' | 'orange' | 'success' | 'info' | 'danger';
}

const TONE_CLASSES: Record<StatCardProps['tone'], string> = {
  neutral: 'bg-surface-hover text-foreground/70',
  warning: 'bg-amber-500/10 text-amber-500',
  orange: 'bg-orange-500/10 text-orange-500',
  success: 'bg-green-500/10 text-green-500',
  info: 'bg-blue-500/10 text-blue-500',
  danger: 'bg-red-500/10 text-red-500',
};

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-foreground/60">{label}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground/60">Today's activity at a glance</p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-foreground/70">Today's Orders</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Total"
            value={data.ordersToday.total}
            icon={ClipboardList}
            tone="neutral"
          />
          <StatCard label="Pending" value={data.ordersToday.pending} icon={Clock} tone="warning" />
          <StatCard label="Cooking" value={data.ordersToday.cooking} icon={Flame} tone="orange" />
          <StatCard
            label="Ready"
            value={data.ordersToday.ready}
            icon={CheckCircle2}
            tone="success"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-foreground/70">Revenue &amp; Tables</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Revenue Today"
            value={`₹${data.revenueToday.toLocaleString('en-IN')}`}
            icon={IndianRupee}
            tone="success"
          />
          <StatCard
            label="Completed Orders"
            value={data.ordersToday.completed}
            icon={CheckCircle2}
            tone="info"
          />
          <StatCard
            label="Occupied Tables"
            value={data.tables.occupied}
            icon={DoorClosed}
            tone="danger"
          />
          <StatCard
            label="Available Tables"
            value={data.tables.available}
            icon={DoorOpen}
            tone="success"
          />
        </div>
      </section>

      {data.tables.reserved > 0 && (
        <StatCard
          label="Reserved Tables"
          value={data.tables.reserved}
          icon={Table2}
          tone="neutral"
        />
      )}
    </div>
  );
}

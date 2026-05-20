import { card, mutedText } from '@/lib/ui-classes';

type MetricCardProps = {
  label: string;
  value: string | number;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div
      className={`${card} transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-indigo-500/5`}
    >
      <div className={`${mutedText} uppercase tracking-wide`}>{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900 transition-colors dark:text-white">
        {value}
      </div>
    </div>
  );
}

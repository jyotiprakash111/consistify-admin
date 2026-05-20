import { pre } from '@/lib/ui-classes';

type JsonPanelProps = {
  data: unknown;
  title?: string;
  maxHeight?: string;
};

export function JsonPanel({ data, title, maxHeight = 'max-h-96' }: JsonPanelProps) {
  return (
    <div>
      {title ? <h4 className="mb-2 text-sm font-semibold text-slate-700">{title}</h4> : null}
      <pre className={`${pre} ${maxHeight}`}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

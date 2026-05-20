import { btn, filterRow } from '@/lib/ui-classes';

type FilterBarProps = {
  children: React.ReactNode;
  onApply?: () => void;
  applyLabel?: string;
};

export function FilterBar({ children, onApply, applyLabel = 'Apply' }: FilterBarProps) {
  return (
    <div className={filterRow}>
      {children}
      {onApply ? (
        <button type="button" onClick={onApply} className={btn}>
          {applyLabel}
        </button>
      ) : null}
    </div>
  );
}

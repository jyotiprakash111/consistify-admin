import { btn, filterRow } from '@/lib/ui-classes';

type FilterBarProps = {
  children: React.ReactNode;
  onApply?: () => void;
  onReset?: () => void;
  applyLabel?: string;
  resetLabel?: string;
};

export function FilterBar({
  children,
  onApply,
  onReset,
  applyLabel = 'Apply',
  resetLabel = 'Reset',
}: FilterBarProps) {
  return (
    <div className={filterRow}>
      {children}
      {onApply ? (
        <button type="button" onClick={onApply} className={btn}>
          {applyLabel}
        </button>
      ) : null}
      {onReset ? (
        <button type="button" onClick={onReset} className={btn}>
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}

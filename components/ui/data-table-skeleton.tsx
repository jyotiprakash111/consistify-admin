type DataTableSkeletonProps = {
  columns?: number;
  rows?: number;
};

export function DataTableSkeleton({ columns = 9, rows = 8 }: DataTableSkeletonProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm dark:border-zinc-800">
      <div className="min-w-full animate-pulse">
        <div className="flex gap-4 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/80">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="h-3 flex-1 rounded-md bg-slate-200 dark:bg-zinc-700"
              style={{ minWidth: i === 0 ? '6rem' : '4rem' }}
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={`r-${row}`}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0 dark:border-zinc-800/80"
          >
            <div className="size-9 shrink-0 rounded-full bg-slate-200 dark:bg-zinc-700" />
            {Array.from({ length: columns - 1 }).map((_, col) => (
              <div
                key={`c-${row}-${col}`}
                className="h-4 flex-1 rounded-md bg-slate-200 dark:bg-zinc-700"
                style={{ maxWidth: col % 3 === 0 ? '8rem' : '5rem' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';
import { input, inputEmbedded, labelRow, select, selectEmbedded, textarea } from '@/lib/ui-classes';

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  icon?: LucideIcon;
};

export function FormField({ label, children, icon: Icon }: FormFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
        {Icon ? <Icon className="size-3.5 text-slate-400" strokeWidth={2} /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

function mergeFieldClass(base: string, className?: string) {
  return className ? `${base} ${className}` : base;
}

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** No border/ring — for use inside `inputShell` (combobox, etc.) */
  embedded?: boolean;
};

export function TextInput({ className, embedded, ...props }: TextInputProps) {
  const base = embedded ? inputEmbedded : input;
  return <input className={mergeFieldClass(base, className)} {...props} />;
}

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  embedded?: boolean;
};

export function SelectInput({ className, embedded, ...props }: SelectInputProps) {
  const base = embedded ? selectEmbedded : select;
  return <select className={mergeFieldClass(base, className)} {...props} />;
}

export function TextAreaInput({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={mergeFieldClass(textarea, className)} {...props} />;
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={labelRow}>
      <input
        type="checkbox"
        className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

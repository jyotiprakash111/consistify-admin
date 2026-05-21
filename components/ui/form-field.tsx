import type { LucideIcon } from 'lucide-react';
import { input, labelRow, select, textarea } from '@/lib/ui-classes';

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

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={mergeFieldClass(input, className)} {...props} />;
}

export function SelectInput({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={mergeFieldClass(select, className)} {...props} />;
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

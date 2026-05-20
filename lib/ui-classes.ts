/** Shared Tailwind classes with light/dark theme support */
const t = 'transition-colors duration-200 ease-out';

export const pageTitle = `mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 ${t}`;
export const sectionTitle = `mb-3 mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100 ${t}`;
export const errorText = `text-sm text-red-600 dark:text-red-400 ${t}`;
export const successText = `text-sm text-green-700 dark:text-green-400 ${t}`;
export const mutedText = `text-sm text-slate-500 dark:text-slate-400 ${t}`;
export const card = `rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/90 dark:shadow-none ${t}`;
export const input = `rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${t}`;
export const select = input;
export const textarea = `w-full min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${t}`;
export const btn = `inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${t}`;
export const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${t}`;
export const btnSuccess = `inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 ${t}`;
export const btnDanger = `inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500 ${t}`;
export const pre = `overflow-auto rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 ${t}`;
export const filterRow = 'mb-4 flex flex-wrap items-center gap-2';
export const formGrid = 'grid max-w-lg gap-3';
export const gridCards = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
export const listGrid = 'grid gap-4';
export const labelRow = `flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 ${t}`;
export const shellAside = `flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 ${t}`;
export const shellMain = 'flex-1 overflow-y-auto scroll-smooth p-6 md:p-8';
export const navLinkActive =
  'flex items-center gap-3 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm dark:bg-indigo-500 dark:text-white';
export const navLinkInactive = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 ${t}`;
export const loginCard = `rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-2xl dark:shadow-black/20 ${t}`;
export const linkAccent = `font-medium text-indigo-600 underline-offset-2 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 ${t}`;

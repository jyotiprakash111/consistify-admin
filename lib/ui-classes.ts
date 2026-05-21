/** Shared Tailwind classes with light/dark theme support */
const t = 'transition-colors duration-200 ease-out';

export const pageTitle = `mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 ${t}`;
export const sectionTitle = `mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ${t}`;
export const errorText = `text-sm text-red-600 dark:text-red-400 ${t}`;
export const successText = `text-sm text-green-700 dark:text-green-400 ${t}`;
export const mutedText = `text-sm text-slate-500 dark:text-zinc-400 ${t}`;
export const card =
  `rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:shadow-none dark:shadow-black/10 ${t}`;
export const input = `rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${t}`;
export const select = input;
export const textarea = `w-full min-h-32 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${t}`;
export const btn = `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${t}`;
export const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400 ${t}`;
export const btnOutlinePrimary = `inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-white px-3 py-2.5 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-500 dark:bg-zinc-900 dark:text-indigo-400 dark:hover:bg-indigo-500/10 ${t}`;
export const btnSuccess = `inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 ${t}`;
export const btnDanger = `inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500 ${t}`;
export const pre = `overflow-auto rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-200 ${t}`;
export const filterRow = 'mb-4 flex flex-wrap items-center gap-2';
export const formGrid = 'grid max-w-lg gap-3';
export const gridCards = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4';
export const listGrid = 'grid gap-4';
export const labelRow = `flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 ${t}`;
export const shellAside =
  `flex w-[17.5rem] shrink-0 flex-col border-r border-slate-200/60 bg-white/70 p-5 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80 ${t}`;
export const shellMain = 'flex-1 overflow-y-auto scroll-smooth p-6 md:p-10 lg:p-12';
export const navLinkActive =
  'flex items-center gap-3 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500 dark:shadow-indigo-500/25';
export const navLinkInactive = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100 ${t}`;
export const loginCard = `rounded-2xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-2xl dark:shadow-black/30 ${t}`;
export const linkAccent = `font-medium text-indigo-600 underline-offset-2 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 ${t}`;
export const panel = `overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm shadow-slate-200/30 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${t}`;
export const panelInset = `rounded-xl border border-slate-200/70 bg-slate-50/60 dark:border-zinc-800 dark:bg-zinc-950/40 ${t}`;

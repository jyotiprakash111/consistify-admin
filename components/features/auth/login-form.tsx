'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Shield } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FormField, TextInput } from '@/components/ui/form-field';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  loginAdmin,
  selectAuth,
  selectAuthLoading,
  setLoginEmail,
  setLoginPassword,
} from '@/lib/store/slices/auth/authSlice';
import { btnPrimary, loginCard, mutedText, pageTitle } from '@/lib/ui-classes';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { email, password, error } = useAppSelector(selectAuth);
  const loading = useAppSelector(selectAuthLoading);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className={loginCard}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-indigo-500">
            <Shield className="size-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className={pageTitle.replace('mb-6', 'mb-0')}>Admin Login</h1>
            <p className={mutedText}>Sign in to the console</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FormField label="Email" icon={Mail}>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => dispatch(setLoginEmail(e.target.value))}
              required
              placeholder="admin@example.com"
            />
          </FormField>
          <FormField label="Password">
            <TextInput
              type="password"
              value={password}
              onChange={(e) => dispatch(setLoginPassword(e.target.value))}
              required
              placeholder="••••••••"
            />
          </FormField>
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            <LogIn className="size-4" strokeWidth={2} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <AlertMessage error={error} />
        </form>
      </div>
    </main>
  );
}

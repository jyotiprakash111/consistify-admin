import { Suspense } from 'react';
import { LoginForm } from '@/components/features/auth/login-form';
import { LoadingState } from '@/components/ui/loading-state';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading…" />}>
      <LoginForm />
    </Suspense>
  );
}

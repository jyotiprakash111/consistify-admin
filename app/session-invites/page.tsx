import { Suspense } from 'react';
import { SessionInvitesView } from '@/components/features/session-invites/session-invites-view';
import { LoadingState } from '@/components/ui/loading-state';

export default function SessionInvitesPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading session invites…" />}>
      <SessionInvitesView />
    </Suspense>
  );
}

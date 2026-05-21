'use client';

import { useState } from 'react';
import { SlidersHorizontal, Wallet, StickyNote, Award, UserCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FormField, TextAreaInput, TextInput } from '@/components/ui/form-field';
import { FeatureOverrideFields } from '@/components/features/users/feature-override-fields';
import type { FeatureOverrides } from '@/lib/types/admin';
import { btn, btnDanger, btnPrimary, card, formGrid, mutedText } from '@/lib/ui-classes';

type UserDetailOpsPanelProps = {
  isDisabled: boolean;
  overrides: FeatureOverrides | null;
  overridesDirty: boolean;
  form: {
    avatar: string;
    note: string;
    walletAmount: string;
    walletReason: string;
    walletCreditAmount: string;
    walletCreditNote: string;
    badgeType: string;
    badgeNote: string;
  };
  actionLoading: string | null;
  onOverridesChange: (next: FeatureOverrides) => void;
  onSaveOverrides: () => void;
  onResetOverrides: () => void;
  onFormChange: (patch: Partial<UserDetailOpsPanelProps['form']>) => void;
  onUpdateAvatar: () => void;
  onAddNote: () => void;
  onWalletAdjust: () => void;
  onWalletCredit: () => void;
  onBadgeCorrection: () => void;
  onToggleDisabled: () => void;
};

function SectionShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={card}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Icon className="size-4" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</h3>
          {description ? <p className={`${mutedText} text-xs`}>{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function UserDetailOpsPanel({
  isDisabled,
  overrides,
  overridesDirty,
  form,
  actionLoading,
  onOverridesChange,
  onSaveOverrides,
  onResetOverrides,
  onFormChange,
  onUpdateAvatar,
  onAddNote,
  onWalletAdjust,
  onWalletCredit,
  onBadgeCorrection,
  onToggleDisabled,
}: UserDetailOpsPanelProps) {
  const [confirmDisable, setConfirmDisable] = useState(false);
  const busy = Boolean(actionLoading);

  return (
    <div className="space-y-6">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Account status
            </h3>
            <p className={`${mutedText} text-xs`}>
              {isDisabled
                ? 'User cannot use the app until re-enabled.'
                : 'User can access the app normally.'}
            </p>
          </div>
          <button
            type="button"
            className={isDisabled ? btnPrimary : btnDanger}
            disabled={busy}
            onClick={() => (isDisabled ? onToggleDisabled() : setConfirmDisable(true))}
          >
            {isDisabled ? 'Enable account' : 'Disable account'}
          </button>
        </div>
      </section>

      {overrides ? (
        <SectionShell
          icon={SlidersHorizontal}
          title="Feature overrides"
          description="Per-user flags (PATCH /users/:id/feature-overrides)"
        >
          <FeatureOverrideFields overrides={overrides} onChange={onOverridesChange} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={btn}
              disabled={!overridesDirty || busy}
              onClick={onResetOverrides}
            >
              Reset
            </button>
            <button
              type="button"
              className={btnPrimary}
              disabled={!overridesDirty || busy}
              onClick={onSaveOverrides}
            >
              Save overrides
            </button>
          </div>
        </SectionShell>
      ) : null}

      <SectionShell icon={UserCircle} title="Avatar" description="PATCH /users/:id">
        <div className={formGrid}>
          <TextInput
            value={form.avatar}
            onChange={(e) => onFormChange({ avatar: e.target.value })}
            placeholder="Avatar id or URL"
          />
          <button type="button" className={`${btnPrimary} w-fit`} disabled={busy} onClick={onUpdateAvatar}>
            Update avatar
          </button>
        </div>
      </SectionShell>

      <SectionShell
        icon={Wallet}
        title="Wallet"
        description="Adjustment via PATCH · Credit via POST /wallet/credit"
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Balance adjustment
            </p>
            <div className={formGrid}>
              <FormField label="Amount (+/-)">
                <TextInput
                  type="number"
                  value={form.walletAmount}
                  onChange={(e) => onFormChange({ walletAmount: e.target.value })}
                />
              </FormField>
              <FormField label="Reason">
                <TextInput
                  value={form.walletReason}
                  onChange={(e) => onFormChange({ walletReason: e.target.value })}
                />
              </FormField>
              <button
                type="button"
                className={`${btnPrimary} w-fit`}
                disabled={busy}
                onClick={onWalletAdjust}
              >
                Apply adjustment
              </button>
            </div>
          </div>
          <div className="border-t border-slate-200/70 pt-4 dark:border-zinc-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manual credit
            </p>
            <div className={formGrid}>
              <FormField label="Credit amount (₹)">
                <TextInput
                  type="number"
                  min={0}
                  value={form.walletCreditAmount}
                  onChange={(e) => onFormChange({ walletCreditAmount: e.target.value })}
                />
              </FormField>
              <FormField label="Note">
                <TextInput
                  value={form.walletCreditNote}
                  onChange={(e) => onFormChange({ walletCreditNote: e.target.value })}
                />
              </FormField>
              <button
                type="button"
                className={`${btnPrimary} w-fit`}
                disabled={busy}
                onClick={onWalletCredit}
              >
                Post credit
              </button>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell icon={StickyNote} title="Admin note" description="PATCH /users/:id">
        <div className={formGrid}>
          <TextAreaInput
            value={form.note}
            onChange={(e) => onFormChange({ note: e.target.value })}
            rows={3}
            placeholder="Internal note for support…"
          />
          <button type="button" className={`${btnPrimary} w-fit`} disabled={busy} onClick={onAddNote}>
            Add note
          </button>
        </div>
      </SectionShell>

      <SectionShell icon={Award} title="Badge correction" description="POST /badges/correction">
        <div className={formGrid}>
          <FormField label="Badge type">
            <TextInput
              value={form.badgeType}
              onChange={(e) => onFormChange({ badgeType: e.target.value })}
            />
          </FormField>
          <FormField label="Note">
            <TextInput
              value={form.badgeNote}
              onChange={(e) => onFormChange({ badgeNote: e.target.value })}
            />
          </FormField>
          <button
            type="button"
            className={`${btnPrimary} w-fit`}
            disabled={busy}
            onClick={onBadgeCorrection}
          >
            Submit correction
          </button>
        </div>
      </SectionShell>

      <ConfirmDialog
        open={confirmDisable}
        title="Disable this account?"
        description="The user will not be able to use the app until you enable the account again."
        confirmLabel="Disable account"
        variant="danger"
        onConfirm={() => {
          setConfirmDisable(false);
          onToggleDisabled();
        }}
        onCancel={() => setConfirmDisable(false)}
      />
    </div>
  );
}

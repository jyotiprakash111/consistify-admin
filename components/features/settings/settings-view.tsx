'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { SettingsConfigSection } from '@/components/features/settings/settings-config-section';
import { SettingsRawJsonPanel } from '@/components/features/settings/settings-raw-json-panel';
import { SettingsSaveBar } from '@/components/features/settings/settings-save-bar';
import { SettingsSkeleton } from '@/components/features/settings/settings-skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import type { ConfigFieldDef, DangerousFieldKind } from '@/lib/settings/config-sections';
import { SYSTEM_CONFIG_SECTIONS } from '@/lib/settings/config-sections';
import { validateSystemConfig } from '@/lib/settings/validate-config';
import {
  fetchSystemConfig,
  patchConfigField,
  resetSettingsDraft,
  saveSystemConfig,
  saveSystemConfigRaw,
  selectSettings,
  selectSettingsDirty,
  setSettingsRawJson,
} from '@/lib/store/slices/settings/settingsSlice';

type PendingDangerous = {
  kind: DangerousFieldKind;
  field: ConfigFieldDef;
  value: string | number | boolean;
};

export function SettingsView() {
  const dispatch = useAppDispatch();
  const { config, rawJson, error, message, status, saving } = useAppSelector(selectSettings);
  const dirty = useAppSelector(selectSettingsDirty);
  const [pendingDangerous, setPendingDangerous] = useState<PendingDangerous | null>(null);

  const loading = status === 'loading' && !config;

  const validationError = useMemo(
    () => (config ? validateSystemConfig(config) : null),
    [config],
  );

  useEffect(() => {
    dispatch(fetchSystemConfig());
  }, [dispatch]);

  const applyField = useCallback(
    (field: ConfigFieldDef, value: string | number | boolean) => {
      dispatch(patchConfigField({ section: field.section, key: field.key, value }));
    },
    [dispatch],
  );

  const handleFieldChange = useCallback(
    (field: ConfigFieldDef, value: string | number | boolean) => {
      if (field.dangerous === 'maintenance' && value === true) {
        setPendingDangerous({ kind: 'maintenance', field, value });
        return;
      }
      if (field.dangerous === 'payment-live' && value === 'live') {
        setPendingDangerous({ kind: 'payment-live', field, value });
        return;
      }
      applyField(field, value);
    },
    [applyField],
  );

  function confirmDangerous() {
    if (!pendingDangerous) return;
    applyField(pendingDangerous.field, pendingDangerous.value);
    setPendingDangerous(null);
  }

  function cancelDangerous() {
    setPendingDangerous(null);
  }

  function handleSaveStructured() {
    if (!config || validationError) return;
    dispatch(saveSystemConfig(config));
  }

  function handleSaveRaw() {
    dispatch(saveSystemConfigRaw(rawJson));
  }

  const dangerousDialog = pendingDangerous
    ? pendingDangerous.kind === 'maintenance'
      ? {
          title: 'Enable maintenance mode?',
          description:
            'Users will not be able to start new focus sessions until maintenance is turned off.',
          confirmLabel: 'Enable maintenance',
        }
      : {
          title: 'Switch payment to live mode?',
          description:
            'Real payments will be processed. Ensure Razorpay live keys and webhooks are configured.',
          confirmLabel: 'Use live mode',
        }
    : null;

  return (
    <AdminShell>
      <PageHeader
        title="System config"
        description="Wallet, sessions, gamification, notifications, and payment"
        apiHint="GET /systemconfig · PUT /systemconfig"
      />
      <AlertMessage error={error} success={message} />

      {loading ? (
        <SettingsSkeleton />
      ) : config ? (
        <>
          {config.sessions.maintenanceMode ? (
            <div
              className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
              role="status"
            >
              Maintenance mode is <strong>on</strong> — new sessions are blocked.
            </div>
          ) : null}

          <div className="space-y-6 pb-4">
            {SYSTEM_CONFIG_SECTIONS.map((section) => (
              <SettingsConfigSection
                key={section.id}
                section={section}
                config={config}
                onFieldChange={handleFieldChange}
              />
            ))}
          </div>

          <SettingsSaveBar
            dirty={dirty}
            saving={saving}
            validationError={validationError}
            onSave={handleSaveStructured}
            onReset={() => dispatch(resetSettingsDraft())}
          />

          <SettingsRawJsonPanel
            rawJson={rawJson}
            saving={saving}
            onChange={(v) => dispatch(setSettingsRawJson(v))}
            onSave={handleSaveRaw}
          />
        </>
      ) : null}

      <ConfirmDialog
        open={pendingDangerous !== null}
        title={dangerousDialog?.title ?? ''}
        description={dangerousDialog?.description ?? ''}
        confirmLabel={dangerousDialog?.confirmLabel ?? 'Confirm'}
        variant="danger"
        onConfirm={confirmDangerous}
        onCancel={cancelDangerous}
      />
    </AdminShell>
  );
}

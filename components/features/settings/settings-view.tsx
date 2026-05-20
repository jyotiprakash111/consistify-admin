'use client';

import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { CheckboxField, FormField, TextAreaInput, TextInput } from '@/components/ui/form-field';
import { LoadingState } from '@/components/ui/loading-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchSystemConfig,
  patchConfigSection,
  saveSystemConfig,
  saveSystemConfigRaw,
  selectSettings,
  setSettingsRawJson,
  setSystemConfig,
} from '@/lib/store/slices/settings/settingsSlice';
import type { SystemConfig } from '@/lib/types/admin';
import { btnPrimary, formGrid } from '@/lib/ui-classes';

export function SettingsView() {
  const dispatch = useAppDispatch();
  const { config, rawJson, error, message } = useAppSelector(selectSettings);

  useEffect(() => {
    dispatch(fetchSystemConfig());
  }, [dispatch]);

  function setBool(section: keyof SystemConfig, key: string, value: boolean) {
    dispatch(patchConfigSection({ section, key, value }));
  }

  return (
    <AdminShell>
      <PageHeader
        title="System config"
        description="Wallet, sessions, gamification, and payment settings"
        apiHint="GET /systemconfig · PUT /systemconfig"
      />
      <AlertMessage error={error} success={message} />
      {!config ? (
        <LoadingState label="Loading config..." />
      ) : (
        <div className="space-y-6">
          <CardSection title="Wallet">
            <CheckboxField
              label="Wallet enabled"
              checked={config.wallet.enabled}
              onChange={(v) => setBool('wallet', 'enabled', v)}
            />
            <div className={`${formGrid} mt-3`}>
              <FormField label="Deposit amount (₹)">
                <TextInput
                  type="number"
                  value={config.wallet.depositAmountInRupees}
                  onChange={(e) =>
                    dispatch(
                      setSystemConfig({
                        ...config,
                        wallet: { ...config.wallet, depositAmountInRupees: Number(e.target.value) || 0 },
                      }),
                    )
                  }
                />
              </FormField>
              <FormField label="Session failure fine">
                <TextInput
                  type="number"
                  value={config.wallet.sessionFailureFine}
                  onChange={(e) =>
                    dispatch(
                      setSystemConfig({
                        ...config,
                        wallet: { ...config.wallet, sessionFailureFine: Number(e.target.value) || 0 },
                      }),
                    )
                  }
                />
              </FormField>
              <FormField label="Phone tilt fine">
                <TextInput
                  type="number"
                  value={config.wallet.phubFine}
                  onChange={(e) =>
                    dispatch(
                      setSystemConfig({
                        ...config,
                        wallet: { ...config.wallet, phubFine: Number(e.target.value) || 0 },
                      }),
                    )
                  }
                />
              </FormField>
            </div>
          </CardSection>

          <CardSection title="Sessions">
            <CheckboxField
              label="Maintenance mode"
              checked={config.sessions.maintenanceMode}
              onChange={(v) => setBool('sessions', 'maintenanceMode', v)}
            />
          </CardSection>

          <CardSection title="Gamification">
            <div className="space-y-2">
              <CheckboxField
                label="Badges enabled"
                checked={config.gamification.badgesEnabled}
                onChange={(v) => setBool('gamification', 'badgesEnabled', v)}
              />
              <CheckboxField
                label="Coins enabled"
                checked={config.gamification.coinsEnabled}
                onChange={(v) => setBool('gamification', 'coinsEnabled', v)}
              />
              <CheckboxField
                label="Sprint mode enabled"
                checked={config.gamification.sprintModeEnabled}
                onChange={(v) => setBool('gamification', 'sprintModeEnabled', v)}
              />
            </div>
            <button
              type="button"
              onClick={() => config && dispatch(saveSystemConfig(config))}
              className={`${btnPrimary} mt-4`}
            >
              Save structured config
            </button>
          </CardSection>
        </div>
      )}

      <CardSection title="Raw JSON (advanced)" className="mt-8">
        <TextAreaInput value={rawJson} onChange={(e) => dispatch(setSettingsRawJson(e.target.value))} rows={16} />
        <button type="button" onClick={() => dispatch(saveSystemConfigRaw(rawJson))} className={`${btnPrimary} mt-3`}>
          Save raw JSON
        </button>
      </CardSection>
    </AdminShell>
  );
}

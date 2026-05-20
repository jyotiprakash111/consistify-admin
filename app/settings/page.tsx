'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getSystemConfig, updateSystemConfig } from '@/lib/api';

type SystemConfig = {
  wallet: {
    enabled: boolean;
    depositAmountInRupees: number;
    sessionFailureFine: number;
    phubFine: number;
  };
  sessions: {
    maintenanceMode: boolean;
    maxSessionMinutes: number;
    phubTiltAngle: number;
    phubTimeoutSeconds: number;
  };
  gamification: {
    badgesEnabled: boolean;
    coinsEnabled: boolean;
    sprintModeEnabled: boolean;
  };
  avatar: {
    slowOnTilt: boolean;
    fallOnTimeout: boolean;
    celebrationEnabled: boolean;
  };
  notifications: { emailEnabled: boolean; pushEnabled: boolean };
  payment: {
    provider: string;
    mode: 'test' | 'live';
    currency: string;
    minDepositInRupees: number;
    maxDepositInRupees: number;
    upiEnabled: boolean;
    cardsEnabled: boolean;
  };
};

export default function SettingsPage() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [rawJson, setRawJson] = useState('{}');

  useEffect(() => {
    let cancelled = false;
    void getSystemConfig().then((res) => {
      if (cancelled) return;
      if (!res.ok) return setError(res.error);
      setConfig(res.data as SystemConfig);
      setRawJson(JSON.stringify(res.data, null, 2));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave() {
    setError('');
    setMessage('');
    if (!config) return;
    const res = await updateSystemConfig(config as unknown as Record<string, unknown>);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage('Saved successfully');
  }

  async function onSaveRawJson() {
    setError('');
    setMessage('');
    try {
      const payload = JSON.parse(rawJson) as Record<string, unknown>;
      const res = await updateSystemConfig(payload);
      if (!res.ok) return setError(res.error);
      setMessage('Raw JSON saved successfully');
      setConfig(payload as unknown as SystemConfig);
    } catch {
      setError('Invalid JSON');
    }
  }

  function setBool(section: keyof SystemConfig, key: string, value: boolean) {
    if (!config) return;
    setConfig({
      ...config,
      [section]: {
        ...(config[section] as Record<string, unknown>),
        [key]: value,
      },
    } as SystemConfig);
  }

  return (
    <AdminShell>
      <h1>Settings</h1>
      {!config ? <p>Loading config...</p> : null}
      {config ? (
        <>
          <h3>Wallet</h3>
          <label>
            <input
              type="checkbox"
              checked={config.wallet.enabled}
              onChange={(e) => setBool('wallet', 'enabled', e.target.checked)}
            />{' '}
            Wallet enabled
          </label>
          <div style={{ display: 'grid', gap: 8, maxWidth: 460, margin: '8px 0 16px' }}>
            <input
              value={config.wallet.depositAmountInRupees}
              onChange={(e) =>
                setConfig({
                  ...config,
                  wallet: { ...config.wallet, depositAmountInRupees: Number(e.target.value) || 0 },
                })
              }
              placeholder="Deposit amount"
            />
            <input
              value={config.wallet.sessionFailureFine}
              onChange={(e) =>
                setConfig({
                  ...config,
                  wallet: { ...config.wallet, sessionFailureFine: Number(e.target.value) || 0 },
                })
              }
              placeholder="Session failure fine"
            />
            <input
              value={config.wallet.phubFine}
              onChange={(e) =>
                setConfig({
                  ...config,
                  wallet: { ...config.wallet, phubFine: Number(e.target.value) || 0 },
                })
              }
              placeholder="Phone tilt fine"
            />
          </div>

          <h3>Sessions</h3>
          <label>
            <input
              type="checkbox"
              checked={config.sessions.maintenanceMode}
              onChange={(e) => setBool('sessions', 'maintenanceMode', e.target.checked)}
            />{' '}
            Maintenance mode
          </label>

          <h3 style={{ marginTop: 16 }}>Gamification</h3>
          <label>
            <input
              type="checkbox"
              checked={config.gamification.badgesEnabled}
              onChange={(e) => setBool('gamification', 'badgesEnabled', e.target.checked)}
            />{' '}
            Badges enabled
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={config.gamification.coinsEnabled}
              onChange={(e) => setBool('gamification', 'coinsEnabled', e.target.checked)}
            />{' '}
            Coins enabled
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={config.gamification.sprintModeEnabled}
              onChange={(e) => setBool('gamification', 'sprintModeEnabled', e.target.checked)}
            />{' '}
            Sprint mode enabled
          </label>

          <div style={{ marginTop: 12 }}>
            <button onClick={onSave}>Save Structured Form</button>
          </div>
        </>
      ) : null}

      <h3 style={{ marginTop: 24 }}>Raw JSON (advanced)</h3>
      <textarea
        value={rawJson}
        onChange={(e) => setRawJson(e.target.value)}
        style={{ width: '100%', minHeight: 260, fontFamily: 'monospace' }}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={onSaveRawJson}>Save Raw JSON</button>
      </div>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {message ? <p style={{ color: 'green' }}>{message}</p> : null}
    </AdminShell>
  );
}

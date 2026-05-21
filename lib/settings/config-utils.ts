import type { SystemConfig } from '@/lib/types/admin';
import type { ConfigSectionKey } from '@/lib/settings/config-sections';

export function cloneConfig(config: SystemConfig): SystemConfig {
  return JSON.parse(JSON.stringify(config)) as SystemConfig;
}

export function configsEqual(a: SystemConfig | null, b: SystemConfig | null): boolean {
  if (!a || !b) return a === b;
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getSectionValue(
  config: SystemConfig,
  section: ConfigSectionKey,
  key: string,
): string | number | boolean {
  const block = config[section] as Record<string, string | number | boolean>;
  return block[key];
}

export function patchConfigValue(
  config: SystemConfig,
  section: ConfigSectionKey,
  key: string,
  value: string | number | boolean,
): SystemConfig {
  return {
    ...config,
    [section]: {
      ...(config[section] as Record<string, unknown>),
      [key]: value,
    },
  } as SystemConfig;
}

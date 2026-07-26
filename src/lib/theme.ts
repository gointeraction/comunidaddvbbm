// BBMDev — Dynamic Tenant Theme Engine

import type { TenantConfig } from '@/types/saas';

export const DEFAULT_TENANT: TenantConfig = {
  tenantId: 'bbmdev',
  name: 'BBMDev_',
  subdomain: 'app',
  customDomain: null,
  logoUrl: null,
  plan: 'enterprise',
  active: true,
  theme: {
    primaryColor: '#10B981',      // Emerald Green
    secondaryColor: '#34D399',
    backgroundColor: '#030712',   // Near-black navy
    cardColor: '#0a0f1a',
  },
  features: {
    courses: true,
    resources: true,
    liveSessions: true,
    gamification: true,
  },
  createdAt: new Date().toISOString(),
};

export function applyTenantTheme(tenant: TenantConfig) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const theme = tenant.theme || DEFAULT_TENANT.theme;

  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--primary-foreground', '#030712');
  root.style.setProperty('--background', theme.backgroundColor);
  root.style.setProperty('--card', theme.cardColor);
  root.style.setProperty('--ring', theme.primaryColor);
  root.style.setProperty('--color-terminal-green', theme.primaryColor);
}

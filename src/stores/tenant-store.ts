// BBMDev — Multi-Tenant Store & Management

import { create } from 'zustand';
import type { TenantConfig, SaaSMetrics } from '@/types/saas';
import { DEFAULT_TENANT, applyTenantTheme } from '@/lib/theme';

const MOCK_TENANTS: TenantConfig[] = [
  DEFAULT_TENANT,
  {
    tenantId: 'acme-corp',
    name: 'Acme AI Lab',
    subdomain: 'acme',
    customDomain: 'community.acmelab.ai',
    logoUrl: null,
    plan: 'pro',
    active: true,
    theme: {
      primaryColor: '#3B82F6',     // Royal Blue
      secondaryColor: '#60A5FA',
      backgroundColor: '#090d16',
      cardColor: '#0f172a',
    },
    features: {
      courses: true,
      resources: true,
      liveSessions: true,
      gamification: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    tenantId: 'devs-latam',
    name: 'Devs Latam VIP',
    subdomain: 'latam',
    customDomain: 'comunidad.devslatam.org',
    logoUrl: null,
    plan: 'starter',
    active: true,
    theme: {
      primaryColor: '#8B5CF6',     // Purple Accent
      secondaryColor: '#A78BFA',
      backgroundColor: '#0c0714',
      cardColor: '#130d24',
    },
    features: {
      courses: true,
      resources: true,
      liveSessions: false,
      gamification: true,
    },
    createdAt: new Date().toISOString(),
  },
];

interface TenantState {
  currentTenant: TenantConfig;
  tenants: TenantConfig[];
  metrics: SaaSMetrics;
  switchTenant: (tenantId: string) => void;
  createTenant: (tenantData: Omit<TenantConfig, 'createdAt' | 'active'>) => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: DEFAULT_TENANT,
  tenants: MOCK_TENANTS,
  metrics: {
    mrr: 4850,
    arr: 58200,
    totalCommunities: 28,
    totalMembers: 14200,
    activeCommunities: 26,
    churnRate: 1.2,
  },

  switchTenant: (tenantId: string) => {
    const tenant = get().tenants.find((t) => t.tenantId === tenantId);
    if (tenant) {
      set({ currentTenant: tenant });
      applyTenantTheme(tenant);
    }
  },

  createTenant: (data) => {
    const newTenant: TenantConfig = {
      ...data,
      active: true,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      tenants: [...state.tenants, newTenant],
      metrics: {
        ...state.metrics,
        totalCommunities: state.metrics.totalCommunities + 1,
        activeCommunities: state.metrics.activeCommunities + 1,
      },
    }));
    get().switchTenant(newTenant.tenantId);
  },
}));

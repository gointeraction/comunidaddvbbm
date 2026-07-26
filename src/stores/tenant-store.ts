// BBMDev — Multi-Tenant Store & Management

import { create } from 'zustand';
import type { TenantConfig, SaaSMetrics, SaaSPlan } from '@/types/saas';
import { DEFAULT_TENANT, applyTenantTheme } from '@/lib/theme';

const ENRICHED_DEFAULT_TENANT: TenantConfig = {
  ...DEFAULT_TENANT,
  subscription: {
    status: 'active',
    stripeCustomerId: 'cus_bbmdev_001',
    stripeSubscriptionId: 'sub_bbmdev_001',
    currentPeriodEnd: '2026-08-30T00:00:00.000Z',
    monthlyAmount: 499,
    ownerEmail: 'admin@bbmdev.io',
  },
  usage: {
    membersCount: 8450,
    membersLimit: 100000,
    storageUsedMB: 1450,
    storageLimitMB: 50000,
    postsCount: 1240,
    coursesCount: 18,
  },
};

const MOCK_TENANTS: TenantConfig[] = [
  ENRICHED_DEFAULT_TENANT,
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
    subscription: {
      status: 'active',
      stripeCustomerId: 'cus_acme_002',
      stripeSubscriptionId: 'sub_acme_002',
      currentPeriodEnd: '2026-08-15T00:00:00.000Z',
      monthlyAmount: 149,
      ownerEmail: 'billing@acmelab.ai',
    },
    usage: {
      membersCount: 3200,
      membersLimit: 5000,
      storageUsedMB: 3800,
      storageLimitMB: 10000,
      postsCount: 450,
      coursesCount: 6,
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
    subscription: {
      status: 'past_due',
      stripeCustomerId: 'cus_latam_003',
      stripeSubscriptionId: 'sub_latam_003',
      currentPeriodEnd: '2026-07-20T00:00:00.000Z',
      monthlyAmount: 49,
      ownerEmail: 'pagos@devslatam.org',
    },
    usage: {
      membersCount: 480,
      membersLimit: 500,
      storageUsedMB: 1800,
      storageLimitMB: 2000,
      postsCount: 120,
      coursesCount: 2,
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
  suspendTenant: (tenantId: string) => void;
  reactivateTenant: (tenantId: string) => void;
  updateTenantPlan: (tenantId: string, newPlan: SaaSPlan) => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: ENRICHED_DEFAULT_TENANT,
  tenants: MOCK_TENANTS,
  metrics: {
    mrr: 4850,
    arr: 58200,
    totalCommunities: 28,
    totalMembers: 14200,
    activeCommunities: 26,
    churnRate: 1.2,
    pastDueCommunities: 2,
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
      subscription: {
        status: 'active',
        stripeCustomerId: `cus_${data.subdomain}_${Date.now()}`,
        stripeSubscriptionId: `sub_${data.subdomain}_${Date.now()}`,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        monthlyAmount: data.plan === 'starter' ? 49 : data.plan === 'pro' ? 149 : 499,
        ownerEmail: `admin@${data.subdomain}.io`,
      },
      usage: {
        membersCount: 1,
        membersLimit: data.plan === 'starter' ? 500 : data.plan === 'pro' ? 5000 : 100000,
        storageUsedMB: 10,
        storageLimitMB: data.plan === 'starter' ? 2000 : data.plan === 'pro' ? 10000 : 50000,
        postsCount: 0,
        coursesCount: 0,
      },
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

  suspendTenant: (tenantId: string) => {
    set((state) => ({
      tenants: state.tenants.map((t) =>
        t.tenantId === tenantId
          ? {
              ...t,
              active: false,
              subscription: t.subscription
                ? { ...t.subscription, status: 'suspended' as const }
                : undefined,
            }
          : t
      ),
    }));
  },

  reactivateTenant: (tenantId: string) => {
    set((state) => ({
      tenants: state.tenants.map((t) =>
        t.tenantId === tenantId
          ? {
              ...t,
              active: true,
              subscription: t.subscription
                ? { ...t.subscription, status: 'active' as const }
                : undefined,
            }
          : t
      ),
    }));
  },

  updateTenantPlan: (tenantId: string, newPlan: SaaSPlan) => {
    const monthlyAmount = newPlan === 'starter' ? 49 : newPlan === 'pro' ? 149 : 499;
    const membersLimit = newPlan === 'starter' ? 500 : newPlan === 'pro' ? 5000 : 100000;
    set((state) => ({
      tenants: state.tenants.map((t) =>
        t.tenantId === tenantId
          ? {
              ...t,
              plan: newPlan,
              subscription: t.subscription ? { ...t.subscription, monthlyAmount } : undefined,
              usage: t.usage ? { ...t.usage, membersLimit } : undefined,
            }
          : t
      ),
    }));
  },
}));

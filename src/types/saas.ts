// BBMDev — SaaS Multi-Tenant Type Definitions

export type SaaSPlan = 'starter' | 'pro' | 'enterprise';

export interface TenantConfig {
  tenantId: string;
  name: string;
  subdomain: string;
  customDomain: string | null;
  logoUrl: string | null;
  plan: SaaSPlan;
  active: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardColor: string;
  };
  features: {
    courses: boolean;
    resources: boolean;
    liveSessions: boolean;
    gamification: boolean;
  };
  createdAt: string;
}

export interface SaaSMetrics {
  mrr: number;
  arr: number;
  totalCommunities: number;
  totalMembers: number;
  activeCommunities: number;
  churnRate: number;
}

// BBMDev — SaaS Multi-Tenant Type Definitions

export type SaaSPlan = 'exempt' | 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'trialing' | 'suspended' | 'canceled';

export interface TenantSubscription {
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string;
  monthlyAmount: number;
  ownerEmail: string;
}

export interface TenantUsage {
  membersCount: number;
  membersLimit: number;
  storageUsedMB: number;
  storageLimitMB: number;
  postsCount: number;
  coursesCount: number;
}

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
  subscription?: TenantSubscription;
  usage?: TenantUsage;
  createdAt: string;
}

export interface SaaSMetrics {
  mrr: number;
  arr: number;
  totalCommunities: number;
  totalMembers: number;
  activeCommunities: number;
  churnRate: number;
  pastDueCommunities: number;
}

// BBMDev — Tenant Analytics & Contact Directory Definitions

export type MemberStatus = 'trial' | 'paid' | 'inactive';

export interface TenantContact {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  country: string;
  countryCode: string;
  source: string;
  joinDate: string;
  lastActive: string;
  monthlySpend: number;
}

export interface TrafficSourceStat {
  source: string;
  visitors: number;
  signups: number;
  percentage: number;
}

export interface CountryStat {
  country: string;
  code: string;
  flag: string;
  count: number;
  percentage: number;
}

export interface DailyActivityStat {
  date: string;
  visitors: number;
  trialActive: number;
  paidActive: number;
  conversions: number;
  conversionRatePercent: number;
}

export interface TenantAnalyticsData {
  mrr: number;
  totalMembers: number;
  trialMembers: number;
  paidMembers: number;
  trialToPaidConversionRate: number; // e.g. 28.5%
  retentionRateDAUMAU: number; // e.g. 42.1%
  engagementRate: number; // e.g. 68.4%
  dailyVisitorsAvg: number;
  trafficSources: TrafficSourceStat[];
  countryBreakdown: CountryStat[];
  dailyActivity: DailyActivityStat[];
  contacts: TenantContact[];
}

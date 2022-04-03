export interface ISubscription {
  amount: number;
  period: 'MONTH' | 'ANNUAL';
  periodCount?: number;
  id?: string;
  name?: string;
  currency?: string;
  redirectUrl?: string;
  isTest?: boolean;
}
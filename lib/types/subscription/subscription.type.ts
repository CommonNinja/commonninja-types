export interface ISubscription {
  amount: number;
  period: 'MONTH' | 'ANNUAL';
  id?: string;
  name?: string;
  currency?: string;
  redirectUrl?: string;
  isTest?: string;
}
export interface ISubscription {
  amount: number;
  period: number;
  periodType: 'day' | 'week' | 'month' | 'year';
  id?: string;
  name?: string;
  currency?: string;
  redirectUrl?: string;
  isTest?: string;
}
export interface IPaymentPlan {
  amount: number;
  period: 'MONTH' | 'ANNUAL' | 'ONE_TIME';
  id?: string;
  name?: string;
  periodCount?: number;
  currency?: string;
  redirectUrl?: string;
  isTest?: boolean;
}

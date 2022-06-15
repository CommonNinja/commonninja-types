export type IPaymentPlanPeriod = 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'one-time';

export interface IPaymentPlan {
  amount: number;
  period: IPaymentPlanPeriod;
  id?: string;
  name?: string;
  periodCount?: number;
  currency?: string;
  redirectUrl?: string;
  isTest?: boolean;
	trialPeriodDays?: number;
}

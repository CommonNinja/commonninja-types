export type TPayloadSubscriptionStatus =
  | "active"
  | "cancelled"
  | "pending"
  | "expired"
  | "declined"
  | "trial"
  | "unknown";

export interface ISubscriptionModifier {
  id: string;
  subscriptionId: string;
  amount: number;
  recurring: boolean;
  description: string;
  currency: string;
}

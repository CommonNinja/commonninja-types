import { IPlan } from '../plan/plan.type';
import { TPlatform } from '../platform/platform.type';

export interface IUser {
  platform: TPlatform;
  platformUserId: string;
  name: string;
  email: string;
  plan?: IPlan;
}

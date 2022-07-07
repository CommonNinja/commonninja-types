export interface ICoupon {
	id?: string;
	code?: string;
	name?: string;
	discountAmount?: number;
	usageCount?: number;
	usageLimit?: number;
	createdAt?: string;
	updatedAt?: string;
	expiresAt?: string;
}

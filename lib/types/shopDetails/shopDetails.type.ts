export interface IShopDetails {
	id?: string;
	currency?: string;
	currencyCode?: string;
	country?: string;
	countryCode?: string;
	name?: string;
	url?: string;
}

// Ecwid
// interface IEcwidStoreSettings {
// 	closed: boolean;
// 	storeName: string;
// 	storeDescription: string;
// }

// interface IEcwidFormatAndUnits {
// 	currency: string;
// 	currencyPrefix: string; // '$'
// 	currencySuffix?: string;
// }

// interface IEcwidAccount {
// 	accountName: string;
// 	accountNickName: string;
// 	accountEmail: string;
// 	whiteLabel: boolean;
// 	suspended: boolean;
// }

// export interface IEcwidStoreProfile {
// 	settings: IEcwidStoreSettings;
// 	formatsAndUnits: IEcwidFormatAndUnits;
// 	account: IEcwidAccount;
// }

// Shopify
// export interface IShopifyShopConfiguration {
// 	id: number;
// 	name?: string;
// 	currency?: string;
// 	myshopify_domain?: string;
// 	email?: string;
// 	domain?: string;
// 	province?: string;
// 	country?: string;
// 	address1?: string;
// 	zip?: string;
// 	city?: string;
// 	source?: null;
// 	phone?: string;
// 	latitude?: null;
// 	longitude?: null;
// 	primary_locale?: string;
// 	address2?: null;
// 	created_at?: string;
// 	updated_at?: string;
// 	country_code?: string;
// 	country_name?: string;
// 	customer_email?: string;
// 	timezone?: string;
// 	iana_timezone?: string;
// 	shop_owner?: string;
// 	money_format?: string;
// 	money_with_currency_format?: string;
// 	weight_unit?: string;
// 	province_code?: null;
// 	taxes_included?: boolean;
// 	auto_configure_tax_inclusivity?: null;
// 	tax_shipping?: null;
// 	county_taxes?: boolean;
// 	plan_display_name?: string;
// 	plan_name?: string;
// 	has_discounts?: boolean;
// 	has_gift_cards?: boolean;
// 	google_apps_domain?: null;
// 	google_apps_login_enabled?: null;
// 	money_in_emails_format?: string;
// 	money_with_currency_in_emails_format?: string;
// 	eligible_for_payments?: boolean;
// 	requires_extra_payments_agreement?: boolean;
// 	password_enabled?: boolean;
// 	has_storefront?: boolean;
// 	eligible_for_card_reader_giveaway?: boolean;
// 	finances?: boolean;
// 	primary_location_id?: 64475332768;
// 	cookie_consent_level?: string;
// 	visitor_tracking_consent_preference?: string;
// 	checkout_api_supported?: boolean;
// 	multi_location_enabled?: boolean;
// 	setup_required?: boolean;
// 	pre_launch_enabled?: boolean;
// 	enabled_presentment_currencies?: string[];
// }

// Shift4shop
// {
//   "StoreInformation": {
//     "StoreName": "sample string 1",
//     "StoreSlogan": "sample string 2",
//     "StoreLogo": "sample string 3",
//     "StoreEmail": "sample string 4",
//     "StoreURL": "sample string 5",
//     "StoreSecureURL": "sample string 6"
//   },
//   "MerchantInformation": {
//     "Company": "sample string 1",
//     "Address1": "sample string 2",
//     "Address2": "sample string 3",
//     "City": "sample string 4",
//     "State": "sample string 5",
//     "Country": "sample string 6",
//     "ZipCode": "sample string 7",
//     "Phone": "sample string 8",
//     "AlternatePhone": "sample string 9",
//     "Fax": "sample string 10",
//     "InvoiceLogo": "sample string 11",
//     "InvoiceTerms": "sample string 12"
//   },
//   "StoreStandards": {
//     "StoreTimeZone": "sample string 1",
//     "CurrencySymbol": "sample string 2",
//     "DecimalPlacesOnPrice": "sample string 3",
//     "CurrencyCode": "sample string 4"
//   }
// }

// BigCommerce
// export interface IBigCommerceShopInformation {
// 	id: string;
// 	domain?: string;
// 	secure_url?: string;
// 	name?: string;
// 	currency?: string;
// }

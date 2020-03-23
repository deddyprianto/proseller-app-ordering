import Config from 'react-native-config';
import Base64 from 'Base64';

const awsConfig = {
  // AWS CONFIG
  region: Config.REGION,
  endpoint: Config.ENDPOINT,
  onesignalID: Config.ONESIGNAL_ID,

  // BASE URL CRM
  base_url: `${Config.API_HOST}crm/api`,
  // BASE URL MASTER DATA
  base_url_master_data: `${Config.API_HOST}masterdata/api`,
  // BASE URL PRODUCT
  base_url_product: `${Config.API_HOST}product/api`,
  // BASE URL ORDER
  base_url_order: `${Config.API_HOST}ordering/api`,
  // BASE URL PAYMENT
  base_url_payment: `https://payment.proseller.io/api/`,

  phoneNumberCode: Config.PHONE_NUMBER_CODE,
  COUNTRY: Config.COUNTRY,
  COMPANY_NAME: Config.COMPANY_NAME,
  COMPANY_POLICY_URL: Config.COMPANY_POLICY_URL,

  CURRENCY: Config.CURRENCY,
  LOCALES: Config.LOCALES,

  // sentry DSN
  DSN: Config.SENTRY_DSN,

  // RSA PRIVATE KEY
  PRIVATE_KEY_RSA: Base64.atob(Config.PRIVATE_KEY_RSA),
};

export default awsConfig;

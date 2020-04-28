import Config from 'react-native-config';
import Base64 from 'Base64';

const awsConfig = {
  // AWS CONFIG
  region: `ap-southeast-1`,
  endpoint: `https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/dev`,
  onesignalID: `16d15d54-d90b-41d0-a30d-aa07808d6db1`,

  // BASE URL CRM
  base_url: `https://qiji-demo.proseller.io/crm/api`,
  // BASE URL MASTER DATA
  base_url_master_data: `https://qiji-demo.proseller.io/masterdata/api`,
  // BASE URL PRODUCT
  base_url_product: `https://qiji-demo.proseller.io/product/api`,
  // BASE URL ORDER
  base_url_order: `https://qiji-demo.proseller.io/ordering/api`,
  // BASE URL PAYMENT DEV
  base_url_payment: `https://payment.proseller.io/api/`,
  // BASE URL PAYMENT DEMO
  base_url_payment_demo: `https://payment-demo.proseller.io/api/`,

  phoneNumberCode: '+65',
  COUNTRY: `Singapore`,
  COMPANY_NAME: `Qiji`,
  COMPANY_POLICY_URL: `http://qiji-demo.proseller.io/`,

  CURRENCY: `SGD`,
  LOCALES: `en-US`,

  // sentry DSN
  DSN: `https://9ed8cf3be2e24a3e884a0b15f5f054d0@sentry.io/2653559`,

  // RSA PRIVATE KEY
  PRIVATE_KEY_RSA: Base64.atob(
    `LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQogICAgICAgICAgICAgICAgICBNSUlDWEFJQkFBS0JnUUN0blg5Q3FSWlE0SndWRmxmdzd3TW9qdmxhVGt6clpZQ2d5alQ2L1prdUZDWWhkMytTCiAgICAgICAgICAgICAgICAgIEJUUGo0LzNMSkdwK0lnbnRLNENvVjVpQXFvdm9YQVBkM2Fkb0UrTUdsKzRtM2diK0xjVnpWOHIvbmNqdzIxaGgKICAgICAgICAgICAgICAgICAgRVIxY3JvaTljK3dORmhkYVRlemJTakZmNkdjVnNuNUFQMHNtcnA5SVFTeFNrWmFnbTRzWGtOSi9GUUlEQVFBQgogICAgICAgICAgICAgICAgICBBbjg2V1lqVVRjTThaS3l5UVRpWFMxRnBmQUk5OWZGSk9aUCtKWERsbVZ5YmJYUklXS2YybDFhRkRvcGNDVjNPCiAgICAgICAgICAgICAgICAgIHJ3Y01GMW1WY0dIOHBuMkF4bDZ1dktSMWlCdml2NTVqRE5lTnFGYm9hODhaOTk2aERxdm1iTTVwV0FJbk4rNWwKICAgICAgICAgICAgICAgICAgQTlodEhLRTQrTDIvSWhnaGZWa0ticEpYMlN0dzRpdmZ1ODRVcXF6WGlkamhBa0VBNVg1NldqbHhic25IV2t6VgogICAgICAgICAgICAgICAgICBvZFNxU0JEalBtUzVxZFVRTC9pWnJyWVQwZnJKazIyR1ZIaFdjSk9kTjA0UFRKZ3ZncFUyRXdXOHBITnR2clIwCiAgICAgICAgICAgICAgICAgIFlKcU5ZUUpCQU1HcTFSZVptdzNic29wWVc0NHF6aHZuRG1yc3A4Z21yNUVCaHJzMkcyaHU0RlJpaW1rZ2FJdUYKICAgICAgICAgICAgICAgICAgbzNQdVNrU0tOdDh3ZWowVnVxaEo3QXYxQi9OVGVqVUNRUUNnUjB3V2RXWDJsVEFJcmY3SjdtZ2F1c2lxeTlncgogICAgICAgICAgICAgICAgICBkNlc5aXlkeU1MSDVCZWtBY1E3UE1kaFUrWk5raTd6OXBwQVA2RHdDM3cvWDN0SDN6Ym8xdWRzaEFrRUFpejJXCiAgICAgICAgICAgICAgICAgIDdkdmJsakFpQXNPYU4vSGd0RUVBcGJHMncvbkVlcjRkTDFhc2gvNUh2WVFIdmFPMlpySFRuaE55UkNzWFhvcU4KICAgICAgICAgICAgICAgICAgS0lRSjZ0c1RJbG11dUt5SkRRSkJBTDRnaGVDTm53dlpUT0xtZlJtT01wSCszd2NPWWxSYlpQazlCZFpteHBxbgogICAgICAgICAgICAgICAgICA3MHNsbkcydDBBVWVlR1hNZFl3S3hZSTh2WXVsRWRrR2xsbS9FQURRaHlBPQogICAgICAgICAgICAgICAgICAtLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQ==`,
  ),
};

export default awsConfig;


// import Config from 'react-native-config';
// import Base64 from 'Base64';

// const awsConfig = {
//   // AWS CONFIG
//   region: Config.REGION,
//   endpoint: Config.ENDPOINT,
//   onesignalID: Config.ONESIGNAL_ID,

//   // BASE URL CRM
//   base_url: `${Config.API_HOST}crm/api`,
//   // BASE URL MASTER DATA
//   base_url_master_data: `${Config.API_HOST}masterdata/api`,
//   // BASE URL PRODUCT
//   base_url_product: `${Config.API_HOST}product/api`,
//   // BASE URL ORDER
//   base_url_order: `${Config.API_HOST}ordering/api`,
//   // BASE URL PAYMENT DEV
//   base_url_payment: `https://payment.proseller.io/api/`,
//   // BASE URL PAYMENT DEMO
//   base_url_payment_demo: `https://payment-demo.proseller.io/api/`,

//   phoneNumberCode: Config.PHONE_NUMBER_CODE,
//   COUNTRY: Config.COUNTRY,
//   COMPANY_NAME: Config.COMPANY_NAME,
//   COMPANY_POLICY_URL: Config.COMPANY_POLICY_URL,

//   CURRENCY: Config.CURRENCY,
//   LOCALES: Config.LOCALES,

//   // sentry DSN
//   DSN: Config.SENTRY_DSN,

//   // RSA PRIVATE KEY
//   PRIVATE_KEY_RSA: Base64.atob(Config.PRIVATE_KEY_RSA),
// };

// export default awsConfig;

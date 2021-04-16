// import Config from 'react-native-config';
// import Base64 from 'Base64';
// import {Platform} from 'react-native';
//
// console.log('PLATFORM', Platform);
//
// const awsConfig = {
//   // AWS CONFIG
//   region: `ap-southeast-1`,
//   endpoint: `https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/dev`,
//   onesignalID: `16d15d54-d90b-41d0-a30d-aa07808d6db1`,
//
//   // BASE URL CRM
//   base_url: `https://qiji-dev.proseller.io/crm/api`,
//   // BASE URL MASTER DATA
//   base_url_master_data: `https://qiji-dev.proseller.io/masterdata/api`,
//   // BASE URL PRODUCT
//   base_url_product: `https://qiji-dev.proseller.io/product/api`,
//   // BASE URL ORDER
//   base_url_order: `https://qiji-dev.proseller.io/ordering/api`,
//   // BASE URL PAYMENT DEV
//   base_url_payment: `https://payment.proseller.io/api/`,
//   // BASE URL PAYMENT DEMO
//   base_url_payment_demo: `https://payment-demo.proseller.io/api/`,
//
//   phoneNumberCode: '+65',
//   COUNTRY: `Singapore`,
//   COMPANY_NAME: `Qiji`,
//   COMPANY_POLICY_URL: `http://qiji-demo.proseller.io/`,
//
//   CURRENCY: `SGD`,
//   LOCALES: `en-US`,
//
//   // sentry DSN
//   DSN: `https://9ed8cf3be2e24a3e884a0b15f5f054d0@sentry.io/2653559`,
//
//   // RSA PRIVATE KEY
//   PRIVATE_KEY_RSA: Base64.atob(
//     `LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQogICAgICAgICAgICAgICAgICBNSUlDWEFJQkFBS0JnUUN0blg5Q3FSWlE0SndWRmxmdzd3TW9qdmxhVGt6clpZQ2d5alQ2L1prdUZDWWhkMytTCiAgICAgICAgICAgICAgICAgIEJUUGo0LzNMSkdwK0lnbnRLNENvVjVpQXFvdm9YQVBkM2Fkb0UrTUdsKzRtM2diK0xjVnpWOHIvbmNqdzIxaGgKICAgICAgICAgICAgICAgICAgRVIxY3JvaTljK3dORmhkYVRlemJTakZmNkdjVnNuNUFQMHNtcnA5SVFTeFNrWmFnbTRzWGtOSi9GUUlEQVFBQgogICAgICAgICAgICAgICAgICBBbjg2V1lqVVRjTThaS3l5UVRpWFMxRnBmQUk5OWZGSk9aUCtKWERsbVZ5YmJYUklXS2YybDFhRkRvcGNDVjNPCiAgICAgICAgICAgICAgICAgIHJ3Y01GMW1WY0dIOHBuMkF4bDZ1dktSMWlCdml2NTVqRE5lTnFGYm9hODhaOTk2aERxdm1iTTVwV0FJbk4rNWwKICAgICAgICAgICAgICAgICAgQTlodEhLRTQrTDIvSWhnaGZWa0ticEpYMlN0dzRpdmZ1ODRVcXF6WGlkamhBa0VBNVg1NldqbHhic25IV2t6VgogICAgICAgICAgICAgICAgICBvZFNxU0JEalBtUzVxZFVRTC9pWnJyWVQwZnJKazIyR1ZIaFdjSk9kTjA0UFRKZ3ZncFUyRXdXOHBITnR2clIwCiAgICAgICAgICAgICAgICAgIFlKcU5ZUUpCQU1HcTFSZVptdzNic29wWVc0NHF6aHZuRG1yc3A4Z21yNUVCaHJzMkcyaHU0RlJpaW1rZ2FJdUYKICAgICAgICAgICAgICAgICAgbzNQdVNrU0tOdDh3ZWowVnVxaEo3QXYxQi9OVGVqVUNRUUNnUjB3V2RXWDJsVEFJcmY3SjdtZ2F1c2lxeTlncgogICAgICAgICAgICAgICAgICBkNlc5aXlkeU1MSDVCZWtBY1E3UE1kaFUrWk5raTd6OXBwQVA2RHdDM3cvWDN0SDN6Ym8xdWRzaEFrRUFpejJXCiAgICAgICAgICAgICAgICAgIDdkdmJsakFpQXNPYU4vSGd0RUVBcGJHMncvbkVlcjRkTDFhc2gvNUh2WVFIdmFPMlpySFRuaE55UkNzWFhvcU4KICAgICAgICAgICAgICAgICAgS0lRSjZ0c1RJbG11dUt5SkRRSkJBTDRnaGVDTm53dlpUT0xtZlJtT01wSCszd2NPWWxSYlpQazlCZFpteHBxbgogICAgICAgICAgICAgICAgICA3MHNsbkcydDBBVWVlR1hNZFl3S3hZSTh2WXVsRWRrR2xsbS9FQURRaHlBPQogICAgICAgICAgICAgICAgICAtLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQ==`,
//   ),
// };
//
// export default awsConfig;

import Config from 'react-native-config';
import ENV from '../../env-ios';
// import ENV from '../../env-ios-demo';
import Base64 from 'Base64';
import {Platform} from 'react-native';

let Data = {};
// if we build to android, then read .env file
if (Platform.OS == 'android') {
  Data = Config;
} else {
  Data = ENV;
}

const awsConfig = {
  // AWS CONFIG
  region: Data.REGION,
  endpoint: Data.ENDPOINT,
  onesignalID: Data.ONESIGNAL_ID,

  // BASE URL CRM
  base_url: `${Data.API_HOST}crm/api`,
  // BASE URL MASTER DATA
  base_url_master_data: `${Data.API_HOST}masterdata/api`,
  // BASE URL PRODUCT
  base_url_product: `${Data.API_HOST}product/api`,
  // BASE URL ORDER
  base_url_order: `${Data.API_HOST}ordering/api`,
  // BASE URL PAYMENT
  base_url_payment: Data.base_url_payment,

  phoneNumberCode: Data.PHONE_NUMBER_CODE,
  COUNTRY: Data.COUNTRY,
  COUNTRY_CODE: Data.COUNTRY_CODE,
  COMPANY_NAME: Data.COMPANY_NAME,
  COMPANY_POLICY_URL: Data.COMPANY_POLICY_URL,

  CURRENCY: Data.CURRENCY,
  LOCALES: Data.LOCALES,

  // sentry DSN
  DSN: Data.SENTRY_DSN,

  // RSA PRIVATE KEY
  PRIVATE_KEY_RSA: Base64.atob(Data.PRIVATE_KEY_RSA),

  APP_DEEP_LINK: Data.appUrl,
};

export default awsConfig;

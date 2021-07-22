import {NativeModules} from 'react-native';
import config from '../../config/awsConfig';

const {NetsClickReact} = NativeModules;

/**
 * Register
 *
 * Example:
 * NetsClick.Register({
 *   userId: '12345',
 *   ewHost: 'https://payment.proseller-dev.com',
 *   appId: 'com.ustars.demo',
 *   retailerInfo: 'USTARS',
 * });
 *
 * For testing:
 *    Bank: Bank Simluator
 *    Last 4 digit: 1234 (5988 for Debit with PIN)
 *    Nationality: Singaporean/PR
 *    NRIC: S0000004C
 *    OTP: 123456
 * - For invalid PIN, use card ending 5201 in registration and debit
 *   amount more than $100.
 */
const Register = async ({
  userId,
  appId,
  retailerInfo,
  ewHost,
  merchantHost,
  terminalId,
  retailerId,
  companyId,
  netsclickApiKey,
  netsclickSecretKey,
}) => {
  try {
    const data = await NetsClickReact.doRegister(userId);
    console.log('Registration', data);
    const res = await fetch(`${merchantHost}/gmt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        ewHost,
        userId,
        appId,
        retailerInfo,
        terminalId: terminalId,
        retailerId: retailerId,
        companyId,
        netsclickApiKey,
        netsclickSecretKey,
      }),
    });
    const json = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default Register;

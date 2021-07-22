import {NativeModules} from 'react-native';
import config from '../../config/awsConfig';

const {NetsClickReact} = NativeModules;

const purchase = async ({
  data,
  amount,
  ewHost,
  userId,
  appId,
  retailerInfo,
  trxnRef,
  cartGUID,
  merchantHost,
  terminalId,
  retailerId,
  netsclickApiKey,
  netsclickSecretKey,
}) => {
  try {
    console.log(userId, 'userIduserIduserId');
    let res = await fetch(`${merchantHost}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        ewHost,
        userId: userId,
        appId,
        retailerInfo, // Max 40 chars
        trxnAmt: amount,
        terminalId: terminalId,
        retailerId: retailerId,
        trxnRef,
        cartGUID,
        netsclickApiKey,
        netsclickSecretKey,
      }),
    });
    const json = await res.json();
    console.log('json', json);
    return json;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Debit
 *
 * Successful Debit will return statusCode of '00'. Otherwise, debit failed.
 *
 * Example:
 * NetsClick.Debit({
 *   amount: 34.12,
 *   userId: '12345',
 *   ewHost: 'https://payment.proseller-dev.com',
 *   appId: 'com.ustars.demo',
 *   retailerInfo: 'USTARS',
 *   trxnRef: '43567212', // transaction ref no
 *   cartGUID: '2b2d22f1-c7f0-49dc-9c3a-a01b2d1cc6ff', // cart:guid
 * });
 *
 * Testing:
 * - To simulate PIN, enter an amount greater than 100.
 * - PIN is always 123456.
 * - For invalid PIN, use card ending 5201 in registration and debit
 *   amount more than $100.
 */
const Debit = async ({amount, ...opts}) => {
  try {
    const data = await NetsClickReact.doDebit(amount.toString());
    console.log('Debit', data);
    let json = await purchase({...opts, amount, data});
    let {statusCode, data: purchaseData} = json;
    while (statusCode === 'U9' || statusCode === '55') {
      // Opening PIN Pad
      const cryptogram = purchaseData.body.txn_specific_data[1];
      let txnCryptogram = cryptogram.sub_id;
      txnCryptogram += cryptogram.sub_length;
      txnCryptogram += cryptogram.sub_data;
      console.log('Status Code', statusCode);
      console.log('PIN', txnCryptogram);
      const ret = await NetsClickReact.DebitWithPIN(
        amount.toString(),
        statusCode,
        txnCryptogram,
      );
      console.log('pin ret', ret);
      json = await purchase({...opts, amount, data: ret});
      console.log('json pin', json);
      statusCode = json.statusCode;
      purchaseData = json.data;
    }
    return {status: json.status, data: json};
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.message === '9992') {
      console.log('User cancelled');
      return {
        status: 'User cancelled',
        statusCode: '',
      };
    }
    throw error;
  }
};

export default Debit;

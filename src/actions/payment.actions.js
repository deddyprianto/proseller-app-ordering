import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {fetchApiPayment} from '../service/apiPayment';
import {fetchApi} from '../service/api';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import NetsClick from '../helper/NetsClick';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const setNetsclickStatus = status => {
  return async dispatch => {
    try {
      dispatch({
        type: 'NETSCLICK_STATUS',
        netsclickStatus: status,
      });
    } catch (error) {
      return error;
    }
  };
};

export const netslickDebit = (item, cartID, amount) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get user details
      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      let {
        userReducer: {
          getCompanyInfo: {companyInfo},
        },
      } = state;

      // Decrypt data
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const paymentProvider = companyInfo.paymentTypes.find(
        data => data.paymentID === item.paymentID,
      );

      const appId =
        awsConfig.APP_ID + '::' + item.accountID + '-' + userDetails.companyId;
      const retailerInfo = awsConfig.RETAILER_INFO;
      const merchant_host = awsConfig.NETSCLICK_MERCHANT_HOST;
      let netsclick_terminal_id = awsConfig.NETSCLICK_TID;
      let netsclick_retailer_id = awsConfig.NETSCLICK_MID;

      netsclick_retailer_id = netsclick_retailer_id.toString();
      netsclick_terminal_id = netsclick_terminal_id.toString();

      const ewHost = awsConfig.base_url_payment.split('/api/')[0];
      // const ewHost = 'https://payment.proseller-dev.com';
      let debitStatus = false;
      let dataResponse = {};

      const userId = userDetails.id;

      await NetsClick.Debit({
        amount: Number(amount),
        userId,
        ewHost: ewHost,
        appId: appId,
        retailerInfo: retailerInfo,
        trxnRef: cartID,
        cartGUID: cartID,
        merchantHost: merchant_host,
        terminalId: netsclick_terminal_id,
        retailerId: netsclick_retailer_id,
        netsclickApiKey: awsConfig.NETSCLICK_API_KEY,
        netsclickSecretKey: awsConfig.NETSCLICK_SECRET_KEY,
      })
        .then(async r => {
          console.log('response debit netslick ', r);
          if (r.status === 'Approved') {
            debitStatus = true;
            dataResponse = r;
          } else {
            setTimeout(() => {
              Alert.alert('Sorry', `Payment failed, ${r.status}`);
            }, 200);
            debitStatus = false;
          }
        })
        .catch(async e => {
          setTimeout(() => {
            Alert.alert('Sorry', 'Payment Failed ' + e.toString());
          }, 200);
          debitStatus = false;
        });
      return {debitStatus, dataResponse};
    } catch (error) {
      console.log(error);
      return error;
    }
  };
};

export const netsclickRegister = item => {
  return async (dispatch, getState) => {
    const state = getState();
    let status = true;
    try {
      // get user details
      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      let {
        userReducer: {
          getCompanyInfo: {companyInfo},
        },
      } = state;

      // Decrypt data
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const paymentProvider = companyInfo.paymentTypes.find(
        data => data.paymentID === item.paymentID,
      );

      const appId = awsConfig.APP_ID;
      const retailerInfo = awsConfig.RETAILER_INFO;
      const merchant_host = awsConfig.NETSCLICK_MERCHANT_HOST;
      let netsclick_terminal_id = awsConfig.NETSCLICK_TID;
      let netsclick_retailer_id = awsConfig.NETSCLICK_MID;

      netsclick_retailer_id = netsclick_retailer_id.toString();
      netsclick_terminal_id = netsclick_terminal_id.toString();

      const ewHost = awsConfig.base_url_payment.split('/api/')[0];
      // const ewHost = 'https://payment.proseller-dev.com';

      const userId = userDetails.id;

      await NetsClick.Register({
        userId,
        appId: appId,
        retailerInfo: retailerInfo,
        ewHost: ewHost,
        merchantHost: merchant_host,
        terminalId: netsclick_terminal_id,
        retailerId: netsclick_retailer_id,
        companyId: userDetails.companyId,
        netsclickApiKey: awsConfig.NETSCLICK_API_KEY,
        netsclickSecretKey: awsConfig.NETSCLICK_SECRET_KEY,
      })
        .then(async r => {
          if (r.status === 'success') {
            try {
              await AsyncStorage.setItem(
                '@netsclick_register_status',
                userDetails.id,
              );
            } catch (e) {}

            setTimeout(() => {
              Alert.alert('NETS Click', 'NETS Click registration success!');
            }, 100);
          } else {
            setTimeout(() => {
              Alert.alert('Sorry', 'NETS Click registration failed.');
            }, 100);
            try {
              await AsyncStorage.removeItem('@netsclick_register_status');
            } catch (e) {}
          }
        })
        .catch(async e => {
          if (e && e.toString() !== 'Error: 9992') {
            setTimeout(() => {
              Alert.alert(
                'Opsss...',
                'There is a slight technical problem, please restart your app to register.',
                [{text: 'Ok', onPress: () => null}],
                {cancelable: false},
              );
            }, 100);
            status = false;
          }

          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}
        });
    } catch (error) {
      console.log(error);
      status = false;
    }
    return status;
  };
};

export const netsclickDeregister = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      await NetsClick.Deregister()
        .then(async r => {
          console.log(r);
          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}

          dispatch({
            type: 'NETSCLICK_STATUS',
            netsclickStatus: false,
          });

          dispatch({
            type: 'GET_USER_DEFAULT_ACCOUNT',
            defaultAccount: undefined,
          });

          dispatch({
            type: 'SELECTED_ACCOUNT',
            selectedAccount: undefined,
          });

          setTimeout(() => {
            Alert.alert('NETS Click', 'NETS Click account has been removed!');
          }, 100);
        })
        .catch(async e => {
          console.log(e);
          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}

          dispatch({
            type: 'NETSCLICK_STATUS',
            netsclickStatus: false,
          });

          dispatch({
            type: 'GET_USER_DEFAULT_ACCOUNT',
            defaultAccount: undefined,
          });

          dispatch({
            type: 'SELECTED_ACCOUNT',
            selectedAccount: undefined,
          });
        });
    } catch (error) {
      return error;
    }
  };
};

export const getAccountPayment = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        userReducer: {
          defaultPaymentAccount: {defaultAccount},
        },
      } = state;

      const response = await fetchApiPayment(
        '/account',
        'GET',
        null,
        200,
        token,
      );
      console.log('responsenya payment account', response);

      dispatch({
        type: 'MY_CARD_ACCOUNT',
        card: response.response.data,
      });

      try {
        if (!isEmptyArray(response.response.data)) {
          const find = response.response.data.find(
            item => item.isDefault == true,
          );
          if (find != undefined) {
            dispatch({
              type: 'GET_USER_DEFAULT_ACCOUNT',
              defaultAccount: find,
            });
          } else {
            if (
              defaultAccount &&
              defaultAccount.paymentID === 'MANUAL_TRANSFER'
            ) {
              dispatch({
                type: 'GET_USER_DEFAULT_ACCOUNT',
                defaultAccount: defaultAccount,
              });
              return;
            }
            dispatch({
              type: 'GET_USER_DEFAULT_ACCOUNT',
              defaultAccount: undefined,
            });
          }
        } else {
          if (
            defaultAccount &&
            defaultAccount.paymentID === 'MANUAL_TRANSFER'
          ) {
            dispatch({
              type: 'GET_USER_DEFAULT_ACCOUNT',
              defaultAccount: defaultAccount,
            });
            return;
          }
          dispatch({
            type: 'GET_USER_DEFAULT_ACCOUNT',
            defaultAccount: undefined,
          });
        }
      } catch (e) {}

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const registerCard = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      // get user details and phone ID
      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      payload.companyID = userDetails.companyId;

      const response = await fetchApiPayment(
        '/account/register',
        'POST',
        payload,
        200,
        token,
      );
      console.log('response register account', JSON.stringify(response));

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const removeCard = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const accountID = payload.accountID;

      const response = await fetchApiPayment(
        `/account/delete/${accountID}`,
        'DELETE',
        null,
        200,
        token,
      );
      console.log('response delete account', JSON.stringify(response));

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const checkAccount = accountID => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiPayment(
        `/account/check/${accountID}`,
        'GET',
        null,
        200,
        token,
      );
      console.log('response check account', response);

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const checkStatusPayment = referenceNo => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        `/sales/status?referenceNo=${referenceNo}`,
        'GET',
        null,
        200,
        token,
      );
      // console.log('response status sales', response);

      return response.responseBody;
    } catch (error) {
      return error;
    }
  };
};

export const selectedAccount = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SELECTED_ACCOUNT',
        selectedAccount: payload,
      });
    } catch (error) {
      return error;
    }
  };
};

export const selectedAddress = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SELECTED_ADDRESS',
        selectedAddress: payload,
      });
    } catch (error) {
      return error;
    }
  };
};

export const clearAccount = () => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SELECTED_ACCOUNT',
        selectedAccount: undefined,
      });
    } catch (error) {
      return error;
    }
  };
};

export const clearAddress = () => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SELECTED_ADDRESS',
        selectedAddress: undefined,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getPaymentData = referenceNo => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        accountsReducer: {
          myVoucers: {myVoucers},
        },
      } = state;

      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const response = await fetchApi(
        `/payment/pending/get/${referenceNo}`,
        'GET',
        null,
        200,
        token,
      );
      console.log('response get payment data', response);
      if (response.success == true) {
        if (isEmptyObject(response.responseBody.Data.customerDetails)) {
          response.responseBody.Data.customerDetails = {};
          response.responseBody.Data.customerDetails.id = userDetails.sortKey;
        }

        if (!isEmptyObject(response.responseBody.Data.customerDetails)) {
          if (
            response.responseBody.Data.customerDetails.id != userDetails.id &&
            response.responseBody.Data.customerDetails.id != userDetails.sortKey
          ) {
            response.success = false;
            response.message = 'Looks like you scan wrong QR Code.';
            return response;
          }
        }

        if (response.responseBody.Data.status === 'COMPLETED') {
          response.success = false;
          response.message = 'This payment request has been paid.';
          return response;
        }

        if (!isEmptyArray(response.responseBody.Data.payments)) {
          let dataVoucer = response.responseBody.Data.payments;
          for (let i = 0; i < dataVoucer.length; i++) {
            if (dataVoucer[i].isVoucher == true) {
              let find = await myVoucers.find(
                item => item.serialNumber == dataVoucer[i].serialNumber,
              );
              if (find != undefined) {
                find.paymentType = dataVoucer[i].paymentType;
                find.paymentAmount = dataVoucer[i].paymentAmount;
                find.isVoucher = dataVoucer[i].isVoucher;
                find.voucherId = dataVoucer[i].voucherId;
                find.serialNumber = dataVoucer[i].serialNumber;
                dataVoucer[i] = find;
              }
              find = undefined;
            }
          }

          response.responseBody.Data.dataVoucer = dataVoucer;
          return response;
        } else {
          response.responseBody.Data.dataVoucer = [];
          return response;
        }
      } else {
        response.message = 'Looks like you scan wrong QR Code.';
        if (response.responseBody.message != undefined) {
          response.message = response.responseBody.message;
        }
        return response;
      }
    } catch (error) {
      return error;
    }
  };
};

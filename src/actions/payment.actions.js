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

export const netsclickRegister = item => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get user details
      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      // let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      // userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const userId = '1111111';
      await NetsClick.Register({userId})
        .then(async r => {
          try {
            await AsyncStorage.setItem('@netsclick_register_status', userId);
          } catch (e) {}

          dispatch({
            type: 'NETSCLICK_STATUS',
            netsclickStatus: true,
          });

          if (item != undefined) {
            dispatch({
              type: 'SELECTED_ACCOUNT',
              selectedAccount: item,
            });
          }

          if (item == undefined) {
            setTimeout(() => {
              Alert.alert('NETS Click', 'NETS Click registration success!');
            }, 200);
          }
        })
        .catch(async e => {
          setTimeout(() => {
            Alert.alert(
              'Sorry',
              'NETS Click registration failed ' + e.toString(),
            );
          }, 200);
          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}
        });
    } catch (error) {
      return error;
    }
  };
};

export const netsclickDeregister = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      await NetsClick.Deregister()
        .then(async r => {
          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}

          dispatch({
            type: 'NETSCLICK_STATUS',
            netsclickStatus: false,
          });

          setTimeout(() => {
            Alert.alert('NETS Click', 'NETS Click account has been removed!');
          }, 200);
        })
        .catch(async e => {
          setTimeout(() => {
            Alert.alert('Sorry', 'NETS Click deregistration failed');
          }, 200);
          try {
            await AsyncStorage.removeItem('@netsclick_register_status');
          } catch (e) {}

          dispatch({
            type: 'NETSCLICK_STATUS',
            netsclickStatus: false,
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

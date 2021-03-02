import {fetchApi} from '../service/api';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {isEmptyArray} from '../helper/CheckEmpty';

export const getSVCBalance = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
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

      const payload = {
        customerId: `customer::${userDetails.id}`,
      };

      const response = await fetchApi(
        '/storevaluecard/summary',
        'POST',
        payload,
        200,
        token,
      );
      console.log('response balance SVC', response);

      if (response.success) {
        dispatch({
          type: 'SVC_BALANCE',
          balance: response.responseBody.data.balance,
          defaultBalance: response.responseBody.data.defaultBalance,
        });
      }
      return false;
    } catch (error) {
      return error;
    }
  };
};

export const getSVCCard = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApi(
        '/storevaluecard/load',
        'GET',
        null,
        200,
        token,
      );
      console.log('response get SVC card', response);
      if (response.success) {
        dispatch({
          type: 'SVC_CARD',
          svc: response.responseBody.data,
        });
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const svcActivity = (skip, take) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
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

      const payload = {
        skip,
        take,
        parameters: [
          {
            id: 'search',
            value: '_SVC',
          },
        ],
      };
      console.log(JSON.stringify(payload), 'payload');
      let response = await fetchApi(
        `/customer/activity/${userDetails.id}`,
        'POST',
        payload,
        200,
        token,
      );

      console.log(response, 'RESPONSE CUSTOMER ACTIVITY');

      if (response.success) {
        try {
          if (!isEmptyArray(response.responseBody.data)) {
            let data = [];
            data = response.responseBody.data;
            const dataLength = response.responseBody.dataLength;
            const actualLength = response.responseBody.data.length;

            if (data == undefined) {
              data = [];
            }

            return {data, dataLength, actualLength};
          } else {
            return [];
          }
        } catch (e) {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  };
};

export const svcHistory = (skip, take) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        skip: 0,
        take: 20,
        isDetail: true,
      };
      let response = await fetchApi(
        `/storevaluecard/history`,
        'POST',
        payload,
        200,
        token,
      );

      console.log(response, 'RESPONSE HISTORY SVC');

      if (response.success) {
        return response.responseBody.data;
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  };
};

export const transferSVC = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApi(
        `/storevaluecard/transfer`,
        'POST',
        payload,
        200,
        token,
      );

      console.log(response, 'RESPONSE TRANSFER SVC');

      return response;
    } catch (error) {
      return error;
    }
  };
};

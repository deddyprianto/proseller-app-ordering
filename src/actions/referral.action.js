import {fetchApi} from '../service/api';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

export const referral = () => {
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
          getUser: {userDetails},
        },
      } = state;

      // decrypt
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      let user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      console.log({user});

      const payload = {
        customerId: `customer::${user.id}`,
      };

      const response = await fetchApi('/referral', 'POST', payload, 200, token);
      console.log(response, 'response get referral');

      if (response.success) {
        dispatch({
          type: 'DATA_REFERRAL',
          referral: response.responseBody.Data,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export const addReferral = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        '/referral/create',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response add referral');

      if (response.success) {
        dispatch({
          type: 'DATA_REFERRAL',
          referral: response.responseBody.Data,
        });
        return response.responseBody.Data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const cancelReferral = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        `/referral/delete/${id}`,
        'DELETE',
        null,
        200,
        token,
      );
      console.log(response, 'response cancel referral');

      if (response.success) {
        dispatch({
          type: 'DATA_REFERRAL',
          referral: response.responseBody.Data,
        });
        return response.responseBody.Data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const resendReferral = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        `/referral/resend/${id}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, 'response resend referral');

      if (response.success) {
        return response.responseBody.Data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};
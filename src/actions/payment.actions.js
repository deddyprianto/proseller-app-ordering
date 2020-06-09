import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {fetchApiPayment} from '../service/apiPayment';

export const getAccountPayment = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
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

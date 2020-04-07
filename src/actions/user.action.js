import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

export const updateUser = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      console.log(payload, 'PAYLOAD EDIT');
      const response = await fetchApi(
        '/customer/updateProfile',
        'PUT',
        payload,
        200,
        token,
      );
      console.log('responsenya ', response);

      // encrypt user data before save to asyncstorage
      let dataUser = CryptoJS.AES.encrypt(
        JSON.stringify(response.responseBody.Data),
        awsConfig.PRIVATE_KEY_RSA,
      ).toString();

      if (response.success) {
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: dataUser,
        });
      }

      return response.success;
    } catch (error) {
      return error;
    }
  };
};

export const getUserProfile = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        '/customer/getProfile',
        'GET',
        null,
        200,
        token,
      );

      // encrypt user data before save to asyncstorage
      let dataUser = CryptoJS.AES.encrypt(
        JSON.stringify(response.responseBody.Data[0]),
        awsConfig.PRIVATE_KEY_RSA,
      ).toString();

      if (response.success) {
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: dataUser,
        });
      }

      return response.success;
    } catch (error) {
      return error;
    }
  };
};

export const deviceUserInfo = deviceID => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'GET_USER_DEVICE',
        deviceID: deviceID,
      });
    } catch (error) {
      return error;
    }
  };
};

export const defaultPaymentAccount = defaultAccount => {
  return async dispatch => {
    try {
      dispatch({
        type: 'GET_USER_DEFAULT_ACCOUNT',
        defaultAccount: defaultAccount,
      });
    } catch (error) {
      return error;
    }
  };
};

export const userPosition = userPosition => {
  return async dispatch => {
    try {
      dispatch({
        type: 'GET_USER_POSITION',
        userPosition: userPosition,
      });
    } catch (error) {
      return error;
    }
  };
};

export const movePageIndex = status => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'MOVE_PAGE_INDEX',
        status: status,
      });
    } catch (error) {
      return error;
    }
  };
};

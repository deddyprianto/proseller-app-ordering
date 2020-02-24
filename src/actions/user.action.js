import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

export const updateUser = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      console.log(JSON.stringify(payload));
      // await dispatch(refreshToken());
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      console.log(token);
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

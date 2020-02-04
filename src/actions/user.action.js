import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';

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
      if (response.success) {
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.Data,
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

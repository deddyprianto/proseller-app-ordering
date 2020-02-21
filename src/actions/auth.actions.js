/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {Alert} from 'react-native';
import awsConfig from '../config/awsConfig';
import {LoginManager} from 'react-native-fbsdk';

import {fetchApi} from '../service/api';

export const notifikasi = (type, status, action) => {
  Alert.alert(type, status, [
    {
      text: 'Ok',
      onPress: () => action,
      style: 'ok',
    },
  ]);
};

export const createNewUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });
      console.log('PAYLOAD CREATE');
      console.log(payload);
      const response = await fetchApi(
        '/customer/register',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response register');
      if (response.success) {
        dispatch({
          type: 'CREAT_USER_SUCCESS',
          dataRegister: payload,
        });
        return true;
      } else {
        return response.responseBody;
      }
    } catch (error) {
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const confirmUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CONFIRM_USER_LOADING',
      });
      const response = await fetchApi(
        '/customer/confirm',
        'POST',
        payload,
        200,
      );

      console.log(response, 'response confirm');

      if (response.success) {
        dispatch({
          type: 'CONFIRM_USER_SUCCESS',
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });
      console.log(payload, 'payload login');
      const response = await fetchApi('/customer/login', 'POST', payload, 200);

      console.log(response);

      if (response.responseBody.Data.accessToken != undefined) {
        let data = response.responseBody.Data;
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: data.accessToken.jwtToken,
          qrcode: data.accessToken.qrcode,
          exp: data.accessToken.payload.exp * 1000 - 2700000,
          refreshToken: data.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: data.idToken.payload,
        });
        console.log(response, 'response login user pool');
        return response.responseBody.Data;
      }
      return response.responseBody.Data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get user token
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      // get user details and phone ID
      const {
        userReducer: {
          getUser: {userDetails},
        },
        userReducer: {
          deviceUserInfo: {deviceID},
        },
      } = state;

      let payload = {
        phoneNumber: userDetails.phoneNumber,
        player_ids: deviceID,
      };
      // LoginManager.logOut();payload
      const response = await fetchApi(
        '/customer/logout',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response logout');
      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const getToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      return token;
    } catch (e) {
      console.log(e);
    }
  };
};

export const refreshToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    console.log(state, 'state nya');
    try {
      var payload = {
        refreshToken: state.authReducer.authData.refreshToken,
      };
      console.log('PAYLOAD REFRESH TOKEN ', payload);
      const response = await fetchApi('/auth/refresh', 'POST', payload, 200);
      console.log(response, 'response refresh token');
      var date = new Date();
      dispatch({
        type: 'REFRESH_TOKEN_USER',
        token: response.responseBody.Data.accessToken.jwtToken,
        refreshToken: payload.refreshToken,
        qrcode: state.authReducer.authData.qrcode,
        payload: state.authReducer.authData.payload,
        // isLoggedIn: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createNewUserOther = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });

      console.log(payload, 'createNewUserOther payload');
      const response = await fetchApi(
        '/customer/register',
        'POST',
        payload,
        200,
      );
      console.log(response, 'createNewUserOther');
      return true;
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginOther = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });

      var response;
      payload.type = 'identityPool';
      payload.username = payload.email;
      payload.tenantId = awsConfig.tenantId;
      response = await fetchApi('/customer/login', 'POST', payload, 200);
      // console.log(response, 'loginOther');
      dispatch({
        type: 'LOGIN_USER_SUCCESS',
      });

      if (response.responseBody.statusCustomer) {
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken.jwtToken,
          qrcode: response.responseBody.accessToken.qrcode,
          exp: response.responseBody.idToken.payload.exp * 1000 - 2700000,
          refreshToken: response.responseBody.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        console.log('selesai');
      }

      if (response.responseBody.message == 'Internal server error') {
        response = await fetchApi('/customer/login', 'POST', payload, 200);
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken.jwtToken,
          qrcode: response.responseBody.accessToken.qrcode,
          exp: response.responseBody.idToken.payload.exp * 1000 - 2700000,
          refreshToken: response.responseBody.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        console.log('selesai');
      }
      payload.statusCustomer = response.responseBody.statusCustomer;
      return payload;
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const checkAccountExist = payload => {
  return async dispatch => {
    try {
      const response = await fetchApi(
        '/customer/login/check-account',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response check account exist');
      if (response.success) {
        dispatch({
          type: 'DATA_ACCOUNT_EXIST',
          status: response.responseBody.Data.status,
        });
        return response.responseBody.Data;
      } else {
        throw response;
      }
    } catch (error) {
      return error;
    }
  };
};

export const sendOtpAttempts = attempt => {
  return async dispatch => {
    try {
      console.log(attempt, 'attempt lama');
      dispatch({
        type: 'ATTEMPT_SEND_OTP',
        attempt: attempt,
      });
    } catch (error) {
      return error;
    }
  };
};

export const sendOTP = payload => {
  return async dispatch => {
    try {
      const response = await fetchApi(
        '/customer/login/send-otp',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response send otp');
      if (response.success) {
        return response.responseBody.Data.status;
      } else {
        throw response;
      }
    } catch (error) {
      return error;
    }
  };
};

export const resendOTPCognito = payload => {
  return async dispatch => {
    try {
      const response = await fetchApi(
        '/customer/login/send-otp',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response send otp cognito');
      return response.responseBody.ResultCode;
    } catch (error) {
      return error;
    }
  };
};

export const confirmCodeOTP = payload => {
  return async dispatch => {
    try {
      console.log(payload, 'payload confirm otp cognito');
      const response = await fetchApi(
        '/customer/confirm',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response confirm otp cognito');
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const sendCodeConfirmation = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SEND_CODE_LOADING',
      });

      const response = await fetchApi(
        '/customer/forgotPassword/sendCode',
        'POST',
        payload,
        200,
      );
      console.log(response, 'sendCodeConfirmation');
      if (response.success) {
        dispatch({
          type: 'SEND_CODE_SUCCESS',
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'SEND_CODE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const confirmForgotPassword = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'SEND_CODE_LOADING',
      });

      const response = await fetchApi(
        '/customer/forgotPassword/confirm',
        'POST',
        payload,
        200,
      );
      console.log(response, 'confirmForgotPassword');
      if (response.success) {
        dispatch({
          type: 'CONFIRM_CODE_SUCCESS',
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'SEND_CODE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

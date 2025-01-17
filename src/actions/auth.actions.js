/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {Alert} from 'react-native';
import awsConfig from '../config/awsConfig';
import {fetchApi} from '../service/api';
import CryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEmptyArray} from '../helper/CheckEmpty';
import {submitOfflineCart, clearNetsclickData} from './order.action';
import {reportSentry} from '../helper/Sentry';
import persist from '../config/store';

const encryptData = value => {
  const result = CryptoJS.AES.encrypt(
    value,
    awsConfig.PRIVATE_KEY_RSA,
  ).toString();

  return result;
};

//valid
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
          status: response.responseBody.data,
        });
      }
      return response?.responseBody?.data;
    } catch (error) {
      return error;
    }
  };
};

export const notifikasi = (type, status, action) => {
  Alert.alert(type, status, [
    {
      text: 'OK',
      onPress: () => action,
      style: 'ok',
    },
  ]);
};

export const createNewUserByPassword = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });
      const response = await fetchApi(
        '/customer/registerByPassword',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response register by password');
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

export const sendOTP = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      // CHECK IF SETTING FOR OTP IS SEND BY WHATSAPP OR SMS
      const {
        orderReducer: {
          orderingSetting: {orderingSetting},
        },
      } = state;

      try {
        if (payload?.phoneNumber) {
          if (
            orderingSetting !== undefined &&
            !isEmptyArray(orderingSetting.settings)
          ) {
            const find = orderingSetting.settings.find(
              item => item.settingKey === 'MobileOTP',
            );

            if (find !== undefined) {
              if (find.settingValue === 'WHATSAPP') {
                payload.sendBy = 'WhatsappOTP';
              } else if (find.settingValue === 'SMS') {
                payload.sendBy = 'SMSOTP';
              }
            }
          }
        }
      } catch (e) {}

      // Give sender name if exist
      try {
        if (
          orderingSetting !== undefined &&
          !isEmptyArray(orderingSetting.settings)
        ) {
          const find = orderingSetting.settings.find(
            item => item.settingKey === 'senderName',
          );

          if (find !== undefined) {
            payload.senderName = find.settingValue;
          }
        }
      } catch (e) {}

      const response = await fetchApi(
        '/customer/login/send-otp',
        'POST',
        payload,
        200,
      );

      console.log('response send otp', response);

      if (response.success) {
        return response.responseBody.Data;
      } else {
        throw response;
      }
    } catch (error) {
      reportSentry('/customer/login/send-otp', payload, error);
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

      if (response?.responseBody?.data?.accessToken) {
        let data = response.responseBody.data;

        // encrypt data
        let jwtToken = encryptData(data.accessToken.jwtToken);
        let qrcode = encryptData(data.accessToken.qrcode);
        let refreshToken = encryptData(data.refreshToken.token);

        // Save backup data refresh token
        try {
          await AsyncStorage.setItem('refreshToken', data.refreshToken.token);
        } catch (error) {}

        // SUBMIT OFFLINE CART
        await dispatch(submitOfflineCart(jwtToken));

        // Remove Netsclick account on login
        await dispatch(clearNetsclickData(jwtToken));

        // Save Token User
        await dispatch({
          type: 'TOKEN_USER',
          token: jwtToken,
          refreshToken: refreshToken,
        });

        await dispatch({
          type: 'AUTH_USER_SUCCESS',
          qrcode: qrcode,
          exp: data.accessToken.payload.exp * 1000 - 2700000,
          token: jwtToken,
        });

        // encrypt user data before save to asyncstorage
        let dataUser = encryptData(JSON.stringify(data.idToken.payload));

        await dispatch({
          type: 'GET_USER_SUCCESS',
          payload: dataUser,
        });

        // save data to reducer
        await dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        console.log(response, 'response login user pool');
        return response.responseBody.Data;
      }

      return response.responseBody.data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

//valid
export const logoutUser = params => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get user token
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
        userReducer: {
          deviceUserInfo: {deviceID},
        },
      } = state;

      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(userDetails, awsConfig.PRIVATE_KEY_RSA);
      userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (params.isDeleteAccount) {
        let payloadDeleteAccount = {
          phoneNumber: userDetails.phoneNumber,
          deleted: true,
          status: 'SUSPENDED',
        };

        await fetchApi(
          '/customer/updateProfile',
          'PUT',
          payloadDeleteAccount,
          200,
          token,
        );
      }

      let payload = {
        phoneNumber: userDetails.phoneNumber,
        player_ids: deviceID,
      };
      // LoginManager.logOut();payload
      console.log(payload, 'ini payload logout');
      const response = await fetchApi(
        '/customer/logout',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response logout');
      dispatch({type: 'AUTH_USER_LOGOUT'});
      dispatch({
        type: 'AUTH_USER_FAIL',
      });

      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });

      const persistStore = persist();
      persistStore.persistor.purge();
      // remove default account
      dispatch({
        type: 'GET_USER_DEFAULT_ACCOUNT',
        defaultAccount: {},
      });
      await AsyncStorage.removeItem('refreshToken');
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
          tokenUser: {token},
        },
      } = state;
      return token;
    } catch (e) {
      console.log(e);
    }
  };
};

export const refreshToken = params => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      let {
        authReducer: {tokenUser},
      } = state;
      let _refreshToken = null;
      const backupRefreshToken = await AsyncStorage.getItem('refreshToken');

      // Decrypt token
      if (tokenUser?.refreshToken) {
        let bytes = CryptoJS.AES.decrypt(
          tokenUser.refreshToken,
          awsConfig.PRIVATE_KEY_RSA,
        );
        _refreshToken = bytes.toString(CryptoJS.enc.Utf8);
      }

      const payload = {
        refreshToken: _refreshToken || backupRefreshToken,
      };
      console.log('PAYLOAD REFRESH TOKEN ', payload);
      const response = await fetchApi('/auth/refresh', 'POST', payload, 200);
      console.log(response, 'response refresh token');

      // check if not authorized
      if (response.responseBody?.message === 'authorization error') {
        dispatch({
          type: 'USER_LOGGED_OUT_SUCCESS',
        });
      }

      // if success, then save data
      if (response.success) {
        // encrypt data
        const jwtToken = encryptData(
          response.responseBody.Data.accessToken.jwtToken,
        );
        const newRefreshToken = encryptData(
          response.responseBody.Data.refreshToken.token,
        );
        const qrcode = encryptData(
          response.responseBody.Data.accessToken.qrcode,
        );

        dispatch({
          type: 'TOKEN_USER',
          token: jwtToken,
          refreshToken: newRefreshToken,
        });

        params?.isRoot &&
          dispatch({
            type: 'REFRESH_TOKEN_USER',
            token: jwtToken,
            refreshToken: newRefreshToken,
            qrcode,
          });
      }
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: 'USER_LOGGED_OUT_SUCCESS',
      // });
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
        // encrypt data
        let jwtToken = response.responseBody.accessToken.jwtToken;
        let qrcode = response.responseBody.accessToken.qrcode;
        let refreshToken = response.responseBody.refreshToken.token;
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: jwtToken,
          qrcode: qrcode,
          exp: response.responseBody.idToken.payload.exp * 1000 - 2700000,
          refreshToken: refreshToken,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
      }

      if (response.responseBody.message === 'Internal server error') {
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
      reportSentry('customer/login', payload, error);
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

export const resendOTPCognito = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      // CHECK IF SETTING FOR OTP IS SEND BY WHATSAPP OR SMS
      try {
        const {
          orderReducer: {
            orderingSetting: {orderingSetting},
          },
        } = state;

        if (payload.phoneNumber != undefined) {
          if (
            orderingSetting !== undefined &&
            !isEmptyArray(orderingSetting.settings)
          ) {
            const find = orderingSetting.settings.find(
              item => item.settingKey === 'MobileOTP',
            );

            if (find != undefined) {
              if (find.settingValue === 'WHATSAPP') {
                payload.sendBy = 'WhatsappOTP';
              } else if (find.settingValue === 'SMS') {
                payload.sendBy = 'SMSOTP';
              }
            }
          }
        }
      } catch (e) {}

      const response = await fetchApi(
        '/customer/login/send-otp',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response send otp cognito');
      return response.responseBody.ResultCode;
    } catch (error) {
      reportSentry('customer/login/send-otp', payload, error);
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

//martin
export const loginSendOTP = payload => {
  return async dispatch => {
    try {
      const response = await fetchApi(
        '/customer/login/send-otp',
        'POST',
        payload,
        200,
      );
      console.log(response, 'response login send otp');

      if (response.success) {
        return true;
      }
    } catch (error) {
      reportSentry('customer/login/send-otp', payload, error);
      return error;
    }
  };
};

export const createNewUser = payload => {
  return async dispatch => {
    try {
      const requestOtp = {};
      if (payload?.registerMethod === 'email') {
        requestOtp.email = payload?.email;
      } else {
        requestOtp.phoneNumber = payload?.phoneNumber;
      }

      dispatch({
        type: 'CREATE_USER_LOADING',
      });

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
        dispatch(loginSendOTP(requestOtp));
        return true;
      } else {
        return response?.responseBody?.data;
      }
    } catch (error) {
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      reportSentry('customer/register', payload, error);
      return error;
    }
  };
};

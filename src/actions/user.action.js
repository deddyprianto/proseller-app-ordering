import {fetchApi} from '../service/api';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {fetchApiPayment} from '../service/apiPayment';
import {isEmptyArray} from '../helper/CheckEmpty';
import {Alert, Linking} from 'react-native';

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

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const requestOTP = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      // CHECK IF SETTING FOR OTP IS SEND BY WHATSAPP OR SMS
      try {
        const {
          orderReducer: {
            orderingSetting: {orderingSetting},
          },
        } = state;

        if (payload.newPhoneNumber != undefined) {
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

      console.log(payload, 'PAYLOAD REQUEST OTP');
      const response = await fetchApi(
        '/customer/updateProfile/?requestOtp=true',
        'PUT',
        payload,
        200,
        token,
      );

      console.log(response, 'RESPONSE REQUEST OTP');

      return response;
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

      const {
        userReducer: {
          deviceUserInfo: {deviceID},
        },
      } = state;

      const response = await fetchApi(
        '/customer/getProfile',
        'GET',
        null,
        200,
        token,
      );

      console.log('response get profile', response);
      // console.log('response get profile', deviceID);

      // check if user already logged in on another device
      try {
        if (
          response.responseBody.Data &&
          !isEmptyArray(response.responseBody.Data[0].player_ids)
        ) {
          if (deviceID !== undefined && deviceID !== null) {
            const find = response.responseBody.Data[0].player_ids.find(
              item => item === deviceID,
            );
            if (find === undefined) {
              Alert.alert(
                'Your session has ended...',
                'Looks like your account is already logged in on another device, we will end the session on this device.',
                [
                  {
                    text: 'Got it!',
                    onPress: () => {
                      dispatch({
                        type: 'USER_LOGGED_OUT_SUCCESS',
                      });

                      // remove default account
                      dispatch({
                        type: 'GET_USER_DEFAULT_ACCOUNT',
                        defaultAccount: {},
                      });
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }
        }
      } catch (e) {}

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
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      if (defaultAccount !== undefined) {
        const response = await fetchApiPayment(
          `/account/setdefault/${defaultAccount.accountID}`,
          'GET',
          null,
          200,
          token,
        );
        console.log(`/account/setdefault/${defaultAccount.id}`);
        console.log('responsenya set default payment account', response);
        if (response.success) {
          dispatch({
            type: 'GET_USER_DEFAULT_ACCOUNT',
            defaultAccount: defaultAccount,
          });
        }
      } else {
        dispatch({
          type: 'GET_USER_DEFAULT_ACCOUNT',
          defaultAccount: defaultAccount,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export const defaultAddress = defaultAddress => {
  return async dispatch => {
    try {
      dispatch({
        type: 'GET_USER_DEFAULT_ADDRESS',
        defaultAddress: defaultAddress,
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

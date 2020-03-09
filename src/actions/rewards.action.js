import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {refreshToken} from './auth.actions';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

export const campaign = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
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

      let companyId = userDetails.companyId;
      const response = await fetchApi(
        `/campaign/points?companyId=${companyId}`,
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response campign point');
      dispatch({
        type: 'DATA_ALL_CAMPAIGN',
        data: response.responseBody.Data[0],
      });
    } catch (error) {
      return error;
    }
  };
};

export const vouchers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      // const {
      //   rewardsReducer: {
      //     campaign: {
      //       campaign: {data},
      //     },
      //   },
      // } = state;

      var dataVoucher = [];

      let response = await fetchApi('/voucher', 'GET', false, 200, token);
      console.log(response, 'response voucher');
      if (response.success) {
        dataVoucher = response.responseBody.Data.filter(
          item => item.deleted == false,
        );
      }

      dispatch({
        type: 'DATA_ALL_VOUCHER',
        dataVoucher: dataVoucher,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getStamps = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApi(
        '/customer/stamps',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response getStamps');

      dispatch({
        type: 'DATA_STAMPS',
        dataStamps: response.responseBody.Data,
      });
    } catch (error) {
      return error;
    }
  };
};

export const setStamps = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApi(
        '/customer/stamps',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response.responseBody, 'response setStamps');
      return response.responseBody;
    } catch (error) {
      return error;
    }
  };
};

export const dataPoint = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      var dataResponse = [];
      console.log('/customer/point?history=false');
      let response = await fetchApi(
        '/customer/point?history=false',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response data point');
      let totalPoint = response.responseBody.Data.totalPoint;
      dispatch({
        type: 'DATA_TOTAL_POINT',
        totalPoint: totalPoint,
      });
    } catch (error) {
      return error;
    }
  };
};

export const redeemVoucher = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      console.log(payload, 'payload redeemVoucher');
      const response = await fetchApi(
        '/accummulation/point/redeem/voucher',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response redeem Voucer');
      return response;
    } catch (error) {
      throw error;
    }
  };
};

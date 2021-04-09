import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {refreshToken} from './auth.actions';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {isEmptyArray} from '../helper/CheckEmpty';

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
      let customerGroupId = userDetails.customerGroupId;
      let payload = {
        companyId,
        customerGroupId,
      };
      const response = await fetchApi(
        `/campaign/points?companyId=${companyId}&customerGroupId=${customerGroupId}`,
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

      if (response.success == true) {
        dispatch({
          type: 'DATA_STAMPS',
          dataStamps: response.responseBody.Data,
        });
      } else {
        dispatch({
          type: 'DATA_STAMPS',
          dataStamps: undefined,
        });
      }
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
      let response = await fetchApi(
        '/customer/point?history=false',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response data point');
      if (response.success == true) {
        let totalPoint = response.responseBody.Data.totalPoint;
        let campaignActive = response.responseBody.Data.campaignActive;
        let pendingPoints = 0;
        // check pending points
        if (
          response.responseBody.Data.pendingPoints != undefined &&
          response.responseBody.Data.pendingPoints != null
        ) {
          pendingPoints = response.responseBody.Data.pendingPoints;
        }

        dispatch({
          type: 'DATA_TOTAL_POINT',
          totalPoint: totalPoint,
          pendingPoints: pendingPoints,
          campaignActive,
          detailPoint: response.responseBody.Data,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export const dataPointHistory = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      var dataResponse = [];
      let response = await fetchApi(
        '/customer/point?history=true',
        'GET',
        false,
        200,
        token,
      );

      let totalPoint = response.responseBody.Data.totalPoint;
      let campaignActive = response.responseBody.Data.campaignActive;

      dispatch({
        type: 'DATA_TOTAL_POINT',
        totalPoint: totalPoint,
        campaignActive,
        detailPoint: response.responseBody.Data,
      });

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

export const cutomerActivity = (skip, take, isReceive) => {
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
            value: '_POINT',
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
            if (isReceive) {
              data = response.responseBody.data.filter(
                item =>
                  item.activityType == 'GET_POINT' ||
                  item.activityType == 'VOID_POINT_REDEEMED' ||
                  (item.activityType == 'ADJUST_POINT' && item.amount > 0),
              );
            } else {
              data = response.responseBody.data.filter(
                item =>
                  item.activityType == 'REDEEM_POINT' ||
                  item.activityType == 'VOID_POINT' ||
                  (item.activityType == 'ADJUST_POINT' && item.amount < 0),
              );
            }
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

export const checkPromo = codeVoucher => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApi(
        `/voucher/take/${codeVoucher}`,
        'GET',
        false,
        200,
        token,
      );
      console.log(`/voucher/take/${codeVoucher}`);
      console.log(response, 'response check promo');

      if (response.success) {
        if (isEmptyArray(response.responseBody.Data)) {
          return {
            status: false,
            message: response.responseBody.message || 'Promo Code Invalid!',
          };
        }

        response.responseBody.Data[0].status = true;
        return response.responseBody.Data[0];
      } else {
        return {
          status: false,
          message: response.responseBody.message || 'Promo Code Invalid!',
        };
      }
    } catch (error) {
      return error;
    }
  };
};

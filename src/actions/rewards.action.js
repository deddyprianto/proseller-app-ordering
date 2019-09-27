import {fetchApi} from '../service/api';
import * as _ from 'lodash';

export const campaign = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/campaign', 'GET', false, 200, token);
      console.log(response);
      // if(response.success){
      dispatch({
        type: 'DATA_ALL_CAMPAIGN',
        data: response.responseBody,
      });
      // } else {
      //   dispatch({
      //     type: "USER_LOGGED_OUT_SUCCESS"
      //   });
      // }
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
          authData: {token},
        },
      } = state;
      const {
        rewardsReducer: {
          campaign: {
            campaign: {data},
          },
        },
      } = state;
      var dataVoucher = [];

      await Promise.all(
        await data
          .filter(
            campaign =>
              campaign.deleted == false &&
              campaign.priority == true &&
              campaign.campaignType == 'point',
          )
          .map(async campaign => {
            let response = await fetchApi(
              '/campaign/' + campaign.id + '/vouchers',
              'GET',
              false,
              200,
              token,
            );
            console.log(response);
            if (response.success) {
              response.responseBody.data
                .filter(voucher => voucher.deleted == false)
                .map(async voucher => {
                  await dataVoucher.push(voucher);
                });
            }
          }),
      );

      dispatch({
        type: 'DATA_ALL_VOUCHER',
        dataVoucher: dataVoucher,
      });
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
          authData: {token},
        },
      } = state;
      const {
        rewardsReducer: {
          campaign: {
            campaign: {data},
          },
        },
      } = state;
      var dataResponse = [];
      let totalPoint = 0;

      await Promise.all(
        await data
          .filter(
            campaign =>
              campaign.deleted == false &&
              campaign.priority == true &&
              campaign.campaignType == 'point',
          )
          .map(async campaign => {
            let response = await fetchApi(
              '/campaign/' + campaign.id + '/points',
              'GET',
              false,
              200,
              token,
            );
            if (response.success) {
              response.responseBody.data
                .filter(point => point.deleted == false)
                .map(async point => {
                  await dataResponse.push(point);
                  var sisa = point.pointDebit - point.pointKredit;
                  totalPoint = totalPoint + sisa;
                });
            }
          }),
      );

      dispatch({
        type: 'DATA_TOTAL_POINT',
        totalPoint: totalPoint,
      });
      dispatch({
        type: 'DATA_POINT_TRANSACTION',
        pointTransaction: dataResponse,
      });
      dispatch({
        type: 'DATA_RECENT_TRANSACTION',
        recentTransaction: _.orderBy(dataResponse, ['created'], ['desc']).slice(
          0,
          3,
        ),
      });
    } catch (error) {
      return error;
    }
  };
};

export const refreshData = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      campaign();
      vouchers();
      dataPoint();
    } catch (error) {
      return error;
    }
  };
};

export const sendPayment = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/payment', 'POST', payload, 200, token);
      return response.responseBody;
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
          authData: {token},
        },
      } = state;
      const response = await fetchApi(
        '/accummulation/point/redeem/voucher',
        'POST',
        payload,
        200,
        token,
      );
      return response.responseBody;
    } catch (error) {
      throw error;
    }
  };
};

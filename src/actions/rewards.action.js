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
      console.log(response, 'response campign');
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

      // await Promise.all(
      //   await data
      //     .filter(
      //       campaign =>
      //         campaign.deleted == false &&
      //         campaign.priority == true &&
      //         campaign.campaignType == 'point',
      //     )
      //     .map(async campaign => {
      //       let response = await fetchApi(
      //         '/campaign/' + campaign.id + '/vouchers',
      //         'GET',
      //         false,
      //         200,
      //         token,
      //       );
      //       console.log(response);
      //       if (response.success) {
      //         response.responseBody.data
      //           .filter(voucher => voucher.deleted == false)
      //           .map(async voucher => {
      //             await dataVoucher.push(voucher);
      //           });
      //       }
      //     }),
      // );

      var dataVoucher = [];

      let response = await fetchApi(
        '/campaign/vouchers',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response voucher');
      if (response.success) {
        response.responseBody.data
          .filter(voucher => voucher.deleted == false)
          .map(async voucher => {
            await dataVoucher.push(voucher);
          });
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
          authData: {token},
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
        dataStamps: response.responseBody.data,
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
          authData: {token},
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

      // await Promise.all(
      //   await data
      //     .filter(
      //       campaign =>
      //         campaign.deleted == false &&
      //         campaign.priority == true &&
      //         campaign.campaignType == 'point',
      //     )
      //     .map(async campaign => {
      //       let response = await fetchApi(
      //         '/campaign/points',
      //         'GET',
      //         false,
      //         200,
      //         token,
      //       );
      //       if (response.success) {
      //         response.responseBody.data
      //           .filter(point => point.deleted == false)
      //           .map(async point => {
      //             await dataResponse.push(point);
      //             var sisa = point.pointDebit - point.pointKredit;
      //             totalPoint = totalPoint + sisa;
      //           });
      //       }
      //     }),
      // );

      var dataResponse = [];

      let response = await fetchApi(
        '/campaign/points',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response data point');
      if (response.success) {
        response.responseBody.data
          .filter(point => point.deleted == false)
          .map(async point => {
            await dataResponse.push(point);
            var sisa = point.pointDebit - point.pointKredit;
            totalPoint = totalPoint + sisa;
          });
      }

      let totalPoint =
        _.sumBy(dataResponse, 'pointDebit') -
        _.sumBy(dataResponse, 'pointKredit');

      dispatch({
        type: 'DATA_TOTAL_POINT',
        totalPoint: totalPoint,
      });
      dispatch({
        type: 'DATA_POINT_TRANSACTION',
        pointTransaction: _.orderBy(dataResponse, ['createdAt'], ['desc']),
      });
      dispatch({
        type: 'DATA_RECENT_TRANSACTION',
        recentTransaction: _.orderBy(
          dataResponse,
          ['createdAt'],
          ['desc'],
        ).slice(0, 3),
      });
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
      console.log(response, 'response send payment');
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
      console.log(response, 'response redeem Voucer');
      return response.responseBody;
    } catch (error) {
      throw error;
    }
  };
};

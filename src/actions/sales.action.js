import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {refreshToken} from './auth.actions';

export const dataTransaction = () => {
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

      let response = await fetchApi(
        '/customer/sales',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response sales');
      dataResponse = response.responseBody.Data;
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

      console.log(payload, 'payload sendPayment');
      const response = await fetchApi('/sales', 'POST', payload, 200, token);
      console.log(response, 'response send payment');
      var result = {
        responseBody: response.responseBody,
        success: response.success,
      };
      return result;
    } catch (error) {
      return error;
    }
  };
};

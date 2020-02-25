import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {refreshToken} from './auth.actions';

export const dataTransaction = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get token from reducer
      const {
        authReducer: {
          authData: {token},
        },
      } = state;

      // get take from reducer
      let {
        rewardsReducer: {
          dataPoint: {take},
        },
      } = state;

      take == undefined ? (take = 10) : take;

      console.log(take, 'ini take');
      console.log(`/customer/sales?take=${take}&page=1`);
      var dataResponse = [];

      let response = await fetchApi(
        `/customer/sales?take=${take}&page=1`,
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response sales');
      dataResponse = response.responseBody.Data;

      if (response.success) {
        let nextTake = take + 10;
        dispatch({
          type: 'DATA_POINT_TRANSACTION',
          pointTransaction: dataResponse,
          isSuccessGetTrx: response.success,
          dataLength: response.responseBody.DataLength,
          take: nextTake,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export const recentTransaction = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get token from reducer
      const {
        authReducer: {
          authData: {token},
        },
      } = state;

      var dataResponse = [];

      let response = await fetchApi(
        `/customer/sales?take=3&page=1`,
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response recent sales');
      dataResponse = response.responseBody.Data;

      if (response.success) {
        dispatch({
          type: 'DATA_RECENT_TRANSACTION',
          recentTransaction: dataResponse,
          isSuccessGetTrx: response.success,
        });
      }
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

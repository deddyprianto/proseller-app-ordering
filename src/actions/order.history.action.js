/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import {fetchApi} from '../service/api';
import {fetchApiOrder} from '../service/apiOrder';

export const getOrderHistoryPast = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        orderHistoryReducer: {take},
      } = state;

      const pageSize = !take ? 10 : take;

      const response = await fetchApi(
        `/customer/sales?take=${pageSize}&page=1`,
        'GET',
        false,
        200,
        token,
      );
      if (response.success) {
        dispatch({
          type: 'SET_ORDER_HISTORY_PAST',
          data: response.responseBody.data,
          take: pageSize + 10,
        });

        return response;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getOrderHistoryOngoing = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApiOrder(
        '/cart/pending',
        'POST',
        null,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'SET_ORDER_HISTORY_ONGOING',
          data: response?.response?.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

/**
 * Martin
 * martinwijaya97@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

const orderHistoryOngoing = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ORDER_HISTORY_ONGOING':
      return {
        data: action.data,
      };

    default:
      return state;
  }
};

const orderHistoryPast = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ORDER_HISTORY_PAST':
      return {
        ...action,
      };

    default:
      return state;
  }
};

export default combineReducers({
  orderHistoryOngoing,
  orderHistoryPast,
});

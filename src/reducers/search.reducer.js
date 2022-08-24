/**
 * Martin
 * martinwijaya97@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

const searchProductHistory = (state = [], action) => {
  switch (action.type) {
    case 'SET_SEARCH_PRODUCT_HISTORY':
      return action.data;

    default:
      return state;
  }
};

export default combineReducers({
  searchProductHistory,
});

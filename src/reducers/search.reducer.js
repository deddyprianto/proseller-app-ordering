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

const searchAddress = (state = [], action) => {
  switch (action.type) {
    case 'SAVE_AUTOCOMPLETE_ADDRESS':
      return action.page > 1 ? [...state, ...action.payload] : action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  searchProductHistory,
  searchAddress,
});

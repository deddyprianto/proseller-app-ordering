/**
 * Martin
 * martinwijaya97@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

const snackbar = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SNACKBAR':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  snackbar,
});

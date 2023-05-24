/**
 * Martin
 * martinwijaya97@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

export const ALLOWED_ORDER_TYPE = 'ALLOWED_ORDER_TYPE';

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

const colorSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_COLORS':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const imageSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_IMAGES':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const loginSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_LOGIN_METHOD':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const allowedOrder = (state = {}, action) => {
  switch (action.type) {
    case ALLOWED_ORDER_TYPE:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

export default combineReducers({
  snackbar,
  imageSettings,
  colorSettings,
  loginSettings,
  allowedOrder,
});

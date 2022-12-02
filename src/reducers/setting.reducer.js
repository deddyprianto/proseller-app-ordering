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

const termsAndConditionsSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TERMS_AND_CONDITIONS':
      return {
        ...action.data,
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
  termsAndConditionsSettings,
});

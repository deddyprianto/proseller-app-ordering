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

const faqsSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FAQS':
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

const enableOrderingSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ENABLE_ORDERING':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const hideReferralSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_HIDE_REFERRAL':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const bannerSizeSettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_BANNER_SIZE':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

const privacyPolicySettings = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PRIVACY_POLICY':
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
  faqsSettings,
  enableOrderingSettings,
  hideReferralSettings,
  bannerSizeSettings,
  privacyPolicySettings,
  allowedOrder,
});

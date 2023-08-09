/**
 * Martin
 * martinwijaya97@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

export const ALLOWED_ORDER_TYPE = 'ALLOWED_ORDER_TYPE';

const snackbar = (state = {}, action) => {
  if (action.type === 'SET_SNACKBAR') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const colorSettings = (state = {}, action) => {
  if (action.type === 'SET_COLORS') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const imageSettings = (state = {}, action) => {
  if (action.type === 'SET_IMAGES') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const loginSettings = (state = {}, action) => {
  if (action.type === 'SET_LOGIN_METHOD') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const faqsSettings = (state = {}, action) => {
  if (action.type === 'SET_FAQS') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const allowedOrder = (state = {}, action) => {
  if (action.type === ALLOWED_ORDER_TYPE) {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const enableOrderingSettings = (state = {}, action) => {
  if (action.type === 'SET_ENABLE_ORDERING') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const hideReferralSettings = (state = {}, action) => {
  if (action.type === 'SET_HIDE_REFERRAL') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const bannerSizeSettings = (state = {}, action) => {
  if (action.type === 'SET_BANNER_SIZE') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const privacyPolicySettings = (state = {}, action) => {
  if (action.type === 'SET_PRIVACY_POLICY') {
    return {
      ...action.data,
    };
  } else {
    return state;
  }
};

const dialCodeSettings = (state = {}, action) => {
  if (action.type === 'SET_DIAL_CODES') {
    return action.data;
  } else {
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
  dialCodeSettings,
  allowedOrder,
});

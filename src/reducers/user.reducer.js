/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

const defaultValue = {
  addressTags: ['Home', 'Work', 'Office', 'Store'],
};

const getUser = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        userDetails: null,
        errors: null,
      };

    case 'GET_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        userDetails: action.payload,
        errors: null,
      };

    case 'GET_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        userDetails: null,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const updateUser = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        userDetails: null,
        errors: null,
      };

    case 'UPDATE_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        userDetails: action.payload,
        errors: null,
      };

    case 'UPDATE_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        userDetails: null,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const deviceUserInfo = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_DEVICE':
      return {
        deviceID: action.deviceID,
      };

    default:
      return state;
  }
};

const orderType = (state = {}, action) => {
  switch (action.type) {
    case 'ORDER_TYPE':
      return {
        orderType: action.orderType,
      };

    default:
      return state;
  }
};

const offlineCart = (state = {}, action) => {
  switch (action.type) {
    case 'OFFLINE_CART':
      return {
        offlineCart: action.product,
      };

    default:
      return state;
  }
};

const defaultPaymentAccount = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_DEFAULT_ACCOUNT':
      return {
        defaultAccount: action.defaultAccount,
      };

    default:
      return state;
  }
};

const selectedAddress = (state = {}, action) => {
  switch (action.type) {
    case 'SELECTED_ADDRESS':
      return {
        selectedAddress: action.selectedAddress,
      };

    default:
      return state;
  }
};

const addressTags = (state = {}, action) => {
  switch (action?.type) {
    case 'SET_ADDRESS_TAGS':
      const data = action?.data || defaultValue?.addressTags;
      return {
        tags: data,
      };

    default:
      return state;
  }
};

const defaultAddress = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_DEFAULT_ADDRESS':
      return {
        defaultAddress: action.defaultAddress,
      };

    default:
      return state;
  }
};

const userPosition = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_POSITION':
      return {
        userPosition: action.userPosition,
      };

    default:
      return state;
  }
};

const statusPageIndex = (state = {}, action) => {
  switch (action.type) {
    case 'MOVE_PAGE_INDEX':
      return {
        status: action.status,
      };

    default:
      return state;
  }
};

const getCompanyInfo = (state = {}, action) => {
  switch (action.type) {
    case 'GET_COMPANY_INFO':
      return {
        companyInfo: action.companyInfo,
      };

    default:
      return state;
  }
};

const customFields = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_MANDATORY_FIELDS':
      return {
        fields: action.fields,
      };

    default:
      return state;
  }
};

export default combineReducers({
  getUser,
  updateUser,
  deviceUserInfo,
  userPosition,
  statusPageIndex,
  getCompanyInfo,
  defaultPaymentAccount,
  orderType,
  defaultAddress,
  selectedAddress,
  offlineCart,
  customFields,
  addressTags,
});

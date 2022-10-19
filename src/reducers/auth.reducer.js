/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';

const authData = (state = {}, action) => {
  switch (action.type) {
    case 'AUTH_USER_SUCCESS':
      return {
        token: action.token,
        qrcode: action.qrcode,
        refreshToken: action.refreshToken,
        payload: action.payload,
        tokenExp: action.exp,
        isLoggedIn: true,
        waiting: false,
      };

    case 'REFRESH_TOKEN_USER':
      return {
        token: action.token,
        qrcode: action.qrcode,
        refreshToken: action.refreshToken,
        payload: action.payload,
        isLoggedIn: true,
        waiting: false,
      };

    case 'AUTH_USER_FAIL':
      return {
        token: null,
        qrcode: null,
        isLoggedIn: false,
        waiting: false,
      };

    case 'WAITING_USER_CODE':
      return {
        token: null,
        isLoggedIn: false,
        waiting: true,
      };

    case 'AUTH_USER_LOGOUT':
      return {
        token: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

const createUser = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };

    case 'CREAT_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
        dataRegister: action.dataRegister,
      };

    case 'CREAT_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const loginUser = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };

    case 'LOGIN_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
        payload: action.payload,
      };

    case 'LOGIN_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const confirmUser = (state = {}, action) => {
  switch (action.type) {
    case 'CONFIRM_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };

    case 'CONFIRM_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      };

    case 'CONFIRM_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.errors,
      };

    default:
      return state;
  }
};

const attemptSendOTP = (state = {}, action) => {
  switch (action.type) {
    case 'ATTEMPT_SEND_OTP':
      return {
        attempt: action.attempt,
      };

    default:
      return state;
  }
};

const sendCodeConfirmation = (state = {}, action) => {
  switch (action.type) {
    case 'SEND_CODE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };

    case 'SEND_CODE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      };

    case 'SEND_CODE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const confirmForgotPassword = (state = {}, action) => {
  switch (action.type) {
    case 'SEND_CODE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };

    case 'CONFIRM_CODE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      };

    case 'SEND_CODE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const tokenUser = (state = {}, action) => {
  switch (action.type) {
    case 'TOKEN_USER':
      return {
        token: action.token,
        refreshToken: action.refreshToken,
      };

    default:
      return state;
  }
};

export default combineReducers({
  createUser,
  loginUser,
  authData,
  confirmUser,
  sendCodeConfirmation,
  confirmForgotPassword,
  attemptSendOTP,
  tokenUser,
});

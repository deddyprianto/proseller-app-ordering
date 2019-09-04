/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import { combineReducers } from 'redux';

const authData = (state = {}, action) => {
  switch (action.type) {
    case "AUTH_USER_SUCCESS":
      return {
        token: action.token,
        payload: action.payload,
        isLoggedIn: true,
        waiting: false
      }

    case "AUTH_USER_FAIL":
      return {
        token: null,
        isLoggedIn: false,
        waiting: false
      }

    case "WAITING_USER_CODE":
        return {
          token: null,
          isLoggedIn: false,
          waiting: true
        }
    default:
      return state;
  }
}

const createUser = (state = {}, action) => {
  switch (action.type) {

    case "CREATE_USER_LOADING":
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      }

    case "CREAT_USER_SUCCESS":
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null
      }

    case "CREAT_USER_FAIL":
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload
      }

    default:
      return state;
  }
}

const loginUser = (state = {}, action) => {
  switch (action.type) {

    case "LOGIN_USER_LOADING":
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null
      }

    case "LOGIN_USER_SUCCESS":
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
        payload: action.payload
      }

    case "LOGIN_USER_FAIL":
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload
      }

    default:
      return state;
  }
}

const confirmUser = (state = {}, action) => {
  switch (action.type) {

    case "CONFIRM_USER_LOADING":
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null
      }

    case "CONFIRM_USER_SUCCESS":
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      }

    case "CONFIRM_USER_FAIL":
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.errors
      }

    default:
      return state;
  }
}

export default combineReducers({
  createUser,
  loginUser,
  authData,
  confirmUser
});

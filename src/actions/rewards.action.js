import {fetchApi} from "../service/api";

export const getCampaign = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const response = await fetchApi("/campaign", "GET", false, 200);
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}

export const getVouchers = (campaignid) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const response = await fetchApi("/campaign/"+campaignid+"/vouchers", "GET", false, 200);
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}

export const getDataPointByCampaignID = (campaignid) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const response = await fetchApi("/campaign/"+campaignid+"/points", "GET", false, 200, token);
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}

export const sendPayment = (payload) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const response = await fetchApi("/accummulation/point", "POST", payload, 200, token);
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}
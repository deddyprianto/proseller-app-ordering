import {fetchApi} from "../service/api";
import * as _ from 'lodash';

export const campaign = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const response = await fetchApi("/campaign", "GET", false, 200);
      dispatch({
        type: "DATA_ALL_CAMPAIGN",
        data: response.responseBody
      });
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}

export const vouchers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const {rewardsReducer: {campaign: {campaign: {count, data}}}} = state;
      var dataVoucher = [];
      var status;
      if(count > 0){
        for (let i = 0; i < count; i++) {
          const voucher =  await fetchApi("/campaign/"+data[i].id+"/vouchers", "GET", false, 200, token);
          status = voucher.success;
          if(status){
            for (let j = 0; j < voucher.responseBody.count; j++) {
              dataVoucher.push(voucher.responseBody.data[j])
            }
          }
        }

        dispatch({
          type: "DATA_ALL_VOUCHER",
          dataVoucher: dataVoucher
        });
      }
    } catch (error) {
      return error;
    }
  }
}

export const dataPoint = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const {rewardsReducer: {campaign: {campaign: {count, data}}}} = state;
      var dataResponse = [];
      var recentTampung = [];
      let totalPoint = 0;
      var status;
      if(count > 0){
        for (let i = 0; i < count; i++) {
          const response =  await fetchApi("/campaign/"+data[i].id+"/points", "GET", false, 200, token);
          status = response.success;
          if(status){
            for (let j = 0; j < response.responseBody.count; j++) {
              dataResponse.push(response.responseBody.data[j]);
              var sisa = response.responseBody.data[j].pointDebit - response.responseBody.data[j].pointKredit;
              totalPoint = totalPoint + sisa;
            }
          }
        }
        if(_.orderBy(dataResponse, ['created'], ['desc']).length > 0){
          for (let i = 0; i < 3; i++) {
            recentTampung.push(_.orderBy(dataResponse, ['created'], ['desc'])[i])
          }
        }

        dispatch({
          type: "DATA_TOTAL_POINT",
          totalPoint: totalPoint
        });
        dispatch({
          type: "DATA_POINT_TRANSACTION",
          pointTransaction: dataResponse,
        });
        dispatch({
          type: "DATA_RECENT_TRANSACTION",
          recentTransaction: recentTampung,
        });
      }
      return status;
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
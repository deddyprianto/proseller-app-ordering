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
          if(data[i].deleted == false){
            const voucher =  await fetchApi("/campaign/"+data[i].id+"/vouchers", "GET", false, 200, token);
            status = voucher.success;
            if(status){
              for (let j = 0; j < voucher.responseBody.count; j++) {
                if(voucher.responseBody.data[j].deleted == false){
                  dataVoucher.push(voucher.responseBody.data[j])
                }
              }
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
      let totalPoint = 0;
      var status;
      
      await Promise.all(await data.filter(campaign => campaign.deleted == false && campaign.priority == true).map(async campaign => {
        let response =  await fetchApi("/campaign/"+campaign.id+"/points", "GET", false, 200, token);
        status = response.success;
          if(status){
            response.responseBody.data.filter(point => point.deleted == false).map(async point => {
              
              await dataResponse.push(point)
              var sisa = point.pointDebit - point.pointKredit;
              totalPoint = totalPoint + sisa;
            })
          }
      }) );
      
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
        recentTransaction: _.orderBy(dataResponse, ['created'], ['desc']).slice(0, 3)
      });
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
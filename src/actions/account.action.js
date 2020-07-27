import {fetchApi} from '../service/api';
// import {refreshToken} from './auth.actions';
// import * as _ from 'lodash';

export const myVoucers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApi(
        '/customer/vouchers',
        'GET',
        false,
        200,
        token,
      );
      console.log(response.responseBody.Data, 'response myVoucers');
      var dataVouchers = response.responseBody.Data;

      dispatch({
        type: 'DATA_MY_VOUCHERS',
        data: dataVouchers,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getMandatoryFields = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const DOCUMENT = 'customer';

      const response = await fetchApi(
        `/mandatoryfield/${DOCUMENT}`,
        'GET',
        false,
        200,
        token,
      );

      console.log('response mandatory field', response);

      if (response.success) {
        dispatch({
          type: 'DATA_MANDATORY_FIELDS',
          fields: response.responseBody.data.fields,
        });
        return response.responseBody.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

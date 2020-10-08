import {fetchApi} from '../service/api';
import {isEmptyArray} from '../helper/CheckEmpty';
// import {refreshToken} from './auth.actions';
// import * as _ from 'lodash';
import format from 'date-fns/format';

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
      console.log(response, 'response myVoucers');
      var dataVouchers = response.responseBody.Data;

      try {
        if (!isEmptyArray(dataVouchers)) {
          for (let i = 0; i < dataVouchers.length; i++) {
            if (
              dataVouchers[i].expiryDate != undefined &&
              dataVouchers[i].expiryDate != null
            ) {
              dataVouchers[i].uniqueID =
                format(new Date(dataVouchers[i].expiryDate), 'dd MMM yyyy') +
                ' ' +
                dataVouchers[i].id;
            } else {
              dataVouchers[i].uniqueID = null;
            }
          }
        }
      } catch (e) {}

      dispatch({
        type: 'DATA_MY_VOUCHERS',
        data: dataVouchers,
      });
    } catch (error) {
      return error;
    }
  };
};

export const afterPayment = status => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'AFTER_PAYMENT',
        data: status,
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

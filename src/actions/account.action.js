import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';
import * as _ from 'lodash';

export const myVoucers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          authData: {token},
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

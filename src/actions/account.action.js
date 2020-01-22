import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';

export const myVoucers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      await dispatch(refreshToken());
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
      console.log(response, 'response myVoucers');
      dispatch({
        type: 'DATA_MY_VOUCHERS',
        data: response.responseBody,
      });
    } catch (error) {
      return error;
    }
  };
};

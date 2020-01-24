import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';

export const dataPromotion = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/promotion', 'GET', false, 200, token);
      console.log(response, 'response promotion');
      dispatch({
        type: 'DATA_ALL_PROMOTION',
        data: response.responseBody,
      });
    } catch (error) {
      return error;
    }
  };
};

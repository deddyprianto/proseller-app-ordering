import {fetchApi} from '../service/api';
import {refreshToken} from './auth.actions';

export const dataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      await dispatch(refreshToken());
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/store', 'GET', false, 200, token);
      console.log(response, 'response store');
      dispatch({
        type: 'DATA_ALL_STORES',
        data: response.responseBody,
      });
    } catch (error) {
      return error;
    }
  };
};

import {fetchApiMasterData} from '../service/apiMasterData';
import {refreshToken} from './auth.actions';

export const dataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApiMasterData(
        '/outlets/load',
        'POST',
        false,
        200,
        token,
      );
      console.log(response.response.data, 'response outlets');
      dispatch({
        type: 'DATA_ALL_STORES',
        data: response.response.data,
      });
    } catch (error) {
      return error;
    }
  };
};

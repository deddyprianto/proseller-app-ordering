import {fetchApiMasterData} from '../service/apiMasterData';
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
      const response = await fetchApiMasterData(
        '/promobanners/load',
        'POST',
        false,
        200,
        token,
      );
      console.log(response, 'response promotion');
      if (response.success) {
        dispatch({
          type: 'DATA_ALL_PROMOTION',
          data: response.response.data,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

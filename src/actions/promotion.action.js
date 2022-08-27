import {fetchApiMasterData} from '../service/apiMasterData';
import {refreshToken} from './auth.actions';

export const dataPromotion = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiMasterData(
        '/promobanners/load',
        'POST',
        false,
        200,
        token,
      );

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

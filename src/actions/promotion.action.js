import {fetchApiMasterData} from '../service/apiMasterData';

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
        const filterResponse = response.response.data.filter(
          row => row.type === 'app',
        );
        dispatch({
          type: 'DATA_ALL_PROMOTION',
          data: filterResponse,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

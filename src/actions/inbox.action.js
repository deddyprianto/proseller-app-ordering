import {fetchApi} from '../service/api';

export const dataInbox = (skip, take) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        skip,
        take,
      };

      const response = await fetchApi(
        '/broadcast/customer',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response inbox');

      let data = [];

      if (response.success) {
        try {
          data = response.responseBody;
          data.skip = skip + take;
          data.take = take;
        } catch (e) {
          data = {};
          data.Data = [];
        }
        await dispatch({
          type: 'DATA_ALL_BROADCAST',
          data: data,
        });
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

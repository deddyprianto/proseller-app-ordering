import {fetchApi} from '../service/api';

export const contactUsHandle = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();

      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const url = `/send-feedback`;
      const response = await fetchApi(url, 'POST', payload, 200, token);
      return response;
    } catch (e) {
      if (__DEV__) {
        console.log(e, 'error');
      }
    }
  };
};

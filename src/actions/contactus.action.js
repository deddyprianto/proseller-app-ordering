import {fetchApi} from '../service/api';

export const contactUsHandle = payload => {
  return async (dispatch, getState) => {
    console.log(payload);
    try {
      const state = getState();

      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      console.log(token, 'token');
      const url = `/crm/api/send-feedback`;
      const response = await fetchApi(url, 'POST', payload, 200, token);
      console.log(response, 'lili');
    } catch (e) {}
  };
};

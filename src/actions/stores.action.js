import {fetchApi} from "../service/api";

export const getDataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const response = await fetchApi("/store", "GET", false, 200, token);
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}
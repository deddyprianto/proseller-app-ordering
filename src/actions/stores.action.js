import {fetchApi} from "../service/api";

export const dataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const response = await fetchApi("/store", "GET", false, 200, token);
      dispatch({
          type: "DATA_ALL_STORES",
          data: response.responseBody
      });
      return response.responseBody;
    } catch (error) {
      return error;
    }
  }
}
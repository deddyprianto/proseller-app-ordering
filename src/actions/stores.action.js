import {fetchApi} from "../service/api";

export const dataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {authReducer: {authData: {token}}} = state;
      const response = await fetchApi("/store", "GET", false, 200, token);
      if(response.success){
        dispatch({
          type: "DATA_ALL_STORES",
          data: response.responseBody
        });
      } else {
        dispatch({
          type: "USER_LOGGED_OUT_SUCCESS"
        });
      }
    } catch (error) {
      return error;
    }
  }
}
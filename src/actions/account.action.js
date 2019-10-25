import {fetchApi} from '../service/api';

export const myVoucers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi(
        '/customer/vouchers',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response myVoucers');
      // if(response.success){
      dispatch({
        type: 'DATA_MY_VOUCHERS',
        data: response.responseBody,
      });
      // } else {
      //   dispatch({
      //     type: "USER_LOGGED_OUT_SUCCESS"
      //   });
      // }
    } catch (error) {
      return error;
    }
  };
};

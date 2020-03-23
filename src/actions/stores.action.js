import {fetchApiMasterData} from '../service/apiMasterData';
import {refreshToken} from './auth.actions';

export const getCompanyInfo = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiMasterData(
        '/info/company',
        'GET',
        null,
        200,
        token,
      );
      console.log('responsenya company info', response);

      // // encrypt user data before save to asyncstorage
      // let dataUser = CryptoJS.AES.encrypt(
      //   JSON.stringify(response.responseBody.Data),
      //   awsConfig.PRIVATE_KEY_RSA,
      // ).toString();
      //
      // if (response.success) {
      //   dispatch({
      //     type: 'GET_USER_SUCCESS',
      //     payload: dataUser,
      //   });
      // }
      //
      // return response.success;
    } catch (error) {
      return error;
    }
  };
};

export const dataStores = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApiMasterData(
        '/outlets/load',
        'POST',
        false,
        200,
        token,
      );
      console.log(response.response.data, 'response outlets');
      dispatch({
        type: 'DATA_ALL_STORES',
        data: response.response.data,
      });
    } catch (error) {
      return error;
    }
  };
};

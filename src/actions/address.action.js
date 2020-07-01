import {fetchApiMasterData} from '../service/apiMasterData';
import awsConfig from '../config/awsConfig';

export const getAddress = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const countryCode = awsConfig.COUNTRY_CODE;
      let response = await fetchApiMasterData(
        `/addresslocation/${countryCode}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, `response get address location`);

      if (response.success) {
        return response.response.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getCityAddress = city => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const countryCode = awsConfig.COUNTRY_CODE;
      let response = await fetchApiMasterData(
        `/addresslocation/` + countryCode + `/${city}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, `response get address location`);

      if (response.success) {
        return response.response.data;
      } else {
        return false;
      }
    } catch (e) {}
  };
};

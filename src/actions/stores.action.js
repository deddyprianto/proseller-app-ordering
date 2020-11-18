import {fetchApiMasterData} from '../service/apiMasterData';
import {refreshToken} from './auth.actions';
import {fetchApiOrder} from '../service/apiOrder';
import {isEmptyObject} from '../helper/CheckEmpty';

export const getCompanyInfo = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const response = await fetchApiMasterData(
        '/info/company',
        'GET',
        null,
        200,
        null,
      );
      console.log('responsenya company info', response);

      if (response.success) {
        dispatch({
          type: 'GET_COMPANY_INFO',
          companyInfo: response.response.data,
        });
      }

      return response;
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

export const getDefaultOutlet = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const {
        userReducer: {
          userPosition: {userPosition},
        },
      } = state;

      let payload = {};
      if (!isEmptyObject(userPosition) && !isEmptyObject(userPosition.coords)) {
        payload.latitude = userPosition.coords.latitude;
        payload.longitude = userPosition.coords.longitude;
      }

      const response = await fetchApiMasterData(
        '/outlets/nearestoutlet',
        'POST',
        !isEmptyObject(payload) ? payload : false,
        200,
        token,
      );
      console.log(response.response.data, 'response default outlets');
      if (response.success) {
        dispatch({
          type: 'DATA_DEFAULT_OUTLET',
          data: response.response.data,
        });
      } else {
        dispatch({
          type: 'DATA_DEFAULT_OUTLET',
          data: {},
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export const getOutletById = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApiMasterData(
        `/outlets/get/${id}`,
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response outlets get by id');
      dispatch({
        type: 'DATA_DEFAULT_OUTLET',
        data: response.response.data,
      });

      if (response.success == true) {
        return response.response.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const setSingleOutlet = outlet => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'ONE_OUTLET',
        data: outlet,
      });
    } catch (error) {
      return error;
    }
  };
};

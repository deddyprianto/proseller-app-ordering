import {fetchApiMasterData} from '../service/apiMasterData';
import {isEmptyObject} from '../helper/CheckEmpty';
import {fetchApi} from '../service/api';
import appConfig from '../config/appConfig';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

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

      const {
        orderReducer: {
          orderingSetting: {orderingSetting},
        },
      } = state;

      let outletSelectionMode = 'DEFAULT';
      if (
        orderingSetting !== undefined &&
        orderingSetting.settings !== undefined
      ) {
        const find = orderingSetting.settings.find(
          item => item.settingKey === 'OutletSelection',
        );
        if (find !== undefined) {
          outletSelectionMode = find.settingValue;
        }
      }

      if (outletSelectionMode === 'Customer Select Manually')
        outletSelectionMode = 'MANUAL';

      let payload = {};
      if (!isEmptyObject(userPosition) && !isEmptyObject(userPosition.coords)) {
        payload.latitude = userPosition.coords.latitude;
        payload.longitude = userPosition.coords.longitude;
      }

      let response = {};
      if (outletSelectionMode === 'DEFAULT') {
        response = await fetchApiMasterData(
          '/outlets/defaultoutlet',
          'GET',
          null,
          200,
          token,
        );
      } else if (outletSelectionMode === 'NEAREST') {
        console.log(payload, 'payload');
        response = await fetchApiMasterData(
          '/outlets/nearestoutlet',
          'POST',
          !isEmptyObject(payload) ? payload : false,
          200,
          token,
        );
      }
      console.log(response, 'response default outlets');
      dispatch({
        type: 'OUTLET_SELECTION_MODE',
        outletSelectionMode: outletSelectionMode,
      });

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

export const setDefaultOutlet = outlet => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'DATA_DEFAULT_OUTLET',
        data: outlet,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getBackupOutlet = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiMasterData(
        '/outlets/defaultoutlet',
        'GET',
        null,
        200,
        token,
      );

      console.log(response, 'response default outlets');

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

//martin
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

      //Noted need to update from product
      dispatch({
        type: 'DATA_ALL_STORES',
        data: response.response.data,
      });
      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

export const getFavoriteOutlet = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        '/favorite-outlet',
        'GET',
        false,
        200,
        token,
      );
      dispatch({
        type: 'DATA_FAVORITE_OUTLET',
        data: response.responseBody.data,
      });

      if (response.success === true) {
        return response.responseBody.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const setFavoriteOutlet = ({outletId}) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        outlet: outletId,
      };

      await fetchApi('/favorite-outlet', 'POST', payload, 201, token);

      await dispatch(getFavoriteOutlet());

      return;
    } catch (error) {
      return error;
    }
  };
};

export const unsetFavoriteOutlet = ({outletId}) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      await fetchApi(
        `/favorite-outlet/${outletId}`,
        'DELETE',
        null,
        204,
        token,
      );

      await dispatch(getFavoriteOutlet());

      return;
    } catch (error) {
      return error;
    }
  };
};

export const getOutletById = id => {
  return async dispatch => {
    try {
      const response = await fetchApiMasterData(
        `/outlets/get/${id}`,
        'GET',
        false,
        200,
        null,
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

export const generateOneMapToken = () => {
  return async dispatch => {
    try {
      const url = `${appConfig.oneMapBaseUrl}/privateapi/auth/post/getToken`;
      const checkToken = await AsyncStorage.getItem('onemapToken');
      const {expiry_timestamp} = JSON.parse(checkToken);
      const todayStamp = moment().valueOf();
      // console.log(todayStamp, 'supil');
      const body = {
        email: 'gilang@edgeworks.com.sg',
        password: 'YHR6fne!zbk*buf6gqh',
      };
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log(data, 'silatan');
      if (data?.access_token) {
        AsyncStorage.setItem('onemapToken', JSON.stringify(data));
      }
    } catch (error) {
      return error;
    }
  };
};

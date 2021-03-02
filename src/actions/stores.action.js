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
      return response.response.data;
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

// import axios from 'axios';
// import config from '../../config';

import {isEmptyArray} from '../helper/CheckEmpty';
import {ALLOWED_ORDER_TYPE} from '../reducers/setting.reducer';
import {fetchApiOrder} from '../service/apiOrder';

const handleDataType = ({settings, key}) => {
  const result = settings?.filter(item => item.dataType === key);
  return result;
};
const handleSettingValue = ({values, key}) => {
  const result = values?.find(value => value?.settingKey === key)?.settingValue;
  return result;
};

const setData = ({data, type}) => {
  return {
    type: type,
    data: data,
  };
};

const setColorSettings = async ({dispatch, colors}) => {
  if (!isEmptyArray(colors)) {
    const primaryColor = handleSettingValue({
      values: colors,
      key: 'PrimaryColor',
    });
    const secondaryColor = handleSettingValue({
      values: colors,
      key: 'SecondaryColor',
    });
    const backgroundColor = handleSettingValue({
      values: colors,
      key: 'BackgroundColor',
    });
    const navigationColor = handleSettingValue({
      values: colors,
      key: 'NavigationColor',
    });
    const textButtonColor = handleSettingValue({
      values: colors,
      key: 'TextButtonColor',
    });
    const textWarningColor = handleSettingValue({
      values: colors,
      key: 'TextWarningColor',
    });
    const fontColor = handleSettingValue({values: colors, key: 'FontColor'});

    await dispatch(
      setData({
        type: 'SET_COLORS',
        data: {
          primaryColor,
          secondaryColor,
          backgroundColor,
          fontColor,
          navigationColor,
          textButtonColor,
          textWarningColor,
        },
      }),
    );
  }
};

const setImageSettings = async ({dispatch, images}) => {
  if (!isEmptyArray(images)) {
    const productPlaceholderImage = handleSettingValue({
      values: images,
      key: 'ProductPlaceholder',
    });

    await dispatch(
      setData({
        type: 'SET_IMAGES',
        data: {
          productPlaceholderImage,
        },
      }),
    );
  }
};

const setLoginSettings = async ({dispatch, response}) => {
  const loginByEmail = handleSettingValue({
    values: response,
    key: 'LoginByEmail',
  });

  const loginByMobile = handleSettingValue({
    values: response,
    key: 'LoginByMobile',
  });

  await dispatch(
    setData({
      type: 'SET_LOGIN_METHOD',
      data: {
        loginByEmail,
        loginByMobile,
      },
    }),
  );
};

export const getColorSettings = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiOrder(
        '/orderingsetting/app',
        'GET',
        null,
        200,
        token,
      );

      const settings = response?.response?.data?.settings;
      const typeColorPicker = handleDataType({settings, key: 'colorpicker'});
      const typeImage = handleDataType({settings, key: 'image'});

      if (settings) {
        setImageSettings({dispatch, images: typeImage});
        setColorSettings({dispatch, colors: typeColorPicker});
      }

      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

export const getLoginSettings = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiOrder(
        '/orderingsetting/app',
        'GET',
        null,
        200,
        token,
      );

      const settings = response?.response?.data?.settings;
      const typeCheckbox = handleDataType({settings, key: 'checkbox'});

      if (settings) {
        setLoginSettings({dispatch, response: typeCheckbox});
      }

      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

export const getAllowedOrder = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApiOrder(
        '/orderingsetting/app',
        'GET',
        null,
        200,
        token,
      );
      const {data} = response.response;
      const findAllowedOrder = data?.settings.find(
        setting => setting.settingKey === 'AllowedOrderingMode',
      );
      dispatch({
        type: ALLOWED_ORDER_TYPE,
        payload: findAllowedOrder,
      });
    } catch (error) {
      return error;
    }
  };
};

export const showSnackbar = ({message, type}) => {
  return async dispatch => {
    await dispatch(setData({data: {message, type}, type: 'SET_SNACKBAR'}));
  };
};

export const closeSnackbar = () => {
  return async dispatch => {
    await dispatch(
      setData({
        data: {},
        type: 'SET_SNACKBAR',
      }),
    );
  };
};

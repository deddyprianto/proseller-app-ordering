// import axios from 'axios';
// import config from '../../config';

import {isEmptyArray} from '../helper/CheckEmpty';
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
      const typeCheckbox = handleDataType({settings, key: 'checkbox'});

      if (settings) {
        setColorSettings({dispatch, colors: typeColorPicker});
        setLoginSettings({dispatch, response: typeCheckbox});
      }

      return response.response.data;
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

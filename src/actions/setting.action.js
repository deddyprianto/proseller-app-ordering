// import axios from 'axios';
// import config from '../../config';

import {isEmptyArray} from '../helper/CheckEmpty';
import {fetchApiOrder} from '../service/apiOrder';
import {setColorSettings} from '../theme/theme';

const colorFinder = ({colors, key}) => {
  const result = colors?.find(value => value?.settingKey === key)?.settingValue;
  return result;
};

export const setData = ({data, type}) => {
  return {
    type: type,
    data: data,
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

      const colors = response?.response?.data?.settings?.filter(
        item => item.dataType === 'colorpicker',
      );

      if (!isEmptyArray(colors)) {
        const primaryColor = colorFinder({colors, key: 'PrimaryColor'});
        const secondaryColor = colorFinder({colors, key: 'SecondaryColor'});
        const backgroundColor = colorFinder({colors, key: 'BackgroundColor'});
        const fontColor = colorFinder({colors, key: 'FontColor'});
        const navigationColor = colorFinder({colors, key: 'NavigationColor'});
        const textButtonColor = colorFinder({colors, key: 'TextButtonColor'});
        const textWarningColor = colorFinder({colors, key: 'TextWarningColor'});

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

      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

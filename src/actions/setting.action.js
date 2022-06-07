// import axios from 'axios';
// import config from '../../config';

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

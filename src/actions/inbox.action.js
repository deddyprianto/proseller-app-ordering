import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {AsyncStorage} from 'react-native';

export const dataInbox = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/broadcas', 'GET', false, 200, token);
      const data = [...response.responseBody.data];
      var count = 0;
      for (let index = 0; index < data.length; index++) {
        var isi = await AsyncStorage.getItem(
          '@inbox' + data[index].id,
          (err, res) => {
            if (res) {
              data[index].read = true;
              count = count + 1;
            }
          },
        );
      }

      var kirim = {
        listInbox: [...data],
        noRead: data.length - count,
      };
      // console.log(kirim, 'action');

      await dispatch({
        type: 'DATA_ALL_BROADCAS',
        data: kirim,
      });
    } catch (error) {
      return error;
    }
  };
};

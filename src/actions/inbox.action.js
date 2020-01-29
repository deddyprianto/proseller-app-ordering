import {fetchApi} from '../service/api';
import * as _ from 'lodash';
import {AsyncStorage} from 'react-native';
import {refreshToken} from './auth.actions';

export const dataInbox = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/broadcast', 'GET', false, 200, token);
      console.log(response, 'response inbox');

      if (response.success) {
        // const data = [...response.responseBody.Data];
        // var count = 0;
        // for (let index = 0; index < data.length; index++) {
        //   var isi = await AsyncStorage.getItem(
        //     '@inbox' + data[index].id,
        //     (err, res) => {
        //       if (res) {
        //         data[index].read = true;
        //         count = count + 1;
        //       }
        //     },
        //   );
        // }
        //
        // var kirim = {
        //   listInbox: [...data],
        //   noRead: data.length - count,
        // };
        // console.log(kirim, 'response kirim inbox');
        // await dispatch({
        //   type: 'DATA_ALL_BROADCAS',
        //   data: kirim,
        // });
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

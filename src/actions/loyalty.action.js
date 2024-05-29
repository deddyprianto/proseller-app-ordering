import {Alert} from 'react-native'
import {fetchApiLoyalty} from '../service/apiLoyalty';

export const postRetrieveAplicableVouchers = (payload, type) => {
    return async (dispatch, getState) => {
      const state = getState();
      try {
        const {
          authReducer: {
            tokenUser: {token},
          },
        } = state;
        const response = await fetchApiLoyalty(
          `/order/applicable-vouchers/${type}`,
          'POST',
          payload,
          token,
        );

        if (response.success) {
          return response.response;
        } else {
          Alert.alert(
            "Error Retrieving Vouchers",
            `${response.message}. Code: ${response.code}`,
          )
          return false;
        }
      } catch (error) {
        return error;
      }
    };
  };
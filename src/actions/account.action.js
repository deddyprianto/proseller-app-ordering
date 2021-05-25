import {fetchApi} from '../service/api';
import {isEmptyArray} from '../helper/CheckEmpty';
// import {refreshToken} from './auth.actions';
// import * as _ from 'lodash';
import format from 'date-fns/format';
import {fetchApiMasterData} from '../service/apiMasterData';

export const myVoucers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // await dispatch(refreshToken());
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApi(
        '/customer/vouchers',
        'GET',
        false,
        200,
        token,
      );
      console.log(response, 'response myVoucers');
      var dataVouchers = response.responseBody.Data;

      try {
        if (!isEmptyArray(dataVouchers)) {
          for (let i = 0; i < dataVouchers.length; i++) {
            if (
              dataVouchers[i].expiryDate != undefined &&
              dataVouchers[i].expiryDate != null
            ) {
              dataVouchers[i].uniqueID =
                format(new Date(dataVouchers[i].expiryDate), 'dd MMM yyyy') +
                ' ' +
                dataVouchers[i].id;
            } else {
              dataVouchers[i].uniqueID = dataVouchers[i].id;
            }
          }
        }
      } catch (e) {}

      dispatch({
        type: 'DATA_MY_VOUCHERS',
        data: dataVouchers,
      });
    } catch (error) {
      return error;
    }
  };
};

export const afterPayment = status => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'AFTER_PAYMENT',
        data: status,
      });
    } catch (error) {
      return error;
    }
  };
};

export const paymentRefNo = data => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'PAYMENT_REF_NO',
        data: data,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getMandatoryFields = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const DOCUMENT = 'customer';

      const response = await fetchApi(
        `/mandatoryfield/${DOCUMENT}`,
        'GET',
        false,
        200,
        null,
      );

      const responseCutomFields = await fetchApiMasterData(
        `/customfields/${DOCUMENT}`,
        'GET',
        false,
        200,
        null,
      );

      console.log('response custom field', responseCutomFields.response.data);

      let fields = response.responseBody.data.fields;
      const customFields = responseCutomFields.response.data;
      if (!isEmptyArray(fields)) {
        for (let i = 0; i < fields.length; i++) {
          for (let j = 0; j < customFields.length; j++) {
            if (fields[i].fieldName === customFields[j].fieldName) {
              fields[i].dataType = customFields[j].dataType;
              fields[i].defaultValue = customFields[j].defaultValue;

              if (customFields[j].dataType === 'dropdown') {
                let itemDropDown = customFields[j].items;
                for (let x = 0; x < itemDropDown.length; x++) {
                  itemDropDown[x].label = itemDropDown[x].text;
                }
                fields[i].items = itemDropDown;
              }
            }
          }
        }
      }

      if (response.success) {
        dispatch({
          type: 'DATA_MANDATORY_FIELDS',
          fields: fields,
        });
        return fields;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
};

import {fetchApiProduct} from '../service/apiProduct';
import {fetchApiOrder} from '../service/apiOrder';
import {isEmptyArray} from '../helper/CheckEmpty';
import * as _ from 'lodash';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

export const getProductByOutlet = (OutletId, refresh) => {
  return async dispatch => {
    try {
      const PRESET_TYPE = 'app';

      const response = await fetchApiProduct(
        `/productpreset/load/${PRESET_TYPE}/${OutletId}`,
        'POST',
        null,
        200,
        null,
      );

      const product = {
        id: OutletId,
        products: response.response.data,
        dataLength: response.response.dataLength,
      };

      dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: product,
      });

      return response;
    } catch (error) {
      dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: {},
      });
      return error;
    }
  };
};

export const getCategoryByOutlet = (OutletId, refresh) => {
  return async () => {
    try {
      const PRESET_TYPE = 'app';

      const payload = {
        skip: 0,
        take: 100,
      };

      let response = await fetchApiProduct(
        `/productpreset/loadcategory/${PRESET_TYPE}/${OutletId}`,
        'POST',
        payload,
        200,
        null,
      );

      if (response.success === true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

export const getProductByCategory = (OutletId, categoryId, skip, take) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      if (userDetails !== undefined && userDetails !== null && isLoggedIn) {
        let bytes = CryptoJS.AES.decrypt(
          userDetails,
          awsConfig.PRIVATE_KEY_RSA,
        );
        userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }

      const payload = {
        skip,
        take,
      };

      if (isLoggedIn) {
        payload.customerGroupId = userDetails.customerGroupId;
      }

      const PRESET_TYPE = 'app';

      let response = await fetchApiProduct(
        `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${categoryId}`,
        'POST',
        payload,
        200,
        null,
      );

      if (response.success === true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

export const productByCategory = (OutletId, category, skip, take, search) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      if (userDetails !== undefined && userDetails !== null && isLoggedIn) {
        let bytes = CryptoJS.AES.decrypt(
          userDetails,
          awsConfig.PRIVATE_KEY_RSA,
        );
        userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }

      let payload = {};

      if (search !== undefined) {
        payload = {
          skip,
          take,
          outletID: `outlet::${OutletId}`,
          sortBy: 'name',
          sortDirection: 'asc',
          filters: [
            {
              id: 'search',
              value: search,
            },
          ],
        };
      } else {
        payload = {
          skip,
          take,
          outletID: `outlet::${OutletId}`,
          sortBy: 'name',
          sortDirection: 'asc',
          categoryID: `category::${category.id}`,
        };
      }

      if (isLoggedIn) {
        payload.customerGroupId = userDetails.customerGroupId;
      }

      const response = await fetchApiProduct(
        '/product/load/',
        'POST',
        payload,
        200,
        token,
      );

      if (response.success === true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

export const searchProducts = (OutletId, categories, query) => {
  return async () => {
    try {
      const payload = {
        skip: 0,
        take: 100,
        sortBy: 'name',
        sortDirection: 'asc',
        parameters: [
          {
            key: 'name',
            value: query,
          },
        ],
      };

      const PRESET_TYPE = 'app';

      let searchResults = [];

      for (let i = 0; i < categories.length; i++) {
        let response = await fetchApiProduct(
          `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${
            categories[i].id
          }`,
          'POST',
          payload,
          200,
          null,
        );

        if (response.success && !isEmptyArray(response.response.data)) {
          searchResults = [...searchResults, ...response.response.data];
        }
      }

      return searchResults;
    } catch (e) {
      console.log(e);
    }
  };
};

export const getBasket = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      let {
        userReducer: {
          offlineCart: {offlineCart},
        },
      } = state;

      let response = {};

      if (isLoggedIn !== true) {
        try {
          if (isEmptyArray(offlineCart.details)) {
            offlineCart = undefined;
          }
        } catch (e) {}

        response = {
          success: true,
          response: {
            data: offlineCart,
          },
        };
      } else {
        response = await fetchApiOrder(
          '/cart/getcart',
          'GET',
          null,
          200,
          token,
        );
      }
      if (response.success === false) {
        dispatch({
          type: 'DATA_BASKET',
          product: undefined,
        });
      } else {
        dispatch({
          type: 'DATA_BASKET',
          product: response.response.data,
        });
        // check if ordering mode is exist (cart has submitted)
        let order = response.response.data;
        if (order.orderingMode !== undefined && order.tableNo !== undefined) {
          dispatch({
            type: 'ORDER_TYPE',
            orderType: order.orderingMode,
          });
        }
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

//martin
export const getProductBySearch = ({outletId, search}) => {
  return async (dispatch, getState) => {
    try {
      const payload = {
        skip: 0,
        take: 100,
        outletID: outletId,
        filters: [
          {
            id: 'search',
            value: search,
          },
        ],
      };

      let response = await fetchApiProduct(
        '/product/load/',
        'POST',
        payload,
        200,
        null,
      );

      if (response?.response?.data) {
        return response?.response?.data;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getProductEStoreByOutlet = (OutletId, refresh) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetchApiProduct(
        `/productpreset/load/eStore/${OutletId}`,
        'POST',
        null,
        200,
        null,
      );

      const product = {
        id: OutletId,
        products: response?.response?.data,
        dataLength: response?.response?.dataLength,
      };

      dispatch({
        type: 'DATA_PRODUCTS_ESTORE_OUTLET',
        products: product,
      });

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getProductByBarcode = barcode => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        storesReducer: {
          defaultOutlet: {defaultOutlet},
        },
      } = state;

      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      let {
        userReducer: {
          getUser: {userDetails},
        },
      } = state;

      // Decrypt data user
      if (userDetails !== undefined && userDetails !== null && isLoggedIn) {
        let bytes = CryptoJS.AES.decrypt(
          userDetails,
          awsConfig.PRIVATE_KEY_RSA,
        );
        userDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }

      let payload = {};

      if (isLoggedIn) {
        payload.customerGroupId = userDetails.customerGroupId;
      }

      let response = await fetchApiProduct(
        `/product/getbybarcode/${defaultOutlet.id}/${barcode}`,
        'POST',
        payload,
        200,
        null,
      );

      console.log('RESPONSE GET PRODUCT BY BARCODE ', response);

      if (response.success === true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

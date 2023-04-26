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

      await dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: response.response,
      });

      return response.response.data;
    } catch (error) {
      dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: [],
      });
      return error;
    }
  };
};

export const getProductCategories = ({outletId}) => {
  return async dispatch => {
    try {
      const payload = {
        skip: 0,
        take: 100,
        parentCategoryID: null,
        sortBy: 'name',
        sortDirection: 'asc',
        outletID: `outlet::${outletId}`,
      };

      const response = await fetchApiProduct(
        '/category/load',
        'POST',
        payload,
        200,
        null,
      );

      if (response?.response?.data) {
        await dispatch({
          type: 'DATA_PRODUCT_CATEGORIES',
          categories: response.response.data,
        });
        return response.response.data;
      }

      return false;
    } catch (error) {
      return error;
    }
  };
};

export const getProductSubCategories = ({
  categoryId,
  outletId,
  searchQuery,
}) => {
  return async dispatch => {
    try {
      const payload = {
        skip: 0,
        take: 100,
        sortBy: 'name',
        sortDirection: 'asc',
        outletID: `outlet::${outletId}`,
        parentCategoryID: `category::${categoryId}`,
        search: {
          product: searchQuery,
        },
      };

      const response = await fetchApiProduct(
        '/category/load',
        'POST',
        payload,
        200,
        null,
      );

      if (response?.response?.data) {
        await dispatch({
          type: 'DATA_PRODUCT_SUB_CATEGORIES',
          subCategories: response.response.data,
        });
        return response.response.data;
      }

      return null;
    } catch (error) {
      return error;
    }
  };
};

export const getProductBySubCategory = ({
  outletId,
  subCategoryId,
  searchQuery,
}) => {
  return async dispatch => {
    try {
      const payload = {
        skip: 0,
        take: 100,
        sortBy: 'name',
        sortDirection: 'asc',
        outletID: `outlet::${outletId}`,
        categoryID: `category::${subCategoryId}`,
        filters: [
          {
            id: 'search',
            value: searchQuery,
          },
        ],
      };

      const response = await fetchApiProduct(
        '/product/load',
        'POST',
        payload,
        200,
        null,
      );

      if (response?.response?.data) {
        await dispatch({
          type: 'DATA_PRODUCTS_BY_SUB_CATEGORY',
          products: response.response.data,
        });
        return response.response.data;
      }

      return false;
    } catch (error) {
      return error;
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

export const getProductBySearch = ({outletId, search, categoryId, skip}) => {
  return async () => {
    try {
      const payload = {
        skip: skip,
        take: 20,
        outletID: outletId,
        filters: [
          {
            id: 'search',
            value: search,
          },
        ],
      };

      if (categoryId) {
        payload.categoryID = `category::${categoryId}`;
      }

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

      if (response.success === true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

import {fetchApiProduct} from '../service/apiProduct';
import {fetchApiOrder} from '../service/apiOrder';
import {isEmptyArray} from '../helper/CheckEmpty';
import * as _ from 'lodash';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {reportSentry} from '../helper/Sentry';

const getUserDetail = userDetail => {
  let result = null
  if (userDetail) {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));
  }
  return result;
};

export const getProductByOutlet = (OutletId, refresh) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const dataUser = getUserDetail(state?.userReducer?.getUser?.userDetails);
      const PRESET_TYPE = 'app';
      const body = {
        customerGroupId: dataUser?.customerGroupId,
      };
      const response = await fetchApiProduct(
        `/productpreset/load/${PRESET_TYPE}/${OutletId}`,
        'POST',
        dataUser ? body : {},
        200,
        null,
      );
      await dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: response?.response || [],
      });
      console.log({response, body}, 'log state 2');
      return response?.response || [];
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
      let payload = {
        skip: 0,
        take: 100,
        sortBy: 'name',
        sortDirection: 'asc',
        outletID: `outlet::${outletId}`,
        categoryID: `category::${subCategoryId}`,
      };

      if (searchQuery && typeof searchQuery === 'string') {
        payload = {
          ...payload,
          filters: [
            {
              id: 'search',
              value: searchQuery,
            },
          ],
        };
      }

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
      reportSentry('cart/getcart', null, error);
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

export const getProductById = id => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const dataUser = getUserDetail(state?.userReducer?.getUser?.userDetails);
      const dataOutlet = state?.storesReducer?.defaultOutlet?.defaultOutlet;
      const url = dataUser ?
        `/product/${id}?customerGroupId=${dataUser?.customerGroupId}&outlet=${dataOutlet?.id}` :
        `/product/${id}?outlet=${dataOutlet?.id}`;
      const response = await fetchApiProduct(
        url,
        'GET',
        null,
        200,
        null,
      );

      if (response.success) {
        const data = response.response.data;

        const productModifiers = data?.productModifiers.map(row => {
          return {
            modifier: row,
            modifierID: row.id,
            modifierName: row.name,
          };
        });

        const result = {...data, productModifiers};
        return result;
      }
    } catch (error) {
      return error;
    }
  };
};

export const productByPromotion = ({promotionId, outletId}) => {
  return async (dispatch, getState) => {
    try {
      const payload = {
        outletId,
      };

      const response = await fetchApiProduct(
        '/promotion/items/' + promotionId,
        'POST',
        payload,
        200,
        null,
      );

      console.log('RESPONSE GET PRODUCTS BY PROMOTION ', response);

      if (response.success) {
        return response?.response?.data;
      } else {
        return [];
      }
    } catch (e) {}
  };
};

import {fetchApiProduct} from '../service/apiProduct';
import {fetchApiOrder} from '../service/apiOrder';
import {fetchApiPayment} from '../service/apiPayment';
import {fetchApi} from '../service/api';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import * as _ from 'lodash';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import appConfig from '../config/appConfig';

export const getProductByOutlet = (OutletId, refresh) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      // get previous data products outlet
      const {
        orderReducer: {
          productsOutlet: {products},
        },
      } = state;

      const PRESET_TYPE = 'app';

      let response = await fetchApiProduct(
        `/productpreset/load/${PRESET_TYPE}/${OutletId}`,
        'POST',
        null,
        200,
        null,
      );

      // console.log(response, 'response data product by outlet');
      if (response.success == true) {
        // get previous data products and concat it
        let outletProduct;
        if (products != undefined) {
          outletProduct = products;
          // if this action is called from refresh method, then remove previous data, and replace with new data
          if (refresh == true) {
            outletProduct = await outletProduct.filter(
              item => item.id != OutletId,
            );
          }
        } else {
          outletProduct = [];
        }

        let product = {
          id: OutletId,
          products: response.response.data,
          dataLength: response.response.dataLength,
        };
        outletProduct.push(product);
        dispatch({
          type: 'DATA_PRODUCTS_OUTLET',
          products: outletProduct,
        });
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getCategoryByOutlet = (OutletId, refresh) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

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

      console.log('RESPONSE GET CATEGORY ', response);

      if (response.success == true) {
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

      const payload = {
        skip,
        take,
      };

      if (isLoggedIn) {
        payload.customerGroupId = userDetails.customerGroupId;
      }

      // console.log(payload, 'payload product preset');

      const PRESET_TYPE = 'app';
      // console.log(
      //   `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${categoryId}`,
      //   '`/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${categoryId}`',
      // );
      let response = await fetchApiProduct(
        `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${categoryId}`,
        'POST',
        payload,
        200,
        null,
      );

      console.log('RESPONSE GET ITEMS BY CATEGORY ', response);

      if (response.success == true) {
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

      if (search != undefined) {
        payload = {
          skip,
          take,
          outletID: `outlet::${OutletId}`,
          sortBy: 'name',
          sortDirection: 'asc',
          // categoryID: `category::${category.id}`,
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

      // console.log('RESPONSE GET PRODUCTS BY CATEGORY ', response);

      if (response.success == true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

export const searchProducts = (OutletId, categories, query) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

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

      console.log('RESPONSE GET SEARCH ITEMS ', searchResults);

      return searchResults;
    } catch (e) {
      console.log(e);
    }
  };
};

export const removeProducts = () => {
  return async dispatch => {
    try {
      dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: undefined,
        dataLength: 0,
      });
    } catch (error) {
      return error;
    }
  };
};

export const setOrderType = type => {
  return async dispatch => {
    try {
      dispatch({
        type: 'ORDER_TYPE',
        orderType: type,
      });
    } catch (error) {
      return error;
    }
  };
};

export const setTableType = type => {
  return async dispatch => {
    try {
      dispatch({
        type: 'TABLE_TYPE',
        tableType: type,
      });
    } catch (error) {
      return error;
    }
  };
};

export const clearTableType = type => {
  return async dispatch => {
    try {
      dispatch({
        type: 'TABLE_TYPE',
        tableType: undefined,
      });
    } catch (error) {
      return error;
    }
  };
};

export const submitOder = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      // get table type
      const {
        userReducer: {
          orderType: {orderType},
        },
      } = state;

      payload.orderingMode = orderType;

      console.log('payload submit order ', payload);
      let response = await fetchApiOrder(
        '/cart/submit',
        'POST',
        payload,
        200,
        token,
      );

      console.log(response, 'response submit order');
      let results = response.response;
      if (results.resultCode == 200 && results.status != 'FAILED') {
        dispatch({
          type: 'DATA_BASKET',
          product: response.response.data,
        });
      }
      return response.response;
    } catch (error) {
      return error;
    }
  };
};

export const removeBasket = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
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

      if (isLoggedIn !== true) {
        dispatch({
          type: 'OFFLINE_CART',
          product: undefined,
        });
        return {
          success: true,
        };
      }

      // add real data
      let response = await fetchApiOrder(
        '/cart/delete',
        'DELETE',
        null,
        200,
        token,
      );

      console.log(response, 'response delete basket');
      if (response?.success) {
        await dispatch({
          type: 'DATA_BASKET',
          product: {},
        });
      }
      // remove table type
      await dispatch({
        type: 'TABLE_TYPE',
        tableType: undefined,
      });
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const makePayloadUpdate = async (basket, products) => {
  try {
    let payload = [];
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      let find = await basket.details.find(data => data.id === product.id);
      let dataproduct = {
        id: find.id,
        productID: find.productID,
        unitPrice: product.product.retailPrice,
        quantity: product.quantity,
      };

      if (product.remark !== '' && product.remark !== undefined) {
        dataproduct.remark = product.remark;
      }

      if (!isEmptyArray(product.product.productModifiers)) {
        console.log(product.product.productModifiers);
        let totalModifier = 0;
        let productModifiers = [...product.product.productModifiers];
        dataproduct.modifiers = productModifiers;

        let tempDetails = [];
        for (let i = 0; i < dataproduct.modifiers.length; i++) {
          tempDetails = [];
          let data = dataproduct.modifiers[i];

          for (let j = 0; j < data.modifier.details.length; j++) {
            if (
              data.modifier.details[j].quantity !== undefined &&
              data.modifier.details[j].quantity > 0
            ) {
              // check if price is undefined
              if (data.modifier.details[j].price === undefined) {
                data.modifier.details[j].price = 0;
              }
              tempDetails.push(data.modifier.details[j]);
            }
          }

          // if not null, then replace details
          dataproduct.modifiers[i].modifier.details = tempDetails;
        }

        //  calculate total modifier
        await dataproduct.modifiers.forEach(group => {
          group.modifier.details.forEach(detail => {
            if (detail.quantity !== undefined && detail.quantity > 0) {
              totalModifier += parseFloat(detail.quantity * detail.price);
            }
          });
        });

        // check if item modifier was deleted, if yes, then remove array modifier
        dataproduct.modifiers = await _.remove(dataproduct.modifiers, group => {
          return group.modifier.details.length > 0;
        });

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }
      console.log(dataproduct);

      payload.push(dataproduct);
    }
    return payload;
  } catch (e) {
    return {};
  }
};

export const clearNetsclickData = token => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      let listCard = await fetchApiPayment('/account', 'GET', null, 200, token);
      listCard = listCard.response.data;

      listCard = listCard.filter(item => item.paymentID === 'Netsclick');

      for (let i = 0; i < listCard.length; i++) {
        await fetchApiPayment(
          `/account/delete/${listCard[i].accountID}`,
          'DELETE',
          null,
          200,
          token,
        );
      }
    } catch (error) {
      return error;
    }
  };
};

export const submitOfflineCart = token => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        userReducer: {
          offlineCart: {offlineCart},
        },
      } = state;

      let response = {};

      if (offlineCart !== undefined) {
        for (let i = 0; i < offlineCart.details.length; i++) {
          let responseAddItem = await fetchApiOrder(
            '/cart/additem',
            'POST',
            offlineCart,
            200,
            token,
          );
          console.log(responseAddItem, 'responseAddItem');
        }
      }
    } catch (error) {
      return error;
    }
  };
};

export const moveCart = deliveryAddress => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;

      let payload = {
        orderBy: 'provider',
        cart: product,
        deliveryAddress,
      };

      let response = await fetchApiOrder(
        '/cart/moveItem',
        'POST',
        payload,
        200,
        token,
      );
      console.log(payload, 'payload moveCart');
      console.log(response, 'response moveCart');
      if (response.success == false) {
        return false;
      } else {
        dispatch({
          type: 'DATA_BASKET',
          product: response.response.data,
        });
      }

      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

export const updateSurcharge = orderingMode => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        orderingMode,
      };

      let response = await fetchApiOrder(
        '/cart/changeOrderingMode',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response update surcharge');
      if (response.success == true) {
        dispatch({
          type: 'DATA_BASKET',
          product: response.response.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getPendingCart = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      let response = await fetchApiOrder(
        '/cart/pending',
        'POST',
        null,
        200,
        token,
      );
      console.log(response, 'response get pending cart');
      if (response.success == false) {
        dispatch({
          type: 'DATA_CART',
          product: undefined,
        });
      } else {
        dispatch({
          type: 'DATA_CART',
          product: response.response.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getCart = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      let response = await fetchApiOrder(
        `/cart/pending/${id}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, 'response get pending cart by id');
      if (response.success == false) {
        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: undefined,
        });
      } else {
        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: response.response.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getCartHomePage = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        orderReducer: {
          dataCartSingle: {cartSingle},
        },
      } = state;

      let response = await fetchApiOrder(
        `/cart/pending/${cartSingle.id}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, 'response get pending cart by id');
      if (response.success == false) {
        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: undefined,
        });
      } else {
        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: response.response.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getPendingCartSingle = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      let response = await fetchApiOrder(
        `/cart/pending/${id}`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, 'response get pending cart by id');
      return response.response.data;
    } catch (error) {
      return error;
    }
  };
};

export const setCart = cart => {
  return async dispatch => {
    try {
      dispatch({
        type: 'DATA_CART_SINGLE',
        cartSingle: cart,
      });
    } catch (error) {
      return error;
    }
  };
};

export const completeOrder = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      let response = await fetchApiOrder(
        '/outlet/cart/update',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response complete cart delivery');
      if (response.success == true) {
        return response.response;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const setDeliveryProvider = cart => {
  return async dispatch => {
    try {
      dispatch({
        type: 'DELIVERY_PROVIDER',
        cartSingle: cart,
      });
    } catch (error) {
      return error;
    }
  };
};

export const settleOrder = (payload, url) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      console.log(payload, 'payload settle order');
      const response = await fetchApiOrder(url, 'POST', payload, 200, token);
      console.log(response, 'response settle order');

      // remove table type
      if (response.success) {
        dispatch({
          type: 'TABLE_TYPE',
          tableType: undefined,
        });

        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: response?.response?.data,
        });
        // dispatch({
        //   type: 'SELECTED_ACCOUNT',
        //   selectedAccount: undefined,
        // });
      }
      var result = {
        responseBody: response.response,
        success: response.success,
      };
      return result;
    } catch (error) {
      return error;
    }
  };
};

export const saveProductsOutlet = (data, OutletId, refresh) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      // get previous data products outlet
      const {
        orderReducer: {
          productsOutlet: {products},
        },
      } = state;

      let outletProduct;
      if (products != undefined) {
        outletProduct = products;
        // if this action is called from refresh method, then remove previous data, and replace with new data
        if (refresh == true) {
          outletProduct = await outletProduct.filter(
            item => item.id != OutletId,
          );
        }
      } else {
        outletProduct = [];
      }

      let product = {
        id: OutletId,
        products: data,
      };
      outletProduct.push(product);
      dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: outletProduct,
      });
    } catch (error) {
      return error;
    }
  };
};

export const getProductsUnavailable = OutletId => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApiProduct(
        `/product/unavailable/${OutletId}/`,
        'GET',
        null,
        200,
        token,
      );

      console.log('RESPONSE GET PRODUCTS UNAVAILABLE ', response);

      if (response.success == true) {
        return response.response.data;
      } else {
        return false;
      }
    } catch (e) {}
  };
};

export const getTermsConditions = () => {
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

      console.log(response, 'RESPONSE ORDERING SETTING');

      if (response.success) {
        let enableRegisterWithPassword = false;

        try {
          enableRegisterWithPassword = response.response.data.settings.find(
            item => item.settingKey === 'EnableRegisterWithPassword',
          ).settingValue;
        } catch (e) {}

        let disableChangeEmail = false;

        try {
          const val = response.response.data.settings.find(
            item => item.settingKey === 'MaxChangeEmailPerDay',
          ).settingValue;

          if (val && Number(val) === 0) {
            disableChangeEmail = true;
          }
        } catch (e) {}

        let disableChangePhoneNumber = false;

        try {
          const val = response.response.data.settings.find(
            item => item.settingKey === 'MaxChangePhonePerDay',
          ).settingValue;

          if (val && Number(val) === 0) {
            disableChangePhoneNumber = true;
          }
        } catch (e) {}

        let disableChangeBirthday = false;

        try {
          const val = response.response.data.settings.find(
            item => item.settingKey === 'DisableChangeBirthday',
          ).settingValue;

          if (val) {
            disableChangeBirthday = true;
          }
        } catch (e) {}

        let loginByEmail = true;

        try {
          loginByEmail = response.response.data.settings.find(
            item => item.settingKey === 'LoginByEmail',
          ).settingValue;
        } catch (e) {}

        let loginByMobile = true;

        try {
          loginByMobile = response.response.data.settings.find(
            item => item.settingKey === 'LoginByMobile',
          ).settingValue;
        } catch (e) {}

        let hideEmailOnRegistration = false;

        try {
          hideEmailOnRegistration = response.response.data.settings.find(
            item => item.settingKey === 'HideEmailOnRegistration',
          ).settingValue;
        } catch (e) {}

        dispatch({
          type: 'DATA_ORDERING_SETTING',
          orderingSetting: response.response.data,
          enableRegisterWithPassword: enableRegisterWithPassword,
          disableChangeEmail,
          disableChangePhoneNumber,
          disableChangeBirthday,
          loginByEmail,
          loginByMobile,
          hideEmailOnRegistration,
        });

        return response.response.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getAllCategory = (skip, take, parentCategoryID) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let payload = {
        take,
        skip,
        sortBy: 'name',
        sortDirection: 'ASC',
      };

      if (parentCategoryID !== undefined) {
        payload.parentCategoryID = parentCategoryID;
      }

      const response = await fetchApiProduct(
        '/category/load',
        'POST',
        payload,
        200,
        token,
      );

      console.log(JSON.stringify(payload), 'payload GET CATEGORY');
      console.log(response, 'RESPONSE GET CATEGORY 12345');

      if (response.success) {
        return response.response;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const isParentCategory = parentCategoryID => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        take: 1,
        skip: 0,
        sortBy: 'name',
        sortDirection: 'ASC',
        parentCategoryID: parentCategoryID,
      };

      const response = await fetchApiProduct(
        '/category/load',
        'POST',
        payload,
        200,
        token,
      );

      console.log(response, 'RESPONSE CHECK PARENT');

      if (response.success) {
        if (isEmptyArray(response.response.data)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getTimeslot = (
  outletID,
  date,
  clientTimezone,
  orderingMode,
  dontSave,
) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        storesReducer: {
          defaultOutlet: {defaultOutlet},
        },
      } = state;

      let dataOutlet = {};
      if (!isEmptyObject(defaultOutlet.orderValidation)) {
        if (orderingMode === 'DELIVERY') {
          dataOutlet = defaultOutlet.orderValidation.delivery;
        } else if (orderingMode === 'STOREPICKUP') {
          dataOutlet = defaultOutlet.orderValidation.storePickUp;
        } else if (orderingMode === 'STORECHECKOUT') {
          dataOutlet = defaultOutlet.orderValidation.storeCheckout;
        } else if (orderingMode === 'TAKEAWAY') {
          dataOutlet = defaultOutlet.orderValidation.takeAway;
        } else if (orderingMode === 'DINEIN') {
          dataOutlet = defaultOutlet.orderValidation.dineIn;
        }
      }

      let payload = {
        date,
        outletID: `outlet::${outletID}`,
        clientTimezone,
        orderingMode,
      };

      if (
        !isEmptyObject(dataOutlet) &&
        dataOutlet.maxDays != undefined &&
        dataOutlet.maxDays > 0
      ) {
        payload.maxDays = dataOutlet.maxDays;
      } else {
        payload.maxDays = 90;
      }

      let response = await fetchApiOrder(
        '/timeslot',
        'POST',
        payload,
        200,
        token,
      );

      console.log('PAYLOAD GET TIMESLOT ', payload);
      console.log('RESPONSE GET TIMESLOT ', response);

      if (response.success === true) {
        if (!isEmptyArray(response.response.data) && dontSave !== true) {
          dispatch({
            type: 'DATA_TIMESLOT',
            timeslots: response.response.data,
          });
        } else {
          dispatch({
            type: 'DATA_TIMESLOT',
            timeslots: [],
          });
        }
        return response.response.data;
      } else {
        dispatch({
          type: 'DATA_TIMESLOT',
          timeslots: [],
        });
      }
      return false;
    } catch (e) {}
  };
};

export const getTimeslotRaw = (
  outletID,
  date,
  clientTimezone,
  orderingMode,
) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        storesReducer: {
          defaultOutlet: {defaultOutlet},
        },
      } = state;

      let dataOutlet = {};
      if (!isEmptyObject(defaultOutlet.orderValidation)) {
        if (orderingMode === 'DELIVERY') {
          dataOutlet = defaultOutlet.orderValidation.delivery;
        } else if (orderingMode === 'STOREPICKUP') {
          dataOutlet = defaultOutlet.orderValidation.storePickUp;
        } else if (orderingMode === 'TAKEAWAY') {
          dataOutlet = defaultOutlet.orderValidation.takeAway;
        } else if (orderingMode === 'DINEIN') {
          dataOutlet = defaultOutlet.orderValidation.dineIn;
        }
      }

      let payload = {
        date,
        outletID: `outlet::${outletID}`,
        clientTimezone,
        orderingMode,
      };

      if (
        !isEmptyObject(dataOutlet) &&
        dataOutlet.maxDays != undefined &&
        dataOutlet.maxDays > 0
      ) {
        payload.maxDays = dataOutlet.maxDays;
      } else {
        payload.maxDays = 90;
      }

      let response = await fetchApiOrder(
        '/timeslot',
        'POST',
        payload,
        200,
        token,
      );

      console.log('PAYLOAD GET TIMESLOT ', payload);
      console.log('RESPONSE GET TIMESLOT ', response);

      if (response.success === true) {
        return response.response.data;
      }
      return false;
    } catch (e) {}
  };
};

export const removeTimeslot = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'DATA_TIMESLOT',
        timeslots: undefined,
      });
    } catch (e) {}
  };
};

export const getSetting = settingKey => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        orderReducer: {
          orderingSetting: {orderingSetting},
        },
      } = state;

      const find = orderingSetting.settings.find(
        item => item.settingKey === settingKey,
      );

      if (find !== undefined) {
        return find.settingValue;
      } else {
        return null;
      }
    } catch (error) {
      return null;
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

export const productByPromotion = (promotionID, outletId) => {
  return async (dispatch, getState) => {
    try {
      const payload = {
        outletId,
      };

      const response = await fetchApiProduct(
        '/promotion/items/' + promotionID,
        'POST',
        payload,
        200,
        null,
      );

      console.log('RESPONSE GET PRODUCTS BY PROMOTION ', response);

      if (response.success == true) {
        return response.response;
      }
      return false;
    } catch (e) {}
  };
};

export const updateProductToBasket = (payload, previousData) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      // get data basket previous
      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;

      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      let updatedProduct = [];
      let data = {
        id: previousData.oldID || previousData.id,
        unitPrice: payload.details[0].unitPrice,
        quantity: payload.details[0].quantity,
        modifiers: payload.details[0].modifiers,
      };

      // CHECK IF CUSTOMER IS LOGGED IN
      if (isLoggedIn !== true) {
        data.product = previousData.product;
        const dataUpdate = await makePayloadUpdate(product, [data]);

        let cartOffline = product;
        for (let i = 0; i < cartOffline.details.length; i++) {
          for (let j = 0; j < dataUpdate.length; j++) {
            if (cartOffline.details[i].id === dataUpdate[j].id) {
              cartOffline.details[i] = dataUpdate[j];
            }
          }
        }
        cartOffline.details = cartOffline.details.filter(item => {
          return item.quantity !== 0;
        });

        if (cartOffline && !isEmptyArray(cartOffline.details)) {
          const response = await fetchApiOrder(
            '/cart/build',
            'POST',
            cartOffline,
            200,
            token,
          );
          console.log(response, 'response build cart');
          dispatch({
            type: 'DATA_BASKET',
            product: response.response.data,
          });
          dispatch({
            type: 'OFFLINE_CART',
            product: response.response.data,
          });
          return response;
        } else {
          const response = {
            status: true,
          };
          dispatch({
            type: 'DATA_BASKET',
            product: undefined,
          });
          dispatch({
            type: 'OFFLINE_CART',
            product: undefined,
          });
          return response;
        }
      }

      // if remark is available, then add
      if (
        payload.details[0].remark != undefined &&
        payload.details[0].remark != ''
      ) {
        data.remark = payload.details[0].remark;
      }
      updatedProduct.push(data);
      console.log('payload update product ', JSON.stringify(updatedProduct));

      let response = await fetchApiOrder(
        '/cart/updateitem',
        'POST',
        updatedProduct,
        200,
        token,
      );
      console.log(response, 'response update data basket');
      return response;
    } catch (error) {
      console.log(error, 'response build cart');
      return error;
    }
  };
};

export const getDeliveryProvider = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let payload = {
        take: 100,
        skip: 0,
        sortBy: 'name',
        sortDirection: 'ASC',
      };

      let response = await fetchApiOrder(
        '/delivery/providers',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response get delivery provider');
      if (response.success === false) {
        dispatch({
          type: 'DATA_PROVIDER',
          providers: undefined,
        });
      } else {
        dispatch({
          type: 'DATA_PROVIDER',
          providers: response.response.data,
        });
      }

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getDeliveryFee = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      console.log(payload, 'payload calculate delivery fee');
      let response = await fetchApiOrder(
        '/delivery/calculateFee',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response get delivery fee');
      if (response.success == true) {
        if (!isEmptyArray(response.response.data.dataProvider)) {
          let providers = response.response.data.dataProvider;
          try {
            providers = _.orderBy(providers, ['deliveryFee'], ['asc']);
          } catch (e) {}
          dispatch({
            type: 'DATA_PROVIDER',
            providers: providers,
          });
        } else {
          dispatch({
            type: 'DATA_PROVIDER',
            providers: [],
          });
        }
        return response.response;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

//martin
export const addProductToBasket = ({defaultOutlet, selectedProduct}) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
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

      // get data basket previous
      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;
      console.log(defaultOutlet, selectedProduct, 'kutil');
      let payload = {
        outletID: `outlet::${defaultOutlet.id}`,
        details: [],
      };

      let newProduct = {
        productID: selectedProduct?.productID,
        unitPrice:
          selectedProduct?.product?.retailPrice || selectedProduct?.retailPrice,
        quantity: selectedProduct?.quantity,
      };

      if (selectedProduct?.remark) {
        newProduct.remark = selectedProduct?.remark;
      }

      if (!isEmptyArray(selectedProduct?.modifiers)) {
        newProduct.modifiers = selectedProduct?.modifiers;
      }

      if (selectedProduct?.specialBarcode) {
        newProduct.specialBarcode = selectedProduct?.specialBarcode;
      }

      payload.details.push(newProduct);

      // add real data
      let response = {};

      /* IF CUSTOMER IS LOGGED IN, THEN ADD ITEM TO SERVER, ELSE, ADD ITEM TO LOCAL DATA */
      if (isLoggedIn === true) {
        response = await fetchApiOrder(
          '/cart/additem',
          'POST',
          payload,
          200,
          token,
        );
      } else {
        if (product !== undefined && product !== null) {
          let cartOffline = product;
          cartOffline.details.push(payload.details[0]);
          payload = cartOffline;
        }
        response = await fetchApiOrder(
          '/cart/build',
          'POST',
          payload,
          200,
          token,
        );
      }
      console.log({response}, 'api add cart');
      //NOTE: It will change it letter
      await dispatch(getBasket());

      // dispatch({
      //   type: 'DATA_BASKET',
      //   product: response.response.data,
      // });

      dispatch({
        type: 'OFFLINE_CART',
        product: response.response.data,
      });
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const updateProductBasket = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      // get data basket previous
      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;

      const {
        authReducer: {
          authData: {isLoggedIn},
        },
      } = state;

      console.log('TOKEN', token);

      console.log('payload update product ', JSON.stringify(payload));

      let response = await fetchApiOrder(
        '/cart/updateitem',
        'POST',
        [payload],
        200,
        token,
      );
      console.log(response, 'response update data basket');

      //NOTE: It will change it letter there's issue in api need to confirm with backend
      await dispatch(getBasket());
      // dispatch({
      //   type: 'DATA_BASKET',
      //   product: response.response.data,
      // });

      dispatch({
        type: 'OFFLINE_CART',
        product: response.response.data,
      });
      return response;
    } catch (error) {
      console.log(error, 'response build cart');
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
      console.log(response, 'response get data basket');
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
        if (order.orderingMode != undefined && order.tableNo != undefined) {
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

export const getDeliveryProviderAndFee = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      console.log(payload, 'payload calculate delivery fee');
      let response = await fetchApiOrder(
        '/delivery/calculateFee',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response get delivery fee');
      if (response.success === true) {
        if (!isEmptyArray(response.response.data.dataProvider)) {
          let providers = response.response.data.dataProvider;
          try {
            providers = _.orderBy(providers, ['deliveryFee'], ['asc']);
          } catch (e) {}
          dispatch({
            type: 'DATA_PROVIDER',
            providers: providers,
          });
        } else {
          dispatch({
            type: 'DATA_PROVIDER',
            providers: [],
          });
        }
        return response.response;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getTimeSlot = ({outletId, date, clientTimezone, orderingMode}) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const {
        storesReducer: {
          defaultOutlet: {defaultOutlet},
        },
      } = state;

      let dataOutlet = {};
      if (!isEmptyObject(defaultOutlet.orderValidation)) {
        if (orderingMode === 'DELIVERY') {
          dataOutlet = defaultOutlet.orderValidation.delivery;
        } else if (orderingMode === 'STOREPICKUP') {
          dataOutlet = defaultOutlet.orderValidation.storePickUp;
        } else if (orderingMode === 'TAKEAWAY') {
          dataOutlet = defaultOutlet.orderValidation.takeAway;
        } else if (orderingMode === 'DINEIN') {
          dataOutlet = defaultOutlet.orderValidation.dineIn;
        }
      }

      let payload = {
        date,
        outletID: `outlet::${outletId}`,
        clientTimezone,
        orderingMode,
      };

      if (
        !isEmptyObject(dataOutlet) &&
        dataOutlet.maxDays != undefined &&
        dataOutlet.maxDays > 0
      ) {
        payload.maxDays = dataOutlet.maxDays;
      } else {
        payload.maxDays = 90;
      }

      let response = await fetchApiOrder(
        '/timeslot',
        'POST',
        payload,
        200,
        token,
      );

      console.log('PAYLOAD GET TIMESLOT ', payload);
      console.log('RESPONSE GET TIMESLOT ', response);

      if (response.success === true) {
        return response.response.data;
      }
      return false;
    } catch (e) {}
  };
};

export const getOrderingMode = outlet => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        settingReducer: {
          allowedOrder: {settingValue},
        },
      } = state;

      const orderingModesField = [
        {
          key: 'STOREPICKUP',
          isEnabledFieldName: 'enableStorePickUp',
          displayName: outlet.storePickUpName || 'Store Pick Up',
          image: appConfig.iconOrderingModeStorePickUp,
        },
        {
          key: 'DELIVERY',
          isEnabledFieldName: 'enableDelivery',
          displayName: outlet.deliveryName || 'Delivery',
          image: appConfig.iconOrderingModeDelivery,
        },
        {
          key: 'TAKEAWAY',
          isEnabledFieldName: 'enableTakeAway',
          displayName: outlet.takeAwayName || 'Take Away',
          image: appConfig.iconOrderingModeTakeAway,
        },
        {
          key: 'DINEIN',
          isEnabledFieldName: 'enableDineIn',
          displayName: outlet.dineInName || 'Dine In',
          image: appConfig.iconOrderingModeStorePickUp,
        },
        {
          key: 'STORECHECKOUT',
          isEnabledFieldName: 'enableStoreCheckOut',
          displayName: outlet.storeCheckOutName || 'Store Checkout',
          image: appConfig.iconOrderingModeStorePickUp,
        },
      ];

      const response = orderingModesField.filter(mode => {
        if (
          outlet[mode.isEnabledFieldName] &&
          settingValue?.includes(mode.key)
        ) {
          return mode;
        }
      });

      return response;
    } catch (error) {
      return error;
    }
  };
};

export const changeOrderingMode = ({orderingMode, provider}) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        orderingMode,
        provider,
      };

      let response = await fetchApiOrder(
        '/cart/changeOrderingMode',
        'POST',
        payload,
        200,
        token,
      );

      console.log('response ordering mode', response);

      if (response.success === true) {
        await dispatch({
          type: 'DATA_ORDERING_MODE',
          orderingMode,
        });
        await dispatch({
          type: 'ORDERING_DATE_TIME',
          orderingDateTimeSelected: null,
        });
        await dispatch(getBasket());
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const setTimeSlotSelected = ({date, time}) => {
  return async dispatch => {
    const payload = {date, time};

    dispatch({
      type: 'ORDERING_DATE_TIME',
      orderingDateTimeSelected: payload,
    });
  };
};

export const getPendingOrderById = id => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let response = await fetchApiOrder(
        `/cart/pending/${id}`,
        'GET',
        null,
        200,
        token,
      );

      if (response?.success) {
        dispatch({
          type: 'DATA_CART_SINGLE',
          cartSingle: response?.response?.data,
        });
      }
      return response?.response?.data;
    } catch (error) {
      return error;
    }
  };
};

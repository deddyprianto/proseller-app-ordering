import {fetchApiProduct} from '../service/apiProduct';
import {fetchApiOrder} from '../service/apiOrder';
import {fetchApi} from '../service/api';
import {isEmptyArray} from '../helper/CheckEmpty';

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

      const PRESET_TYPE = 'CRM';

      let response = await fetchApiProduct(
        `/productpreset/load/${PRESET_TYPE}/${OutletId}`,
        'POST',
        null,
        200,
        token,
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

      const PRESET_TYPE = 'CRM';

      const payload = {
        skip: 0,
        take: 100,
      };

      let response = await fetchApiProduct(
        `/productpreset/loadcategory/${PRESET_TYPE}/${OutletId}`,
        'POST',
        payload,
        200,
        token,
      );

      console.log('RESPONSE GET CATEGORY ', response);

      if (response.success == true) {
        // dispatch({
        //   type: 'DATA_CATEGORY_OUTLET',
        //   cateories: response,
        // });
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

      const payload = {
        skip,
        take,
      };

      const PRESET_TYPE = 'CRM';

      let response = await fetchApiProduct(
        `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${categoryId}`,
        'POST',
        payload,
        200,
        token,
      );

      // console.log('RESPONSE GET ITEMS BY CATEGORY ', response);

      if (response.success == true) {
        // dispatch({
        //   type: 'DATA_PRODUCT_BY_CATEGORY_OUTLET',
        //   productsCategory: response,
        // });
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

      const PRESET_TYPE = 'CRM';

      let searchResults = [];

      for (let i = 0; i < categories.length; i++) {
        let response = await fetchApiProduct(
          `/productpreset/loaditems/${PRESET_TYPE}/${OutletId}/${
            categories[i].id
          }`,
          'POST',
          payload,
          200,
          token,
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
        `/cart/submit`,
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
      // add real data
      let response = await fetchApiOrder(
        `/cart/delete`,
        'DELETE',
        null,
        200,
        token,
      );
      console.log(response, 'response delete basket');
      // remove basket
      // dispatch({
      //   type: 'DATA_BASKET',
      //   product: undefined,
      // });
      // remove table type
      dispatch({
        type: 'TABLE_TYPE',
        tableType: undefined,
      });
      return response;
    } catch (error) {
      return error;
    }
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

      let updatedProduct = [];
      let data = {
        id: previousData.id,
        unitPrice: payload.details[0].unitPrice,
        quantity: payload.details[0].quantity,
        modifiers: payload.details[0].modifiers,
      };

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
        `/cart/updateitem`,
        'POST',
        updatedProduct,
        200,
        token,
      );
      console.log(response, 'response update data basket');
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const addProductToBasket = payload => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      // get data basket previou
      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;

      // add temporary data if product is exist
      if (product != undefined) {
        let newProduct = product;
        newProduct.details.push(payload.details[0]);
        dispatch({
          type: 'DATA_BASKET',
          product: newProduct,
        });
      } else {
        let newProduct = payload;
        dispatch({
          type: 'DATA_BASKET',
          product: newProduct,
        });
      }

      console.log('payload add products ', JSON.stringify(payload));
      // add real data
      let response = await fetchApiOrder(
        `/cart/additem`,
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response post data basket');
      dispatch({
        type: 'DATA_BASKET',
        product: response.response.data,
      });
      return response;
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
      let response = await fetchApiOrder(
        `/cart/getcart`,
        'GET',
        null,
        200,
        token,
      );
      console.log(response, 'response get data basket');
      if (response.success == false) {
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
        `/cart/changeOrderingMode`,
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
        `/cart/pending`,
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
        `/delivery/providers`,
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response get delivery provider');
      if (response.success == false) {
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
      let response = await fetchApiOrder(
        `/delivery/calculateFee`,
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response get delivery fee');
      if (response.success == true) {
        dispatch({
          type: 'DATA_PROVIDER',
          providers: response.response.data.dataProfider,
        });
        return response.response;
      } else {
        return false;
      }
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
        `/outlet/cart/update`,
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

export const getTermsConditions = (payload, url) => {
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
        return response.response.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

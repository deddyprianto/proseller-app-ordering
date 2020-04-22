import {fetchApiProduct} from '../service/apiProduct';
import {fetchApiOrder} from '../service/apiOrder';
import {fetchApi} from '../service/api';

export const getProductByOutlet = OutletId => {
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

      let response = await fetchApiProduct(
        `/productpreset/load/CRM/${OutletId}`,
        'POST',
        null,
        200,
        token,
      );
      console.log(response, 'response data product by outlet');
      if (response.success == true) {
        // get previous data products and concat it
        let outletProduct;
        if (products != undefined) {
          outletProduct = products;
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
        orderReducer: {
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
      dispatch({
        type: 'DATA_BASKET',
        product: undefined,
      });
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
      console.log('payload update product ', updatedProduct);
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

      console.log('payload add products ', payload);
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
      dispatch({
        type: 'TABLE_TYPE',
        tableType: undefined,
      });
      dispatch({
        type: 'SELECTED_ACCOUNT',
        selectedAccount: undefined,
      });
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

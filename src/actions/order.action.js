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

      let response = await fetchApiProduct(
        `/productpreset/load/CRM/${OutletId}`,
        'POST',
        null,
        200,
        token,
      );
      // console.log(response, 'response data product by outlet');
      if (response.success == true) {
        let outletProduct = [];
        let product = {
          id: OutletId,
          products: response.response.data,
          dataLength: response.response.dataLength,
        };
        outletProduct.push(product);
        dispatch({
          type: 'DATA_PRODUCTS_OUTLET',
          products: outletProduct,
          // dataLength: response.response.dataLength,
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
      // get data basket previous
      const {
        orderReducer: {
          dataBasket: {product},
        },
      } = state;

      // add temporary data if product is exist
      if (product != undefined) {
        // manipulate data in reducer so customer dont need to wait request until success when update data
        let newProduct = product;
        let index = product.details.findIndex(
          item => item.productID == payload.details[0].productID,
        );

        // if quantity not 0, then update
        if (payload.details[0].quantity != 0 && index >= 0) {
          newProduct.details[index].quantity = payload.details[0].quantity;
          // check remark exist
          if (
            newProduct.details[index].remark != undefined &&
            newProduct.details[index].remark != ''
          ) {
            newProduct.details[index].remark = payload.details[0].remark;
          }
        } else {
          // if quantity is 0, then delete by index
          newProduct.details.splice(index, 1);
        }
        // if product is basket has empty, then make basket undefined
        if (newProduct.details.length == 0) newProduct = undefined;
        // dispatch({
        //   type: 'DATA_BASKET',
        //   product: newProduct,
        // });

        //  after data in reducer has been updated by fake data, then request update to server with real data
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
      }
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

export const settleOrder = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      console.log(payload, 'payload settle order');
      const response = await fetchApiOrder(
        '/cart/settle',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response settle order');
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

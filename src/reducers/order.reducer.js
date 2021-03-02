import {combineReducers} from 'redux';

const productsOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCTS_OUTLET':
      return {
        products: action.products,
      };

    default:
      return state;
  }
};

const dataBasket = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_BASKET':
      return {
        product: action.product,
      };

    default:
      return state;
  }
};

const dataProvider = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PROVIDER':
      return {
        providers: action.providers,
      };

    default:
      return state;
  }
};

const dataCart = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_CART':
      return {
        cart: action.product,
      };

    default:
      return state;
  }
};

const dataCartSingle = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_CART_SINGLE':
      return {
        cartSingle: action.cartSingle,
      };

    default:
      return state;
  }
};

const tableType = (state = {}, action) => {
  switch (action.type) {
    case 'TABLE_TYPE':
      return {
        tableType: action.tableType,
      };

    default:
      return state;
  }
};

const deliveryProvider = (state = {}, action) => {
  switch (action.type) {
    case 'DELIVERY_PROVIDER':
      return {
        deliveryProvider: action.deliveryProvider,
      };

    default:
      return state;
  }
};

const timeslot = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_TIMESLOT':
      return {
        timeslots: action.timeslots,
      };

    default:
      return state;
  }
};

const orderingSetting = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ORDERING_SETTING':
      return {
        orderingSetting: action.orderingSetting,
      };

    default:
      return state;
  }
};

const outletSelectionMode = (state = {}, action) => {
  switch (action.type) {
    case 'OUTLET_SELECTION_MODE':
      return {
        outletSelectionMode: action.outletSelectionMode,
      };

    default:
      return state;
  }
};

export default combineReducers({
  productsOutlet,
  dataBasket,
  tableType,
  dataCart,
  dataCartSingle,
  deliveryProvider,
  dataProvider,
  timeslot,
  orderingSetting,
  outletSelectionMode,
});

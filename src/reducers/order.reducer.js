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

export default combineReducers({
  productsOutlet,
  dataBasket,
  tableType,
});

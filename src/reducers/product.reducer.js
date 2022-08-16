import {combineReducers} from 'redux';

const productsOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCTS_OUTLET':
      return action.products;

    default:
      return state;
  }
};

const productsEStoreOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCTS_ESTORE_OUTLET':
      return action.products;

    default:
      return state;
  }
};

const productCategories = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCT_CATEGORIES':
      return action.categories;

    default:
      return state;
  }
};

const productSubCategories = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCT_SUB_CATEGORIES':
      return action.subCategories;

    default:
      return state;
  }
};

const productBySubCategories = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCT_BY_SUB_CATEGORIES':
      return action?.products || [];

    default:
      return state;
  }
};

export default combineReducers({
  productsOutlet,
  productsEStoreOutlet,
  productCategories,
  productSubCategories,
  productBySubCategories,
});

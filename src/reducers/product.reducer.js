import {combineReducers} from 'redux';

const productsOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_PRODUCTS_OUTLET':
      return action.products;

    default:
      return state;
  }
};
export default combineReducers({
  productsOutlet,
});

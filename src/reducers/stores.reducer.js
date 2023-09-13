import {combineReducers} from 'redux';

const dataStores = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_STORES':
      return {
        stores: action.data,
      };

    default:
      return state;
  }
};

const dataOutletSingle = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_OUTLET_SINGLE':
      return {
        outletSingle: action.data,
      };

    default:
      return state;
  }
};

const oneOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'ONE_OUTLET':
      return {
        oneOutlet: action.data,
      };

    default:
      return state;
  }
};

//martin
const defaultOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_DEFAULT_OUTLET':
      return {
        defaultOutlet: action.data,
      };

    default:
      return state;
  }
};

const nearestOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_NEAREST_OUTLET':
      return {
        outlet: action.data,
      };

    default:
      return state;
  }
};

const favoriteOutlet = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_FAVORITE_OUTLET':
      return {
        outlet: action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  dataStores,
  nearestOutlet,
  dataOutletSingle,
  oneOutlet,
  defaultOutlet,
  favoriteOutlet,
});

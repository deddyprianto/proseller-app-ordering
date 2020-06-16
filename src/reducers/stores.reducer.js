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

export default combineReducers({
  dataStores,
  dataOutletSingle,
});

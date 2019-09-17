import { combineReducers } from 'redux';

const getDataStores = (state = {}, action) => {
  switch (action.type) {

    case "DATA_ALL_STORES":
      return {
        stores: action.data
      }

    default:
      return state;
  }
}

export default combineReducers({
  getDataStores
});
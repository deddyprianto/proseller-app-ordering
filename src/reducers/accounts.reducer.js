import { combineReducers } from 'redux';

const myVoucers = (state = {}, action) => {
  switch (action.type) {

    case "DATA_MY_VOUCHERS":
      return {
        myVoucers: action.data
      }

    default:
      return state;
  }
}

export default combineReducers({
  myVoucers
});
import {combineReducers} from 'redux';

const setLoyaltyDiscount = (state = {}, action) => {
  switch (action.type) {
    case 'SET_LOYALTY_DISCOUNT':
      return action.data

    default:
      return state;
  }
};

export default combineReducers({
  setLoyaltyDiscount
});

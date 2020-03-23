import {combineReducers} from 'redux';

const myCardAccount = (state = {}, action) => {
  switch (action.type) {
    case 'MY_CARD_ACCOUNT':
      return {
        card: action.card,
      };

    default:
      return state;
  }
};

export default combineReducers({
  myCardAccount,
});

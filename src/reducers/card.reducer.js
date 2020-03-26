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

const selectedAccount = (state = {}, action) => {
  switch (action.type) {
    case 'SELECTED_ACCOUNT':
      return {
        selectedAccount: action.selectedAccount,
      };

    default:
      return state;
  }
};

export default combineReducers({
  myCardAccount,
  selectedAccount,
});

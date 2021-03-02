import {combineReducers} from 'redux';

const balance = (state = {}, action) => {
  switch (action.type) {
    case 'SVC_BALANCE':
      return {
        balance: action.balance,
        defaultBalance: action.defaultBalance,
      };

    default:
      return state;
  }
};

const SVCCard = (state = {}, action) => {
  switch (action.type) {
    case 'SVC_CARD':
      return {
        svc: action.svc,
      };

    default:
      return state;
  }
};

export default combineReducers({
  balance,
  SVCCard,
});

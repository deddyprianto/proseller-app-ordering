import {combineReducers} from 'redux';

const getReferral = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_REFERRAL':
      return {
        referral: action.referral,
      };

    default:
      return state;
  }
};

export default combineReducers({
  getReferral,
});

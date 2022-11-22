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

const getReferralInfo = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_REFERRAL_INFO':
      return {
        referralInfo: action.referral,
      };

    default:
      return state;
  }
};

const getReferralInvitedList = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_REFERRAL_INVITED_LIST':
      return {
        referralInvitedList: action.referral,
      };

    default:
      return state;
  }
};

export default combineReducers({
  getReferral,
  getReferralInfo,
  getReferralInvitedList,
});

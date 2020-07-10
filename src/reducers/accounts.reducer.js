import {combineReducers} from 'redux';

const myVoucers = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_MY_VOUCHERS':
      return {
        myVoucers: action.data,
      };

    default:
      return state;
  }
};

const mandatoryFields = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_MANDATORY_FIELDS':
      return {
        fields: action.fields,
      };

    default:
      return state;
  }
};

const accountExist = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ACCOUNT_EXIST':
      return {
        status: action.status,
      };

    default:
      return state;
  }
};

export default combineReducers({
  myVoucers,
  accountExist,
  mandatoryFields,
});

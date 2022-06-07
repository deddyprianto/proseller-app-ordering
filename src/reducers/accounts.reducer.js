import {combineReducers} from 'redux';

const netsclickStatus = (state = {}, action) => {
  switch (action.type) {
    case 'NETSCLICK_STATUS':
      return {
        netsclickStatus: action.netsclickStatus,
      };

    default:
      return state;
  }
};

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

const afterPayment = (state = {}, action) => {
  switch (action.type) {
    case 'AFTER_PAYMENT':
      return {
        afterPayment: action.data,
      };

    default:
      return state;
  }
};

const paymentRefNo = (state = {}, action) => {
  switch (action.type) {
    case 'PAYMENT_REF_NO':
      return {
        paymentRefNo: action.data,
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

//martin
const myVouchers = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_MY_VOUCHERS':
      return {
        vouchers: action.data,
      };

    default:
      return state;
  }
};

const myProgressBarCampaign = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_MY_PROGRESS_BAR_CAMPAIGN':
      return {
        myProgress: action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  myProgressBarCampaign,
  myVoucers,
  myVouchers,
  accountExist,
  mandatoryFields,
  afterPayment,
  paymentRefNo,
  netsclickStatus,
});

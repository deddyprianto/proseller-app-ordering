import {combineReducers} from 'redux';

const campaign = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_CAMPAIGN':
      return {
        ...state,
        campaign: action.data,
      };
    default:
      return state;
  }
};

const dataPoint = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_POINT_TRANSACTION':
      return {
        ...state,
        pointTransaction: action.pointTransaction,
        isSuccessGetTrx: action.isSuccessGetTrx,
        dataLength: action.dataLength,
        take: action.take,
      };
    case 'DATA_RECENT_TRANSACTION':
      return {
        ...state,
        recentTransaction: action.recentTransaction,
        isSuccessGetTrx: action.isSuccessGetTrx,
      };
    case 'DATA_TOTAL_POINT':
      return {
        ...state,
        totalPoint: action.totalPoint,
      };
    default:
      return state;
  }
};

const vouchers = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_VOUCHER':
      return {
        ...state,
        dataVoucher: action.dataVoucher,
      };
    default:
      return state;
  }
};

const getStamps = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_STAMPS':
      return {
        ...state,
        dataStamps: action.dataStamps,
      };
    default:
      return state;
  }
};

export default combineReducers({
  campaign,
  dataPoint,
  vouchers,
  getStamps,
});

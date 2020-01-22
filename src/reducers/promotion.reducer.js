import {combineReducers} from 'redux';

const dataPromotion = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_PROMOTION':
      return {
        promotion: action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  dataPromotion,
});

import {combineReducers} from 'redux';

//martin
const giftCardCategories = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_GIFT_CARD_CATEGORIES':
      return {
        categories: action.data,
      };

    default:
      return state;
  }
};

const giftCardByCategory = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_GIFT_CARD_BY_CATEGORY':
      return {
        giftCard: action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  giftCardCategories,
  giftCardByCategory,
});

/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import rewardsReducer from './rewards.reducer';
import storesReducer from './stores.reducer';
import accountsReducer from './accounts.reducer';
import inboxReducer from './inbox.reducer';
import promotionReducer from './promotion.reducer';
import orderReducer from './order.reducer';
import cardReducer from './card.reducer';
import referralReducer from './referral.reducer';
import SVCReducer from './SVC.reducer';
import membershipReducer from './membership.reducer';
import intlData from './language.reducer';
import productReducer from './product.reducer';
import settingReducer from './setting.reducer';
import giftReducer from './gift.reducer';
import searchReducer from './search.reducer';

const reducers = {
  authReducer,
  userReducer,
  rewardsReducer,
  storesReducer,
  accountsReducer,
  inboxReducer,
  promotionReducer,
  orderReducer,
  cardReducer,
  referralReducer,
  SVCReducer,
  membershipReducer,
  intlData,
  productReducer,
  settingReducer,
  giftReducer,
  searchReducer,
  form: formReducer,
};

const appReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGGED_OUT_SUCCESS') {
    const backupStoreReducer = state.storesReducer;
    const backupOrderingSetting = state.orderReducer;
    state = {};
    state.storesReducer = backupStoreReducer;
    state.orderReducer = backupOrderingSetting;
  }

  return appReducer(state, action);
};

export default rootReducer;

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

const reducers = {
  authReducer,
  userReducer,
  rewardsReducer,
  storesReducer,
  accountsReducer,
  inboxReducer,
  form: formReducer,
};

const appReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGGED_OUT_SUCCESS') {
    state = {};
  }

  return appReducer(state, action);
};

export default rootReducer;

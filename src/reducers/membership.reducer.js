import {combineReducers} from 'redux';

const defaultState = {
  memberships: {},
};

const memberships = (state = defaultState, action) => {
  switch (action.type) {
    case 'DATA_MEMBERSHIP':
      return {
        memberships: action.memberships,
      };

    default:
      return state;
  }
};

export default combineReducers({
  memberships,
});
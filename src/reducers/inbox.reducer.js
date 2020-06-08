import {combineReducers} from 'redux';

const dataInbox = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_BROADCAST':
      return {
        broadcast: action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  dataInbox,
});

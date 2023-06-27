import {combineReducers} from 'redux';

const dataInbox = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_BROADCAST':
      return {
        ...state,
        broadcast: action.data,
      };
    case 'LOADING_BROADCAST':
      return {
        ...state,
        isLoading: action.payload || false,
      };

    default:
      return state;
  }
};

export default combineReducers({
  dataInbox,
});

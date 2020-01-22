import {combineReducers} from 'redux';
import * as _ from 'lodash';
import {AsyncStorage} from 'react-native';

const dataInbox = (state = {}, action) => {
  switch (action.type) {
    case 'DATA_ALL_BROADCAS':
      var dataList = _.orderBy(action.data.listInbox, ['createdAt'], ['desc']);
      // console.log(dataList, 'reducer');
      return {
        broadcas: dataList,
        broadcasNoRead: action.data.noRead,
      };

    default:
      return state;
  }
};

export default combineReducers({
  dataInbox,
});

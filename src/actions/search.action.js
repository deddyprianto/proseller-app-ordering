import AsyncStorage from '@react-native-community/async-storage';
import appConfig from '../config/appConfig';

const setData = ({data, type}) => {
  return {
    type: type,
    data: data,
  };
};

export const setSearchProductHistory = ({searchQuery}) => {
  return async (dispatch, getState) => {
    const state = getState();

    const {
      searchReducer: {searchProductHistory},
    } = state;

    const historiesMax3 = searchProductHistory.filter((value, index) => {
      if (index < 2) {
        return value;
      }
    });

    const isExist = historiesMax3.find(value => value === searchQuery);

    if (!isExist && searchQuery) {
      const payload = [searchQuery].concat(searchProductHistory);

      await dispatch(
        setData({data: payload, type: 'SET_SEARCH_PRODUCT_HISTORY'}),
      );
    }
  };
};

export const clearSearchProductHistory = () => {
  return async dispatch => {
    await dispatch(setData({data: [], type: 'SET_SEARCH_PRODUCT_HISTORY'}));
  };
};

export const getAutoCompleteMap = (searchText, page = 1) => {
  return async dispatch => {
    try {
      const url = `${
        appConfig.oneMapBaseUrl
      }/commonapi/search?searchVal=${searchText}&returnGeom=Y&getAddrDetails=Y&pageNum=${page}`;
      const response = await fetch(url, {method: 'GET'});
      const data = await response.json();
      if (searchText === '') {
        dispatch({
          type: 'SAVE_AUTOCOMPLETE_ADDRESS',
          payload: [],
          page,
        });
      }
      if (data.pageNum <= data.totalNumPages) {
        dispatch({
          type: 'SAVE_AUTOCOMPLETE_ADDRESS',
          payload: data.results,
          page,
        });
      }
    } catch (e) {
      return e;
    }
  };
};

export const getAddressDetail = location => {
  return async dispatch => {
    try {
      const token = await AsyncStorage.getItem('onemapToken');
      const {access_token} = JSON.parse(token);
      const url = `${
        appConfig.oneMapBaseUrl
      }/privateapi/commonsvc/revgeocode?location=${location}&token=${access_token}`;
      const response = await fetch(url, {method: 'GET'});
      const data = await response.json();
      return data?.GeocodeInfo || [];
    } catch (e) {
      return e;
    }
  };
};

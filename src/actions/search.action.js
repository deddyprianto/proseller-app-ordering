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

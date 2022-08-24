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

    const isExist = searchProductHistory.find(value => value === searchQuery);

    if (!isExist && searchQuery) {
      const payload = [...searchProductHistory, searchQuery];

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

import React from 'react';

import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {isEmptyArray} from '../../helper/CheckEmpty';

import MyFavoriteOutletListItem from './components/MyFavoriteOutletListItem';

const MyFavoriteOutletList = () => {
  const myFavoriteOutlets = useSelector(
    state => state.storesReducer.favoriteOutlet.outlet,
  );

  const renderOutletList = () => {
    if (!isEmptyArray(myFavoriteOutlets)) {
      const result = myFavoriteOutlets.map(outlet => {
        return <MyFavoriteOutletListItem outlet={outlet} />;
      });
      return result;
    }
  };

  return <View>{renderOutletList()}</View>;
};

export default MyFavoriteOutletList;

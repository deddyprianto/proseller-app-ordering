import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, ScrollView, View} from 'react-native';

import FavoriteOutletListItem from './components/FavoriteOutletListItem';

import LoadingScreen from '../loadingScreen';
import {
  setFavoriteOutlet,
  unsetFavoriteOutlet,
} from '../../actions/stores.action';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

const FavoriteOutletList = ({outlets}) => {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const myFavoriteOutlets = useSelector(
    state => state.storesReducer.favoriteOutlet.outlet,
  );

  useEffect(() => {
    const result = outlets?.map(outlet => {
      const isFind = myFavoriteOutlets?.find(
        favoriteOutlet => favoriteOutlet?.id === outlet?.id,
      );
      if (isFind) {
        return {...outlet, isFavorite: true};
      } else {
        return {...outlet, isFavorite: false};
      }
    });

    setList(result);
  }, [myFavoriteOutlets, outlets]);

  const handleSetFavoriteOutlet = async item => {
    await dispatch(setFavoriteOutlet({outletId: item?.id}));
  };

  const handleUnsetFavoriteOutlet = async item => {
    await dispatch(unsetFavoriteOutlet({outletId: item?.id}));
  };

  const handleStarClicked = async item => {
    if (item.isFavorite) {
      setIsLoading(true);
      await handleUnsetFavoriteOutlet(item);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      await handleSetFavoriteOutlet(item);
      setIsLoading(false);
    }
  };

  const renderOutletList = () => {
    const result = list?.map(item => {
      return (
        <FavoriteOutletListItem
          item={item}
          onClick={() => {
            handleStarClicked(item);
          }}
        />
      );
    });
    return result;
  };

  return (
    <ScrollView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>{renderOutletList()}</View>
    </ScrollView>
  );
};

export default FavoriteOutletList;

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {StyleSheet, ScrollView, View} from 'react-native';

import FavoriteOutletListItem from './components/FavoriteOutletListItem';

import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
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
    text: {
      margin: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return styles;
};

const FavoriteOutletList = ({outlets}) => {
  const styles = useStyles();

  const [list, setList] = useState([]);

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

  const renderOutletList = () => {
    const result = list?.map(item => {
      return <FavoriteOutletListItem item={item} />;
    });
    return result;
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>{renderOutletList()}</View>
    </ScrollView>
  );
};

export default FavoriteOutletList;

import React from 'react';

import {StyleSheet, ScrollView, View, Text, Image} from 'react-native';

import IconEvilIcons from 'react-native-vector-icons/EvilIcons';

import FavoriteOutletDetailDescription from './components/FavoriteOutletDetailDescription';
import FavoriteOutletDetailMap from './components/FavoriteOutletDetailMap';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  image: {
    height: 235,
    width: '100%',
  },
  icon: {
    fontSize: 24,
  },
  map: {
    width: '100%',
    height: 150,
  },
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  viewMap: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  viewSeeLocation: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});

const FavoriteOutletDetail = ({outlet}) => {
  const renderImages = () => {
    return (
      <View style={styles.viewImage}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: outlet?.defaultImageURL}}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.root}>
      {renderImages()}
      <FavoriteOutletDetailDescription outlet={outlet} />
    </ScrollView>
  );
};

export default FavoriteOutletDetail;

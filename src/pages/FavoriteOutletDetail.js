import React from 'react';

import {StyleSheet, View} from 'react-native';

import FavoriteOutletDetail from '../components/favoriteOutletDetail';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const FavoriteOutlets = ({outlet}) => {
  return (
    <View style={styles.container}>
      <Header title="Outlets Detail" />
      <FavoriteOutletDetail outlet={outlet} />
    </View>
  );
};

export default FavoriteOutlets;

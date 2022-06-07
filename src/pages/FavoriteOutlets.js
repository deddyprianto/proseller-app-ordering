import React from 'react';

import {StyleSheet, ScrollView, View} from 'react-native';

import FavoriteOutletList from '../components/favoriteOutletList';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const FavoriteOutlets = () => {
  return (
    <View style={styles.root}>
      <Header title="All Outlets" />
      <FavoriteOutletList />
    </View>
  );
};

export default FavoriteOutlets;

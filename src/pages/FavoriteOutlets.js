import React from 'react';

import {StyleSheet, SafeAreaView} from 'react-native';

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
    <SafeAreaView style={styles.root}>
      <Header title="All Outlets" />
      <FavoriteOutletList />
    </SafeAreaView>
  );
};

export default FavoriteOutlets;

import React from 'react';

import {StyleSheet, SafeAreaView} from 'react-native';

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
    <SafeAreaView style={styles.container}>
      <Header title="Outlets Detail" />
      <FavoriteOutletDetail outlet={outlet} />
    </SafeAreaView>
  );
};

export default FavoriteOutlets;

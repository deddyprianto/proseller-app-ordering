import React from 'react';

import {StyleSheet, ScrollView} from 'react-native';

import FavoriteOutletDetail from '../components/favoriteOutletDetail';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

const FavoriteOutlets = () => {
  return (
    <ScrollView style={styles.container}>
      <Header title="Outlets Detail" />
      <FavoriteOutletDetail />
    </ScrollView>
  );
};

export default FavoriteOutlets;

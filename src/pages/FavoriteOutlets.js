import React from 'react';

import {StyleSheet, ScrollView} from 'react-native';

import FavoriteOutletList from '../components/favoriteOutletList';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

const FavoriteOutlets = () => {
  return (
    <ScrollView style={styles.container}>
      <Header title="All Outlets" />
      <FavoriteOutletList />
    </ScrollView>
  );
};

export default FavoriteOutlets;

import React, {useEffect, useState} from 'react';

import {StyleSheet, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {dataStores} from '../actions/stores.action';

import FavoriteOutletList from '../components/favoriteOutletList';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const FavoriteOutlets = () => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const outlets = useSelector(state => state.storesReducer.dataStores.stores);

  const handleOutletSearch = () => {
    if (searchQuery) {
      return outlets.filter(x =>
        x.name.toUpperCase().includes(searchQuery.toUpperCase()),
      );
    }
    return outlets;
  };

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="All Outlets"
        searchHeader
        searchPlaceholder="Try to search “Outlet Name”"
        handleSearchInput={value => {
          setSearchQuery(value);
        }}
      />
      <FavoriteOutletList outlets={handleOutletSearch()} />
    </SafeAreaView>
  );
};

export default FavoriteOutlets;

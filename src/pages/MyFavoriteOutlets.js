import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {getFavoriteOutlet, dataStores} from '../actions/stores.action';

import MyFavoriteOutletList from '../components/myFavoriteOutletList';

import {Body, Header} from '../components/layout';
import Theme from '../theme';
import {Actions} from 'react-native-router-flux';
import useBackHandler from '../hooks/backHandler/useBackHandler';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
    },
    bottom: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    viewButton: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    textButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const MyFavoriteOutlets = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const myFavoriteOutlets = useSelector(
    state => state.storesReducer.favoriteOutlet.outlet,
  );

  useBackHandler();

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getFavoriteOutlet());
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

  const handleOutletSearch = () => {
    if (searchQuery) {
      return myFavoriteOutlets.filter(x =>
        x?.name?.toUpperCase().includes(searchQuery.toUpperCase()),
      );
    }
    return myFavoriteOutlets;
  };

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <Body>
          <MyFavoriteOutletList outlets={handleOutletSearch()} />
        </Body>
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            Actions.favoriteOutlets();
          }}>
          <Text style={styles.textButton}>See All Outlet</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="My Favorite Outlets"
        searchHeader
        searchPlaceholder="Try to search “Outlet Name”"
        handleSearchInput={value => {
          setSearchQuery(value);
        }}
      />
      {renderBody()}
      {renderBottom()}
    </SafeAreaView>
  );
};

export default MyFavoriteOutlets;

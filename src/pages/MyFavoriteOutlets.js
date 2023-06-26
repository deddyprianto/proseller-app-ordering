import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

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

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getFavoriteOutlet());
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <Body>
          <MyFavoriteOutletList />
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
      <Header title="My Favorite Outlets" />
      {renderBody()}
      {renderBottom()}
    </SafeAreaView>
  );
};

export default MyFavoriteOutlets;

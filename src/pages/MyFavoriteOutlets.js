import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';

import MyFavoriteOutletList from '../components/myFavoriteOutletList';
import Header from '../components/layout/header';

import {getFavoriteOutlet, dataStores} from '../actions/stores.action';
import appConfig from '../config/appConfig';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
    paddingVertical: 12,
  },
  image: {
    height: 235,
    width: 340,
  },
  textSeeAll: {
    color: 'white',
    fontSize: 12,
  },
  touchableSeeAll: {
    position: 'absolute',
    bottom: 20,
    height: 34,
    width: 130,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const MyFavoriteOutlets = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getFavoriteOutlet());
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

  const images = [
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
  ];

  const renderImages = () => {
    return (
      <View style={styles.viewImage}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={appConfig.imageFavoriteOutlet}
        />
      </View>
    );
  };

  const renderSeeAllButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableSeeAll}
        onPress={() => {
          Actions.favoriteOutlets();
        }}>
        <Text style={styles.textSeeAll}>See All Outlet</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="My Favorite Outlets" />
      <ScrollView style={{flex: 1}}>
        {renderImages()}
        <MyFavoriteOutletList />
      </ScrollView>
      {renderSeeAllButton()}
    </SafeAreaView>
  );
};

export default MyFavoriteOutlets;

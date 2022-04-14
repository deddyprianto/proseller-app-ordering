import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';

import MyFavoriteOutletList from '../components/myFavoriteOutletList';
import {Header} from '../components/layout';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
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
    height: 34,
    width: 130,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});

const MyFavoriteOutlets = () => {
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
          source={{uri: images[0]}}
        />
      </View>
    );
  };

  const renderSeeAllButton = () => {
    return (
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity
          style={styles.touchableSeeAll}
          onPress={() => {
            Actions.favoriteOutlets();
          }}>
          <Text style={styles.textSeeAll}>See All Outlet</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <Header title="My Favorite Outlets" />
      {renderImages()}
      <MyFavoriteOutletList />
      {renderSeeAllButton()}
    </ScrollView>
  );
};

export default MyFavoriteOutlets;

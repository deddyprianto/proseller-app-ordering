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
import colorConfig from '../../config/colorConfig';
import voucherDetail from '../voucherDetail';

import IconEvilIcons from 'react-native-vector-icons/EvilIcons';

import FavoriteOutletDetailDescription from './components/FavoriteOutletDetailDescription';
import FavoriteOutletDetailMap from './components/FavoriteOutletDetailMap';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 235,
    width: WIDTH * 1 - 32,
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

  const renderMap = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: WIDTH - 34,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
          }}>
          <Text>See Location</Text>
          <IconEvilIcons name="location" style={{fontSize: 24}} />
        </View>
        <FavoriteOutletDetailMap style={{width: WIDTH - 34, height: 150}} />
      </View>
    );
  };

  return (
    <View>
      {renderImages()}
      <FavoriteOutletDetailDescription item={{id: 1, image: images[0]}} />
      {renderMap()}
    </View>
  );
};

export default MyFavoriteOutlets;

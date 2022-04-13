import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';

// import StarIcon from '../assets/img/star.svg';

import MyFavoriteOutletListItem from './components/MyFavoriteOutletListItem';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({});

const MyFavoriteOutlet = () => {
  const images = [
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
  ];

  return <MyFavoriteOutletListItem />;
};

export default MyFavoriteOutlet;

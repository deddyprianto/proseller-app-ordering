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
import FavoriteOutletListItem from './components/FavoriteOutletListItem';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({});

const FavoriteOutletList = () => {
  const items = [
    {
      id: 1,
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 2,
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 3,
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 4,
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
  ];

  const renderOutletList = () => {
    const result = items.map(item => {
      return <FavoriteOutletListItem item={item} />;
    });
    return result;
  };

  return (
    <View
      style={{
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        width: WIDTH,
      }}>
      {renderOutletList()}
    </View>
  );
};

export default FavoriteOutletList;

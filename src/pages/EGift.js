import React from 'react';
import {Actions} from 'react-native-router-flux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import colorConfig from '../config/colorConfig';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
  },
  image: {
    height: HEIGHT * 0.22,
    width: WIDTH * 0.85,
    borderRadius: 10,
    marginBottom: 20,
  },
  viewHeader: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,

    width: WIDTH * 0.35,
    height: HEIGHT * 0.035,
    backgroundColor: colorConfig.fifthColor,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
});

const EGift = () => {
  const categories = [
    {
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
  ];

  const renderCategories = () => {
    const result = categories.map((category, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            Actions.push('sendEGift');
          }}>
          <Image
            key={index}
            style={styles.image}
            resizeMode="stretch"
            source={{uri: category.image}}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>Send A Gift</Text>
        </View>
        <Text style={styles.textDescription}>
          Send a gift to your love ones or friends with a custom design voucher
        </Text>
      </View>
      <View style={styles.viewBody}>{renderCategories()}</View>
    </ScrollView>
  );
};

export default EGift;

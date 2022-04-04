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
import appConfig from '../config/appConfig';

import EStoreList from '../components/eStoreList/EStoreList';

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
    paddingHorizontal: 50,
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,

    width: WIDTH * 0.35,
    height: HEIGHT * 0.04,
    backgroundColor: colorConfig.forthColor,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
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

const ECard = () => {
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

  const renderQRCode = () => {
    return (
      <View
        style={{
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colorConfig.sixthColor,
          height: 250,
          width: '100%',
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            color: colorConfig.primaryColor,
            marginTop: 10,
          }}>
          XXX
        </Text>
        <Text>Current Tier : Silver</Text>
        <Image
          style={{marginTop: 20, height: 150, width: 150, borderRadius: 5}}
          source={appConfig.funtoastQRCode}
        />
      </View>
    );
  };

  const renderHowToUse = () => {
    return (
      <View style={{marginTop: 50}}>
        <Text style={{color: colorConfig.primaryColor}}>How To Use :</Text>
        <Text style={{marginTop: 10}}>
          1. Present the e-card above to the cashier when making an order at Fun
          Toast outlets.
        </Text>
        <Text style={{marginTop: 10}}>2. Earn points from your purchase!</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <Text>3. Points can be redeem </Text>
          <Text style={{textDecorationLine: 'underline'}}>here</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>My E - Card</Text>
        </View>
        {renderQRCode()}
        {renderHowToUse()}
      </View>
    </ScrollView>
  );
};

export default ECard;

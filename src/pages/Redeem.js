import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';

import {ProgressBar, Colors} from 'react-native-paper';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {},
  viewHeader: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

const Redeem = () => {
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

  const renderPointBar = () => {
    return (
      <View
        style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colorConfig.sixthColor,
          height: 230,
          width: '100%',
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            color: colorConfig.primaryColor,

            marginTop: 30,
          }}>
          Welcome XXX,
        </Text>
        <Text style={{fontSize: 20, marginTop: 20}}>55 PTS</Text>
        <View style={{width: '90%', justifyContent: 'center', marginTop: 15}}>
          <ProgressBar
            progress={1}
            color={Colors.red800}
            style={{backgroundColor: 'grey', height: 25, borderRadius: 10}}
          />
          <Image
            style={{height: 30, width: 30, position: 'absolute', left: '90%'}}
            source={appConfig.funtoastQRCode}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          <Text style={{fontSize: 10}}>Silver</Text>
          <Text style={{fontSize: 10}}>Gold</Text>
        </View>
        <Text style={{fontSize: 10, marginTop: 20}}>
          Spend 300 Point by 31 Dec 2022 to upgrade to Gold
        </Text>
      </View>
    );
  };

  const renderRewardList = () => {
    const test = categories.map(category => {
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'white',
            height: 90,
            marginBottom: 10,
            borderRadius: 10,
            elevation: 6,
          }}>
          <Image
            style={{
              height: 90,
              width: '40%',
              borderTopLeftRadius: 9,
              borderBottomLeftRadius: 9,
            }}
            source={{uri: category.image}}
          />
          <View
            style={{
              width: '60%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text>$2 OFF e-voucher</Text>
            <Text>100 PTS</Text>
          </View>
        </View>
      );
    });
    return test;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        {renderPointBar()}
        <Text style={{marginVertical: 18, width: '100%', textAlign: 'left'}}>
          Rewards
        </Text>
        {renderRewardList()}
      </View>
    </ScrollView>
  );
};

export default Redeem;

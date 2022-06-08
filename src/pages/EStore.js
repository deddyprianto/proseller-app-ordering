import React from 'react';

import {StyleSheet, View, Text, Dimensions} from 'react-native';

import colorConfig from '../config/colorConfig';

import EStoreList from '../components/eStoreList/EStoreList';
import {SafeAreaView} from 'react-navigation';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
  },
  viewHeader: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
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
    height: HEIGHT * 0.035,
    backgroundColor: colorConfig.thirdColor,
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

const EStore = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>E - Store</Text>
        </View>
        <Text style={styles.textDescription}>
          Get Fun Toast merchandises here
        </Text>
      </View>
      <View style={styles.viewBody}>
        <EStoreList />
      </View>
    </SafeAreaView>
  );
};

export default EStore;

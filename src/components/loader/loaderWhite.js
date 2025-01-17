/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

export default class LoaderWhite extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 99,
    justifyContent: 'center',
  },
});

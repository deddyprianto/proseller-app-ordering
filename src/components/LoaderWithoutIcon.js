/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Dimensions} from 'react-native';

export default class LoaderWithoutIcon extends Component {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height,
    zIndex: 95,
    justifyContent: 'center',
  },
});

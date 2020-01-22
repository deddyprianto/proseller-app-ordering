/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

export default class Error extends Component {
	render() {
    return(
			<View style={styles.container}>
        <ActivityIndicator color="#ffffff" size="large" />
        {
          Alert.alert(
            'Login Error!',
            '',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]
          )
        }
			</View>
    )
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 99,
    justifyContent: "center"
  }
});


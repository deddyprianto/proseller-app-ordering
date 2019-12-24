import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

export default class OfflineSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
    };
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: '#b52424',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: Dimensions.get('window').width,
          position: 'absolute',
        }}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
          }}>
          No Internet Connection
        </Text>
      </View>
    );
  }
}

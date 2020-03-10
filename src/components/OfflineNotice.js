import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';

import NetInfo from '@react-native-community/netinfo';

export default class OfflineNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
      connectionInfo: true,
    };
  }

  componentDidMount() {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);

      NetInfo.addEventListener(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        this.handleConnectivityChange(state.isConnected);
      });
    });
  }

  handleConnectivityChange = connectionInfo => {
    this.setState({connectionInfo});
  };

  render() {
    if (!this.state.connectionInfo) {
      return (
        <View style={styles.offlineContainer}>
          <StatusBar backgroundColor="#b52424" barStyle="dark-content" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  offlineText: {
    color: '#fff',
  },
});

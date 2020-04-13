import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';

const SUCCESS_URL =
  'https://payment.proseller.io/api/account/registration/success';
const FAILED_URL =
  'https://payment.proseller.io/api/account/registration/failed';

let openOne = true;

export default class HostedPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }
  render() {
    const {url, page} = this.props;
    return (
      <>
        <WebView
          source={{uri: url}}
          style={{marginTop: 10}}
          onNavigationStateChange={navState => {
            let url = navState.title;
            if (url == SUCCESS_URL && openOne) {
              Actions.popTo(page);
              Alert.alert(
                'Congratulations',
                'Your account has been registered.',
              );
              openOne = false;
            } else if (url == FAILED_URL && openOne) {
              Actions.popTo(page);
              Alert.alert('Sorry', 'Cant register your account.');
              openOne = false;
            }
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
});

import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';

export default class HostedPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }
  render() {
    const {url} = this.props;
    const {showButton} = this.state;
    return (
      <>
        <WebView
          source={{uri: url}}
          style={{marginTop: 10}}
          onNavigationStateChange={navState => {
            let url = navState.title;
            let staticURL =
              'https://payment.proseller.io/wirecard/api/payment/status/';
            if (url.includes(staticURL)) {
              this.setState({showButton: true});
            }
          }}
        />
        {showButton ? (
          <TouchableOpacity
            onPress={() => Actions.popTo('listCard')}
            style={styles.buttonBottomFixed}>
            <Text style={styles.textAddCard}>Close</Text>
          </TouchableOpacity>
        ) : null}
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

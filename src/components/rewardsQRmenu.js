/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
// import DeviceBrightness from 'react-native-device-brightness';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

class RewardsQRmenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      deviceBrightness: 0.5,
    };
  }

  // componentDidMount(): void {
  //   const self = this;
  //   //  set device brightness to max, for scanning purpose
  //   try {
  //     DeviceBrightness.getSystemBrightnessLevel().then(function(luminous) {
  //       // Get current brightness level
  //       // 0 ~ 1
  //       self.setState({deviceBrightness: luminous});
  //       console.log(luminous);
  //     });
  //
  //     DeviceBrightness.setBrightnessLevel(1);
  //   } catch (e) {
  //     console.log('unable to set device brightness', e);
  //   }
  // }

  // componentWillUnmount(): void {
  //   console.log('unmount dongs');
  //   const self = this;
  //   //  set device brightness to normal again
  //   try {
  //     DeviceBrightness.setBrightnessLevel(0.4);
  //   } catch (e) {
  //     console.log('unable to set device brightness', e);
  //   }
  // }

  goBack = () => {
    Actions.pop();
  };

  pageScan() {
    Actions.scan();
  }

  onSuccess = e => {
    console.log(e);
  };

  render() {
    const {intlData} = this.props;
    let qrcode = this.props.qrcode;
    try {
      // Decrypt qrcode
      let bytes = CryptoJS.AES.decrypt(qrcode, awsConfig.PRIVATE_KEY_RSA);
      qrcode = bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      Alert.alert('Oppss..', 'Something went wrong, please try again');
    }
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={styles.card}>
          <View style={{marginTop: 50}}>
            <QRCode
              value={JSON.stringify({
                token: qrcode,
              })}
              logo={appConfig.appLogoQR}
              logoSize={this.state.screenWidth / 6 - 40}
              size={this.state.screenWidth - 160}
            />
            {/* <TouchableOpacity
              style={styles.btnScan}
              onPress={this.pageScan}>
                <Text style={styles.btnText}> Scan QR Code</Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    alignItems: 'center',
  },
  btnScan: {
    marginTop: 10,
    width: Dimensions.get('window').width / 2,
    height: 40,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: colorConfig.pageIndex.backgroundColor,
    fontWeight: 'bold',
  },
});

mapStateToProps = state => ({
  qrcode: state.authReducer.authData.qrcode,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewardsQRmenu);

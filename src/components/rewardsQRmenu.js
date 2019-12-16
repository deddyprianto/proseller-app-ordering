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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

class RewardsQRmenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  goBack() {
    Actions.pop();
  }

  pageScan() {
    Actions.scan();
  }

  onSuccess = e => {
    console.log(e);
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={styles.card}>
          {console.log(this.props.qrcode)}
          <View>
            <QRCode
              value={JSON.stringify({
                token: this.props.qrcode,
              })}
              logo={appConfig.appLogoQR}
              logoSize={this.state.screenWidth / 6 - 20}
              size={this.state.screenWidth - 100}
            />
            {/* <TouchableOpacity
              style={styles.btnScan}
              onPress={this.pageScan}>
                <Text style={styles.btnText}> Scan QR Code</Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </View>
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
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  RewardsQRmenu,
);

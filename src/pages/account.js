import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import {logoutUser, refreshToken} from '../actions/auth.actions';
import AccountUserDetail from '../components/accountUserDetail';
import AccountMenuList from '../components/accountMenuList';
import colorConfig from '../config/colorConfig';
import {defaultPaymentAccount, getUserProfile} from '../actions/user.action';
import {referral} from '../actions/referral.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {getCompanyInfo} from '../actions/stores.action';
import {getAccountPayment} from '../actions/payment.actions';
import {Overlay} from 'react-native-elements';
// import {campaign, dataPoint, getStamps} from '../actions/rewards.action';
// import {recentTransaction} from '../actions/sales.action';
// import {getMandatoryFields} from '../actions/account.action';
import {Dialog} from 'react-native-paper';
import appConfig from '../config/appConfig';
import QRCode from 'react-native-qrcode-svg';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isLoading: false,
      loadingLogout: false,
      dialogChangeLanguage: false,
      screenWidth: Dimensions.get('window').width,
      qrCodeVisible: false,
    };
  }

  componentDidMount = async () => {
    try {
      this.getAccountInfo = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.getDataRewards();
        },
      );
    } catch (e) {}
  };

  componentWillUnmount(): void {
    try {
      this.getAccountInfo.remove();
    } catch (e) {}
  }

  getDataRewards = async () => {
    try {
      await this.setState({isLoading: true});
      await this.props.dispatch(refreshToken());
      await Promise.all([
        this.props.dispatch(getUserProfile()),
        this.props.dispatch(referral()),
        this.props.dispatch(getCompanyInfo()),
        this.props.dispatch(getAccountPayment()),
      ]);
      await this.setState({isLoading: false});
    } catch (error) {}
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await this.getDataRewards();
    await this.setState({refreshing: false});
  };

  logout = async () => {
    this.setState({loadingLogout: true});
    await this.props.dispatch(defaultPaymentAccount(undefined));
    await this.props.dispatch(logoutUser());
    this.setState({loadingLogout: false});
  };

  renderQRCode = () => {
    let qrcode = 'myQRCode';
    try {
      qrcode = this.props.qrcode;
      let bytes = CryptoJS.AES.decrypt(qrcode, awsConfig.PRIVATE_KEY_RSA);
      qrcode = bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {}
    return (
      <Dialog
        dismissable={false}
        visible={this.state.qrCodeVisible}
        onDismiss={() => {
          this.setState({qrCodeVisible: false});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              fontSize: 20,
              color: colorConfig.store.defaultColor,
            }}>
            My QRCode
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <QRCode
              value={JSON.stringify({
                token: qrcode,
              })}
              logo={appConfig.appLogoQR}
              logoSize={this.state.screenWidth / 6 - 5}
              size={this.state.screenWidth - 110}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.setQrCodeVisibility(false)}
            style={{
              width: '100%',
              borderRadius: 5,
              backgroundColor: colorConfig.store.defaultColor,
              padding: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Lato-Bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Hide
            </Text>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
    );
  };

  setQrCodeVisibility = value => {
    this.setState({qrCodeVisible: value});
  };

  render() {
    const {intlData} = this.props;
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <Overlay
          isVisible={this.state.isLoading}
          fullScreen={true}
          windowBackgroundColor={'rgba(0, 0, 0, 0.1)'}
          overlayBackgroundColor={'transparent'}
          children={null}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              size={Platform.OS === 'ios' ? 80 : 50}
              color={colorConfig.store.defaultColor}
            />
          </View>
        </Overlay>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.card}>
            <AccountUserDetail
              setQrCodeVisibility={this.setQrCodeVisibility}
              screen={this.props}
              userDetail={userDetail}
            />
          </View>
          <View style={styles.card}>
            <AccountMenuList
              setLanguage={this.setLanguage}
              dialogChangeLanguage={this.state.dialogChangeLanguage}
              screen={this.props}
            />
          </View>
        </ScrollView>
        {this.renderQRCode()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    margin: 10,
    flexDirection: 'row',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
  card: {
    // marginVertical: 10,
    // backgroundColor: '#f2f2f2',
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 9,
    // },
    // shadowOpacity: 0.7,
    // shadowRadius: 7.49,
    // elevation: 12,
  },
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
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
)(Account);

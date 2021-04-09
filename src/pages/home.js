/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Store from './store';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import ProductsRetail from '../components/order/ProductsRetail';
import {campaign, dataPoint} from '../actions/rewards.action';
import {getAccountPayment} from '../actions/payment.actions';
import {
  defaultPaymentAccount,
  getUserProfile,
  updateUser,
  userPosition,
} from '../actions/user.action';
import VersionCheck from 'react-native-version-check';
import {Alert, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {Actions} from 'react-native-router-flux';
import {getCartHomePage, getPendingCart} from '../actions/order.action';
import OneSignal from 'react-native-onesignal';
import {dataPromotion} from '../actions/promotion.action';
import {getSVCCard} from '../actions/SVC.action';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onesignalID: null,
    };

    try {
      OneSignal.removeEventListener('received', this.onReceived);
    } catch (e) {}
    try {
      OneSignal.addEventListener('received', this.onReceived);
    } catch (e) {}
  }

  componentDidMount = async () => {
    await this.getDataRewards();
    // this.checkOneSignal();
    this.checkUseApp();
  };

  getDataRewards = async () => {
    try {
      Promise.all([
        this.props.dispatch(campaign()),
        this.props.dispatch(dataPoint()),
        this.props.dispatch(dataPromotion()),
        this.props.dispatch(getSVCCard()),
      ]);
      this.checkUpdateAndVersion();
      await this.setState({isLoading: false});
      this.props.dispatch(getAccountPayment());
      this.props.dispatch(getUserProfile());
      const response = await this.props.dispatch(getAccountPayment());
      await this.checkDefaultPaymentAccount(response);
      this.getDeepLinkiOS();
      await this.getUserPosition();
    } catch (error) {}
  };

  onIds = async device => {
    try {
      if (device.userId != undefined) {
        this.setState({onesignalID: device.userId});
      }
    } catch (e) {}
  };

  onReceived = notification => {
    const scene = Actions.currentScene;
    const page1 = 'paymentDetail';
    const page2 = 'paymentSuccess';
    const page3 = 'settleOrder';
    const page4 = 'hostedTrx';

    // refresh pending cart
    try {
      console.log('try to get pending cart.');
      this.props.dispatch(getPendingCart());
    } catch (e) {}

    try {
      this.props.dispatch(getCartHomePage());
    } catch (e) {}

    // DETECT IN APP PAYMENT
    this.inAppPayment(notification);

    if (
      (notification.payload.title.includes('Payment') ||
        notification.payload.title.includes('Ordering')) &&
      !notification.payload.title.includes('Payment Request') &&
      scene != page1 &&
      scene != page2 &&
      scene != page3 &&
      scene != page4
    ) {
      try {
        Alert.alert(notification.payload.title, notification.payload.body);
      } catch (e) {}
    }
    this._onRefresh();
  };

  _onRefresh = async () => {
    this.setState({refreshing: true, isLoading: true});
    await this.getDataRewards();
    this.setState({refreshing: false, isLoading: false});
  };

  inAppPayment = async notification => {
    try {
      if (notification.payload.launchURL != undefined) {
        const refNo = notification.payload.launchURL.replace(
          `${awsConfig.APP_DEEP_LINK}/payment/`,
          '',
        );
        // await this.props.dispatch(paymentRefNo(refNo));
        Actions.scan({paymentRefNo: refNo});
      }
    } catch (e) {}
  };

  getDeepLinkiOS = async () => {
    try {
      if (this.props.paymentRefNo != undefined) {
        if (Actions.currentScene === 'pageIndex') {
          Actions.scan({paymentRefNo: this.props.paymentRefNo});
        }
      }
    } catch (e) {}
  };

  checkUpdateAndVersion = () => {
    try {
      VersionCheck.needUpdate().then(async res => {
        if (res != null && res != undefined) {
          if (res.isNeeded) {
            Alert.alert(
              'Time to Update!',
              'Updates are already available on the store.',
              [
                {
                  text: 'Later',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Update Now',
                  onPress: () => Linking.openURL(res.storeUrl),
                },
              ],
              {cancelable: false},
            );
          }
        }
      });
    } catch (e) {}
  };

  getUserPosition = async () => {
    try {
      await Geolocation.getCurrentPosition(
        async position => {
          console.log(position, 'position');
          await this.props.dispatch(userPosition(position));
        },
        async error => {
          console.log(error, 'position');
        },
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error, 'error get position');
    }
  };

  checkDefaultPaymentAccount = async response => {
    try {
      const {defaultAccount, companyInfo} = this.props;

      if (response.success == false) {
        await this.props.dispatch(defaultPaymentAccount(undefined));
        return;
      }

      // check if payment provider was deleted
      try {
        if (isEmptyArray(companyInfo.paymentTypes)) {
          await this.props.dispatch(defaultPaymentAccount(undefined));
          return;
        }
      } catch (e) {}
    } catch (e) {}
  };

  checkOneSignal = () => {
    try {
      let user = {};
      try {
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        user = {};
      }

      if (isEmptyArray(user.player_ids)) {
        let player_ids = [];
        player_ids.push(this.state.onesignalID);
        const payload = {
          username: user.username,
          player_ids,
        };
        this.props.dispatch(updateUser(payload));
      }
    } catch (e) {}
  };

  checkUseApp = () => {
    try {
      let user = {};
      try {
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        user = {};
      }

      if (user.isUseApp == undefined) {
        const payload = {
          username: user.username,
          isUseApp: true,
        };
        this.props.dispatch(updateUser(payload));
      }
    } catch (e) {}
  };

  render() {
    const {outletSelectionMode, defaultOutlet} = this.props;
    return (
      <>
        {outletSelectionMode === 'MANUAL' && isEmptyObject(defaultOutlet) ? (
          <Store />
        ) : (
          <ProductsRetail />
        )}
      </>
    );
  }
}

mapStateToProps = state => ({
  outletSelectionMode:
    state.orderReducer.outletSelectionMode.outletSelectionMode,
  defaultOutlet: state.storesReducer.defaultOutlet.defaultOutlet,
  paymentRefNo: state.accountsReducer.paymentRefNo.paymentRefNo,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

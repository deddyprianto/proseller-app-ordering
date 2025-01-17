/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Store from './store';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
// import ProductsRetail from '../components/order/ProductsRetail';
import {campaign, dataPoint} from '../actions/rewards.action';
import {getDefaultOutlet} from '../actions/stores.action';

import {getAccountPayment} from '../actions/payment.actions';
import {
  defaultPaymentAccount,
  getUserProfile,
  updateUser,
  userPosition,
} from '../actions/user.action';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {Actions} from 'react-native-router-flux';
import {
  getCartHomePage,
  getPendingCart,
  openPopupNotification,
} from '../actions/order.action';
import OneSignal from 'react-native-onesignal';
import {dataPromotion} from '../actions/promotion.action';
import {getSVCCard} from '../actions/SVC.action';
import LoadingScreen from '../components/loadingScreen';
import HomeRetail from './HomeRetail';
import HomeFnB from './HomeFnB';
import {getAllowedOrder, getLoginSettings} from '../actions/setting.action';
import {HistoryNotificationModal} from '../components/modal';
import {navigate} from '../utils/navigation.utils';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onesignalID: null,
      refresh: false,
    };
    this.inAppUpdates = new SpInAppUpdates();

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

  componentDidUpdate(prevProps) {
    if (this.props.outletSelectionMode !== prevProps.outletSelectionMode) {
      const loadData = async () => {
        await this.props.dispatch(getDefaultOutlet());
      };

      loadData();
    }
  }

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
      this.props.dispatch(dataPromotion());
      this.props.dispatch(getLoginSettings());
      this.props.dispatch(getAllowedOrder());

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
        navigate('scan', {paymentRefNo: refNo});
      }
    } catch (e) {}
  };

  getDeepLinkiOS = async () => {
    try {
      if (this.props.paymentRefNo != undefined) {
        if (Actions.currentScene === 'pageIndex') {
          navigate('scan', {paymentRefNo: this.props.paymentRefNo});
        }
      }
    } catch (e) {}
  };

  checkUpdateAndVersion = () => {
    this.inAppUpdates.checkNeedsUpdate()
      .then((result) => {
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          this.inAppUpdates.startUpdate(updateOptions);
        }
      }).catch((error) => {
        console.log('Check update failed:', error);
      });
  };

  getUserPosition = async (isHighAccuracy = true) => {
    try {
      await Geolocation.getCurrentPosition(
        async position => {
          await this.props.dispatch(userPosition(position));
        },
        async error => {
          if (Platform.OS === "android" && error.code === 1 || error.code === 2 || error.code === 3) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            granted === PermissionsAndroid.RESULTS.GRANTED &&
              this.getUserPosition(false);
          }
        },
        {enableHighAccuracy: isHighAccuracy, timeout: 3000, maximumAge: 1000},
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

  closePopup = () => {
    this.props.dispatch(openPopupNotification(false));
  };

  render() {
    const {outletSelectionMode, defaultOutlet} = this.props;
    return (
      <>
        <LoadingScreen loading={this.state.isLoading} />
        {outletSelectionMode === 'MANUAL' &&
        isEmptyObject(defaultOutlet) &&
        awsConfig.COMPANY_TYPE === 'Retail' ? (
          <Store />
        ) : awsConfig.COMPANY_TYPE === 'Retail' ? (
          <HomeRetail navigation={this.props.navigation} />
        ) : (
          <HomeFnB
            isRefresh={this.state.refreshing}
            handleOnRefresh={this._onRefresh}
          />
        )}
        <HistoryNotificationModal
          value={this.props.dataNotification}
          open={this.props.popupNotification}
          handleClose={this.closePopup}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  outletSelectionMode:
    state.orderReducer.outletSelectionMode.outletSelectionMode,
  defaultOutlet: state.storesReducer.defaultOutlet.defaultOutlet,
  paymentRefNo: state.accountsReducer.paymentRefNo.paymentRefNo,
  popupNotification: state.orderReducer?.popupNotification?.openPopup,
  dataNotification: state?.orderReducer?.notificationData?.notificationData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  AsyncStorage,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';

import Routes from './config/router';
import Splash from './pages/splash';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {refreshToken} from './actions/auth.actions';
import colorConfig from './config/colorConfig';
import awsConfig from './config/awsConfig';
import OneSignal from 'react-native-onesignal';
import {deviceUserInfo} from './actions/user.action';
import OfflineNotice from './components/OfflineNotice';
import {
  dataStores,
  generateOneMapToken,
  getCompanyInfo,
  getDefaultOutlet,
} from './actions/stores.action';
import {paymentRefNo} from './actions/account.action';
import {getBasket, getTermsConditions} from './actions/order.action';
import NetInfo from '@react-native-community/netinfo';
import {getColorSettings} from './actions/setting.action';
import {reportSentry} from './helper/Sentry';

this.isConnected = false;

class Main extends Component {
  constructor(props) {
    super(props);
    // config for push notification
    OneSignal.setAppId(awsConfig.onesignalID);

    this.state = {
      isLoading: true,
      geolocation: true,
    };

    OneSignal.promptForPushNotificationsWithUserResponse();

    try {
      OneSignal.setNotificationOpenedHandler(notification => {
        this.onOpened(notification);
      });
    } catch (e) {
      console.error('Cannot set notification handler', e);
    }
  }

  componentDidMount = async () => {
    try {
      const response = await NetInfo.fetch();
      this.isConnected = response.isConnected;
    } catch (e) {}

    try {
      await Promise.all([
        this.props.dispatch(dataStores()),
        this.props.dispatch(getTermsConditions()),
        this.props.dispatch(getColorSettings()),
        this.props.dispatch(getDefaultOutlet()),
        this.props.dispatch(generateOneMapToken()),
        this.props.dispatch(getCompanyInfo()),
        this.props.dispatch(refreshToken({isRoot: true})),
        this.props.dispatch(getBasket()),
        this.props.dispatch(getCompanyInfo()),
      ]);

      const data = await this.performTimeConsumingTask();
      if (data !== null) {
        this.setState({isLoading: false});
      }
      this.turnOnLocation();
    } catch (error) {
      reportSentry('error initializing app', null, error);
      console.error('error initializing app => ', error);
    }

    try {
      const deviceState = await OneSignal.getDeviceState();
      await this.onIds(deviceState);
    } catch (e) {
      console.error('Failed to get Device ID', e);
    }
  };

  turnOnLocation = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        if (data == 'already-enabled' || data == 'enabled') {
          this.setState({geolocation: true});
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('result');
      }, 5),
    );
  };

  componentWillUnmount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    // OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = notification => {
    // console.log('Notification diterima: ', notification);
    // if (
    //   notification.payload.title === 'Payment' ||
    //   notification.payload.title === 'Ordering'
    // ) {
    //   try {
    //     Alert.alert(notification.payload.title, notification.payload.body);
    //   } catch (e) {}
    // }
  };

  onOpened = openResult => {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
    this.getDeepLink(openResult);
  };

  getDeepLink = async openResult => {
    try {
      if (Platform.OS === 'ios') {
        if (openResult.notification.payload.launchURL != undefined) {
          const refNo = openResult.notification.payload.launchURL.replace(
            `${awsConfig.APP_DEEP_LINK}/payment/`,
            '',
          );
          await this.props.dispatch(paymentRefNo(refNo));
        }
      }
    } catch (e) {}
    try {
      OneSignal.removeEventListener('opened', this.onOpened);
    } catch (e) {}
  };

  onIds = async device => {
    console.log('Device info: ', device.userId);
    try {
      await this.props.dispatch(deviceUserInfo(device.userId));
    } catch (e) {}
    try {
      await this.props.dispatch(deviceUserInfo(device.userId));
      if (device.userId != null && device.userId != undefined) {
        await AsyncStorage.setItem('deviceID', device.userId);
      }
      await this.props.dispatch(deviceUserInfo(device.userId));
    } catch (error) {
      console.log(error, 'error saving device ID');
    }
  };

  render() {
    const {
      authData: {isLoggedIn},
    } = this.props;

    if (this.state.isLoading || !this.isConnected) {
      return <Splash />;
    }
    return (
      <View style={styles.container1}>
        <StatusBar
          backgroundColor={colorConfig.store.defaultColor}
          barStyle="dark-content"
        />
        <OfflineNotice />
        <Routes isLoggedIn={isLoggedIn} />
      </View>
    );
  }
}

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container1: {
    flex: 1,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    height: 150,
    width: Dimensions.get('window').width - 40,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
  },
  item1: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item2: {
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  item3: {
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    width: 100,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  detail: {
    color: colorConfig.pageIndex.grayColor,
    textAlign: 'center',
  },
  btnText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  authData: state.authReducer.authData,
});

export default connect(
  mapStateToProps,
  null,
)(Main);

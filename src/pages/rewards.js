import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
import {dataPoint, getStamps, campaign} from '../actions/rewards.action';
import {refreshToken} from '../actions/auth.actions';
import {recentTransaction} from '../actions/sales.action';
import RewardsPoint from '../components/rewardsPoint';
import RewardsStamp from '../components/rewardsStamp';
import RewardsMenu from '../components/rewardsMenu';
import RewardsTransaction from '../components/rewardsTransaction';
import Loader from '../components/loader';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import {
  deviceUserInfo,
  getUserProfile,
  updateUser,
  userPosition,
} from '../actions/user.action';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import MyPointsPlaceHolder from '../components/placeHolderLoading/MyPointsPlaceHolder';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import {getDeliveryProvider, getPendingCart} from '../actions/order.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {getCompanyInfo} from '../actions/stores.action';
import {getAccountPayment} from '../actions/payment.actions';
import OneSignal from 'react-native-onesignal';
import {dataInbox} from '../actions/inbox.action';

class Rewards extends Component {
  constructor(props) {
    super(props);

    this.interval = null;

    this.state = {
      dataRewards: [],
      dataPoint: [],
      dataStamp: [],
      dataRecent: [],
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      refreshing: false,
      isLoading: true,
      statusGetData: true,
      onesignalID: null,
    };

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('ids', this.onIds);
  }

  onIds = async device => {
    try {
      if (device.userId != undefined) {
        this.setState({onesignalID: device.userId});
      }
    } catch (e) {}
  };

  onReceived = notification => {
    console.log('Notification received: ', notification);
    this._onRefresh();
  };

  disableStatusGetData = () => {
    this.setState({statusGetData: false});
  };

  enableStatusGetData = () => {
    this.setState({statusGetData: true});
  };

  componentDidMount = async () => {
    await this.getDataRewards();

    await this.props.dispatch(getCompanyInfo());
    await this.props.dispatch(getAccountPayment());

    this.checkOneSignal();
    this.checkUseApp();
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

  refreshStampsAndPoints = async () => {
    try {
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(getStamps());
    } catch (e) {}
  };

  getDataRewards = async () => {
    try {
      await this.getUserPosition();
      await this.props.dispatch(refreshToken());
      await this.props.dispatch(getUserProfile());
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(getStamps());
      await this.props.dispatch(getPendingCart());
      await this.props.dispatch(dataInbox(0, 50));
      await this.props.dispatch(recentTransaction());
      await this.props.dispatch(getDeliveryProvider());

      this.setState({isLoading: false});
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Opps..',
          'Cant Get Data Rewards',
          console.log('Cancel Pressed'),
        ),
      );
    }
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

  _onRefresh = async () => {
    this.setState({refreshing: true, isLoading: true});
    await this.getDataRewards();
    this.setState({refreshing: false, isLoading: false});
  };

  detailStamps() {
    Actions.detailStamps();
  }

  greetWelcomeUser = () => {
    let userDetail = {};
    let status;
    const {intlData} = this.props;
    try {
      // get greeting
      var date = new Date();
      // console.log(date.getHours());
      if (date.getHours() < 12) {
        status = `${intlData.messages.good} ${intlData.messages.morning}`;
      } else if (date.getHours() < 18) {
        status = `${intlData.messages.good} ${intlData.messages.afternoon}`;
      } else {
        status = `${intlData.messages.good} ${intlData.messages.night}`;
      }

      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail.name = 'Users';
    }

    return (
      <View style={{backgroundColor: colorConfig.store.defaultColor}}>
        <Text style={styles.textWelcome}>{status},</Text>
        <Text style={styles.textName}>{userDetail.name.toUpperCase()}</Text>
      </View>
    );
  };

  render() {
    const {campaignActive} = this.props;

    const {intlData} = this.props;
    return (
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.container}>
            {this.state.isLoading ? (
              <View style={styles.loading}>{/*<Loader />*/}</View>
            ) : null}
            <View>
              {this.state.isLoading ? (
                <RewardsStamp isLoading={this.state.isLoading} />
              ) : this.props.dataStamps.dataStamps == undefined ||
                isEmptyObject(this.props.dataStamps.dataStamps) ? (
                this.greetWelcomeUser()
              ) : this.props.dataStamps.dataStamps.length == 0 ? null : (
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.activeTintColor,
                    alignItems: 'center',
                  }}>
                  <RewardsStamp isLoading={this.state.isLoading} />
                  <TouchableOpacity
                    onPress={this.detailStamps}
                    style={{
                      width: 100,
                    }}>
                    <Text style={styles.btn}>
                      {intlData.messages.learnMore}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {this.props.totalPoint == undefined ? (
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.activeTintColor,
                    height: this.state.screenHeight / 3 - 30,
                  }}>
                  {this.state.isLoading ? <MyPointsPlaceHolder /> : null}
                </View>
              ) : (
                <RewardsPoint
                  campaignActive={campaignActive}
                  isLoading={this.state.isLoading}
                />
              )}
              <RewardsMenu
                intlData={intlData}
                myVoucers={this.props.myVoucers}
              />
              <RewardsTransaction
                isLoading={this.state.isLoading}
                screen={this.props}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get('window').height,
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  loading: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // height: Dimensions.get('window').height,
    // justifyContent: 'center',
    top: 0,
    bottom: 0,
    zIndex: 99,
    position: 'absolute',
  },
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textWelcome: {
    fontSize: 18,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
    marginTop: 40,
  },
  textName: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
    padding: 10,
  },
});

mapStateToProps = state => ({
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  dataStamps: state.rewardsReducer.getStamps,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  campaignActive: state.rewardsReducer.dataPoint.campaignActive,
  status: state.userReducer.statusPageIndex.status,
  userDetail: state.userReducer.getUser.userDetails,
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
)(Rewards);

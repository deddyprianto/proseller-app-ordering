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
  Platform,
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
  defaultPaymentAccount,
  deviceUserInfo,
  getUserProfile,
  updateUser,
  userPosition,
} from '../actions/user.action';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import MyPointsPlaceHolder from '../components/placeHolderLoading/MyPointsPlaceHolder';
import {isEmptyArray, isEmptyData, isEmptyObject} from '../helper/CheckEmpty';
import {getDeliveryProvider, getPendingCart} from '../actions/order.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {getCompanyInfo} from '../actions/stores.action';
import {getAccountPayment} from '../actions/payment.actions';
import OneSignal from 'react-native-onesignal';
import {dataInbox} from '../actions/inbox.action';
import {referral} from '../actions/referral.action';
import Icon from 'react-native-vector-icons/EvilIcons';
import {getMandatoryFields} from '../actions/account.action';

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
    const scene = Actions.currentScene;
    const page1 = 'paymentDetail';
    const page2 = 'paymentSuccess';
    const page3 = 'settleOrder';
    // console.log('Notification received: ', notification);

    if (
      (notification.payload.title === 'Payment' ||
        notification.payload.title === 'Ordering') &&
      scene != page1 &&
      scene != page2 &&
      scene != page3
    ) {
      try {
        Alert.alert(notification.payload.title, notification.payload.body);
      } catch (e) {}
    }
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

    this.checkOneSignal();
    this.checkUseApp();
  };

  checkDefaultPaymentAccount = async response => {
    try {
      const {defaultAccount} = this.props;

      if (response.success == false) {
        await this.props.dispatch(defaultPaymentAccount(undefined));
        return;
      }

      try {
        if (isEmptyArray(response.response.data)) {
          await this.props.dispatch(defaultPaymentAccount(undefined));
          return;
        }
      } catch (e) {}

      const MyCardAccount = response.response.data;
      const data = await MyCardAccount.find(
        item => item.id == defaultAccount.id,
      );
      if (data == undefined) {
        await this.props.dispatch(defaultPaymentAccount(undefined));
      }
      return;
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
      await this.props.dispatch(getCompanyInfo());
      // await this.props.dispatch(getMandatoryFields());
      const response = await this.props.dispatch(getAccountPayment());
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(getStamps());
      await this.props.dispatch(getPendingCart());
      await this.props.dispatch(dataInbox(0, 50));
      await this.props.dispatch(recentTransaction());
      await this.props.dispatch(getDeliveryProvider());
      await this.props.dispatch(referral());

      await this.checkDefaultPaymentAccount(response);

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

  editProfile = () => {
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

    var dataDiri = {dataDiri: userDetail};
    Actions.editProfile(dataDiri);
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
              ) : this.props.dataStamps == undefined ||
                isEmptyObject(this.props.dataStamps.dataStamps) ? (
                this.greetWelcomeUser()
              ) : !isEmptyObject(this.props.dataStamps.dataStamps.trigger) &&
                this.props.dataStamps.dataStamps.trigger.campaignTrigger ===
                  'COMPLETE_PROFILE' &&
                this.props.dataStamps.dataStamps.trigger.status === false ? (
                <View style={styles.information}>
                  <View style={styles.boxInfo}>
                    <Text style={styles.textInfo}>
                      {intlData.messages.pleaseCompleteProfileStamps}
                    </Text>
                    <TouchableOpacity
                      onPress={this.editProfile}
                      style={styles.buttonComplete}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        Complete Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.activeTintColor,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={this.detailStamps}
                    style={{
                      width: 100,
                      marginTop: 15,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 32,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {intlData.messages.stampsCard}
                    </Text>
                    <Icon
                      size={32}
                      name={'chevron-right'}
                      style={{color: 'white'}}
                    />
                  </TouchableOpacity>
                  <RewardsStamp isLoading={this.state.isLoading} />
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
  information: {
    backgroundColor: colorConfig.store.defaultColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonComplete: {
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 10,
    marginHorizontal: '20%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  boxInfo: {
    marginHorizontal: '15%',
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colorConfig.store.TransBG,
  },
  textInfo: {
    color: colorConfig.store.colorError,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
});

mapStateToProps = state => ({
  fields: state.accountsReducer.mandatoryFields.fields,
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  defaultAccount: state.userReducer.defaultPaymentAccount.defaultAccount,
  myCardAccount: state.cardReducer.myCardAccount.card,
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

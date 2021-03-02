/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Picker,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import {
  notifikasi,
  sendOTP,
  loginUser,
  resendOTPCognito,
  confirmCodeOTP,
} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import Icon from 'react-native-vector-icons/Ionicons';
import OneSignal from 'react-native-onesignal';
import {deviceUserInfo} from '../actions/user.action';
import BackgroundTimer from 'react-native-background-timer';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    left: -20,
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupText: {
    color: colorConfig.auth.signupText,
    fontSize: 16,
  },
  signupButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
  },
  verifyButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  button: {
    height: 45,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorConfig.auth.buttonText,
    textAlign: 'center',
  },
  errorText: {
    color: colorConfig.auth.errorText,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 30,
  },
  backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
});

class VerifyOtpAfterRegister extends Component {
  constructor(props) {
    super(props);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    this.intlData = this.props.intlData;
    this.state = {
      toggleSMSOTP: true,
      togglePassword: false,
      OTPCode: '',
      showPass: false,
      loading: false,
      initialTimer: 1,
      buttonOTPpressed: false,
      firstLoad: true,
      password: '',
      attemptTry: 0,
      minutes: 1,
      seconds: 0,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount(): void {
    const {confirmed} = this.props;
    if (confirmed == undefined) {
      this.beginTimer();
      this.setState({firstLoad: false, buttonOTPpressed: true});
    }
  }

  beginTimer = () => {
    this.interval = BackgroundTimer.setInterval(() => {
      const {seconds, minutes} = this.state;

      if (seconds > 0) {
        this.setState(({seconds}) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          BackgroundTimer.clearInterval(this.interval);
        } else {
          this.setState(({minutes}) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  };

  componentWillUnmount() {
    // clearInterval(this.interval);
    try {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('ids', this.onIds);
    } catch (e) {}
    try {
      BackgroundTimer.clearInterval(this.interval);
    } catch (e) {}
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

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

  componentDidUpdate() {
    if (this.state.seconds === 0 && this.state.minutes == 0) {
      // clearInterval(this.interval);
      try {
        BackgroundTimer.clearInterval(this.interval);
      } catch (e) {}
      this.setState({
        minutes: this.state.initialTimer,
        buttonOTPpressed: false,
      });
    }
  }

  sendOTP = async () => {
    this.setState({loading: true, firstLoad: false, buttonOTPpressed: true});
    try {
      this.beginTimer();
      var dataRequest = {
        phoneNumber: this.props.phoneNumber,
      };
      console.log(dataRequest, 'payload send otp');
      const response = await this.props.dispatch(resendOTPCognito(dataRequest));
      console.log(response, 'response send OTP dari register');
      if (response) {
        this.setState({
          loading: false,
          attemptTry: this.state.attemptTry + 1,
        });
      } else {
        this.setState({
          loading: false,
          buttonOTPpressed: false,
        });
        Alert.alert('Opss..', this.intlData.incorectOTPCode);
      }
    } catch (error) {
      Alert.alert('Opss..', this.intlData.somethingWentWrong);
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
  };
  confirmCodeOTP = async () => {
    this.setState({loading: true});
    try {
      var dataLogin = {
        phoneNumber: this.props.phoneNumber,
        confirmationCode: this.state.OTPCode,
      };
      const response = await this.props.dispatch(confirmCodeOTP(dataLogin));
      console.log(response, 'response confirm OTP dari register');
      if (response) {
        this.submitLogin();
      } else {
        await this.props.dispatch(
          notifikasi(
            "We're Sorry...",
            response.responseBody.Data.message,
            console.log('Cancel Pressed'),
          ),
        );
      }
    } catch (error) {
      this.setState({loading: false});
      await this.props.dispatch(
        notifikasi(
          "We're Sorry...",
          'Something went wrong, please try again',
          console.log('Cancel Pressed'),
        ),
      );
    }
  };
  submitLogin = async () => {
    this.setState({loading: true});
    try {
      var dataLogin = {
        phoneNumber: this.props.phoneNumber,
        // password: this.props.password,
        codeOTP: this.state.OTPCode,
        isUseApp: true,
        player_ids: this.props.deviceID.deviceID,
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      console.log(response, 'response login');
      if (response.status == false) {
        this.setState({loading: false});
        Alert.alert('Opss..', response.message);
      }
    } catch (error) {
      this.setState({loading: false});
      await this.props.dispatch(
        notifikasi(
          "We're Sorry...",
          'Something went wrong, please try again',
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  zeroPad = (num, places) => {
    try {
      return String(num).padStart(places, '0');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {intlData} = this.props;
    let {minutes, seconds} = this.state;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView>
          <Header titleHeader={'Mobile Sign In'} backButton={true} />
          <View style={{margin: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.store.title,
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                }}>
                {intlData.messages.signIn} {intlData.messages.to}{' '}
                {this.props.phoneNumber}
              </Text>
            </View>

            {/*Form login by OTP*/}
            {this.state.toggleSMSOTP ? (
              <View style={{marginVertical: 15}}>
                <Text
                  style={{
                    marginVertical: 10,
                    color: colorConfig.pageIndex.grayColor,
                  }}>
                  {intlData.messages.enter} 4-digit OTP
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    keyboardType={'numeric'}
                    maxLength={4}
                    secureTextEntry={true}
                    value={this.state.OTPCode}
                    onChangeText={value => this.setState({OTPCode: value})}
                    style={{
                      fontSize: 20,
                      width: '45%',
                      fontFamily: 'Poppins-Regular',
                      padding: 12,
                      color: colorConfig.pageIndex.grayColor,
                      borderColor: colorConfig.pageIndex.inactiveTintColor,
                      borderWidth: 2,
                      borderRadius: 13,
                    }}
                  />
                  <TouchableHighlight
                    disabled={
                      this.state.minutes === this.state.initialTimer
                        ? false
                        : true
                    }
                    onPress={this.sendOTP}
                    style={{
                      padding: 15,
                      width: '50%',
                      borderRadius: 10,
                      backgroundColor:
                        this.state.minutes === this.state.initialTimer
                          ? colorConfig.store.defaultColor
                          : colorConfig.store.disableButton,
                    }}>
                    <Text
                      style={{
                        color: colorConfig.store.textWhite,
                        fontSize: 16,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {intlData.messages.get} OTP via SMS
                    </Text>
                  </TouchableHighlight>
                </View>
                {this.state.buttonOTPpressed ? (
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Text
                      style={{
                        color: colorConfig.pageIndex.grayColor,
                        fontSize: 16,
                      }}>
                      {intlData.messages.resendAfter} {minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View style={{marginVertical: 15}}>
              <TouchableHighlight
                onPress={this.submitLogin}
                disabled={
                  this.state.OTPCode != '' && this.state.OTPCode != null
                    ? false
                    : true
                }
                style={{
                  padding: 15,
                  marginTop: 40,
                  borderRadius: 10,
                  backgroundColor:
                    this.state.OTPCode != '' && this.state.OTPCode != null
                      ? colorConfig.store.defaultColor
                      : colorConfig.store.disableButton,
                }}>
                <Text
                  style={{
                    color: colorConfig.store.textWhite,
                    fontSize: 18,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {intlData.messages.submit}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  status: state.accountsReducer.accountExist.status,
  deviceID: state.userReducer.deviceUserInfo,
  attempt: state.authReducer.attemptSendOTP.attempt,
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
  reduxForm({
    form: 'confirm',
  }),
)(VerifyOtpAfterRegister);

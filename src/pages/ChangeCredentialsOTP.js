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
  Animated,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Alert,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import {sendOTP} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/Ionicons';
import {getUserProfile, requestOTP, updateUser} from '../actions/user.action';
import HeaderV2 from '../components/layout/header/HeaderV2';
import appConfig from '../config/appConfig';

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
  header: {
    // height: 65,
    paddingVertical: 6,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
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
  mainContainer: {
    marginTop: 32,
  },
});

class ChangeCredentialsOTP extends Component {
  constructor(props) {
    super(props);

    const {initialTimer} = this.props;

    this.state = {
      toggleSMSOTP: true,
      togglePassword: false,
      OTPCode: '',
      showPass: false,
      loading: false,
      initialTimer,
      buttonOTPpressed: false,
      firstLoad: true,
      password: '',
      attemptTry: 0,
      minutes: initialTimer,
      seconds: 0,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount() {
    this.beginTimer();
    this.setState({firstLoad: false, buttonOTPpressed: true});
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
      BackgroundTimer.clearInterval(this.interval);
    } catch (e) {}
  }

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
    this.setState({loading: true, firstLoad: false});
    this.setState({buttonOTPpressed: true});
    try {
      this.beginTimer();
      this.submitOTP();
    } catch (error) {}
  };

  submitOTP = async () => {
    const {mode, address} = this.props;

    try {
      let dataProfile = {
        username: this.props.dataDiri.username,
        cognitoUsername: this.props.dataDiri.cognitoUsername,
      };

      // detect change email
      if (mode === 'Email') {
        dataProfile.newEmail = address.toLowerCase();
      } else {
        dataProfile.newPhoneNumber = address;
      }

      const response = await this.props.dispatch(requestOTP(dataProfile));

      if (response) {
        this.setState({
          loading: false,
          // attemptTry: this.state.attemptTry + 1,
        });
      } else {
        this.setState({loading: false});
        Alert.alert('Sorry', 'Please try again');
      }
    } catch (e) {
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
    this.setState({loading: false});
  };

  submitLogin = async otp => {
    try {
      const {mode, address} = this.props;
      let OTPCode = this.state.OTPCode;
      if (otp != undefined) OTPCode = otp;

      this.setState({loading: true});
      let dataProfile = {
        username: this.props.dataDiri.username,
        cognitoUsername: this.props.dataDiri.cognitoUsername,
        otp: OTPCode,
      };

      // detect change email
      if (mode === 'Email') {
        dataProfile.newEmail = address.toLowerCase();
      } else {
        dataProfile.newPhoneNumber = address;
      }

      const response = await this.props.dispatch(updateUser(dataProfile));

      if (response.success) {
        await this.props.dispatch(getUserProfile());
        Actions.popTo('pageIndex');
        Alert.alert('Profile Updated!', `Your ${mode} has been updated.`);
      } else {
        try {
          Alert.alert('Oppss', response.responseBody.Data.message);
        } catch (e) {
          Alert.alert('Sorry', 'Please try again');
        }
        await this.props.dispatch(getUserProfile());
      }
      this.setState({loading: false});
    } catch (e) {
      Alert.alert('Sorry', 'Please try again');
      this.setState({loading: false});
    }
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    const {intlData, address, mode} = this.props;
    let {minutes, seconds} = this.state;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <HeaderV2 isCenterLogo={appConfig.appName !== 'fareastflora'} />
        <View style={styles.mainContainer}>
          <View />
          {/* <View>
            <Text
              style={{
                color: colorConfig.store.title,
                fontSize: 15,
                fontFamily: 'Poppins-Medium',
              }}>
              You will receive 4-digit verification code via{' '}
              <Text style={{color: colorConfig.store.secondaryColor}}>
                {address}
              </Text>
            </Text>
          </View> */}

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
                  autoFocus={true}
                  keyboardType={'numeric'}
                  maxLength={4}
                  secureTextEntry={true}
                  value={this.state.OTPCode}
                  onChangeText={value => {
                    this.setState({OTPCode: value});
                    if (value.length == 4) this.submitLogin(value);
                  }}
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
                    {intlData.messages.resend} OTP
                  </Text>
                </TouchableHighlight>
              </View>
              {this.state.buttonOTPpressed ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
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
                Confirm
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  attempt: state.authReducer.attemptSendOTP.attempt,
  intlData: state.intlData,
});

const mapDispatchToProps = dispatch => ({
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
)(ChangeCredentialsOTP);

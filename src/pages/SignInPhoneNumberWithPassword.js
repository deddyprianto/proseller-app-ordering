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
  TouchableHighlight,
  Alert,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import {notifikasi, sendOTP, loginUser} from '../actions/auth.actions';
import Loader from '../components/loader';
import colorConfig from '../config/colorConfig';
import Header from '../components/atom/header';
import Icon from 'react-native-vector-icons/Ionicons';
import {isEmptyObject} from '../helper/CheckEmpty';

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

class SignInPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.seconds = null;
    this.intlData = this.props.intlData;
    this.state = {
      toggleSMSOTP: false,
      togglePassword: true,
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
    // this.sendOTP();
  }

  beginTimer() {
    this.interval = setInterval(() => {
      const {seconds, minutes} = this.state;

      if (seconds > 0) {
        this.setState(({seconds}) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.interval);
        } else {
          this.setState(({minutes}) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    if (this.state.seconds === 0 && this.state.minutes == 0) {
      clearInterval(this.interval);
      this.setState({
        minutes: this.state.initialTimer,
        buttonOTPpressed: false,
      });
    }
  }

  hashEmail = async email => {
    try {
      let newEmail = email.split('');
      let length = email.length;
      await newEmail.map((item, idx) => {
        if (
          item != '@' &&
          idx != 0 &&
          idx != length &&
          idx != length - 1 &&
          idx != length - 2 &&
          idx != length - 3 &&
          idx != length - 4 &&
          idx != length - 5 &&
          idx != length - 6
        ) {
          newEmail[idx] = '*';
        }
      });
      return newEmail.join('');
    } catch (e) {
      return email;
    }
  };

  sendOTPEmail = async () => {
    this.setState({initialTimer: 5, minutes: 5});
    this.setState({loading: true, firstLoad: false});
    this.beginTimer();
    try {
      var dataRequest = {
        email: this.props.email,
      };
      console.log(dataRequest, 'payload send otp');
      const response = await this.props.dispatch(sendOTP(dataRequest));
      console.log(response, 'respon send otp');
      if (response == true) {
        this.setState({
          loading: false,
          attemptTry: this.state.attemptTry + 1,
          buttonOTPpressed: true,
        });
        let email = await this.hashEmail(this.props.email);
        Alert.alert(
          `${this.intlData.messages.otpCodeSent}`,
          `${this.intlData.messages.otpSent} ${email}`,
        );
      } else {
        this.setState({
          loading: false,
          buttonOTPpressed: false,
        });
        Alert.alert('Opss..', `${this.intlData.messages.cantSendOTPCode}`);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
  };

  sendOTP = async () => {
    this.setState({loading: true, firstLoad: false, buttonOTPpressed: true});
    try {
      this.beginTimer();
      var dataRequest = {
        phoneNumber: this.props.phoneNumber,
      };
      console.log(dataRequest, 'payload send otp');
      const response = await this.props.dispatch(sendOTP(dataRequest));
      console.log('response ', response);
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
        Alert.alert('Opss..', `${this.intlData.messages.cantSendOTPCode}`);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
  };

  submitLoginByPassword = async () => {
    this.setState({loading: true});
    try {
      var dataLogin = {
        phoneNumber: this.props.phoneNumber,
        password: this.state.password,
        isUseApp: true,
        player_ids: this.props.deviceID.deviceID,
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      if (response.status == false) {
        this.setState({loading: false});
        Alert.alert('Opss..', response.message);
      } else if (response.code == 'UserNotConfirmedException') {
        this.setState({loading: false});
        Alert.alert('Opss..', response.message);
      } else if (
        response.status == undefined &&
        isEmptyObject(response.accessToken)
      ) {
        this.setState({loading: false});
        Alert.alert(
          'Sorry',
          'An error occurred on the server, please try again.',
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
        codeOTP: this.state.OTPCode,
        isUseApp: true,
        player_ids: this.props.deviceID.deviceID,
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      if (response.status == false) {
        this.setState({loading: false});
        Alert.alert('Opss..', response.message);
      } else if (response.code == 'UserNotConfirmedException') {
        this.setState({loading: false});
        Alert.alert('Opss..', response.message);
      } else if (
        response.status == undefined &&
        isEmptyObject(response.accessToken)
      ) {
        this.setState({loading: false});
        Alert.alert(
          'Sorry',
          'An error occurred on the server, please try again.',
        );
      }
    } catch (error) {
      this.setState({loading: false});
      await this.props.dispatch(
        notifikasi("We're Sorry...", 'Something went wrong, please try again'),
      );
    }
  };

  render() {
    const {intlData} = this.props;
    let {minutes, seconds} = this.state;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header titleHeader={'Mobile Sign In'} backButton={true} />
          <View style={{margin: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.store.titleSelected,
                  fontSize: 15,
                  fontFamily: 'Poppins-Regular',
                }}>
                {intlData.messages.signIn} {intlData.messages.to}{' '}
                {this.props.phoneNumber}
              </Text>
            </View>

            <View style={{marginVertical: 15}}>
              <Text
                style={{
                  marginVertical: 10,
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {intlData.messages.enter} {intlData.messages.password}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  secureTextEntry={this.state.showPass ? false : true}
                  value={this.state.password}
                  onChangeText={value =>
                    this.setState({password: value.trim()})
                  }
                  style={{
                    fontSize: 20,
                    width: '100%',
                    fontFamily: 'Poppins-Regular',
                    padding: 12,
                    color: colorConfig.store.title,
                    borderColor: colorConfig.pageIndex.inactiveTintColor,
                    borderWidth: 2,
                    borderRadius: 13,
                  }}
                />
                <TouchableOpacity
                  style={{position: 'absolute', top: 14, right: 20}}
                  onPress={() =>
                    this.setState({showPass: !this.state.showPass})
                  }>
                  <Icon
                    name={this.state.showPass == true ? 'md-eye-off' : 'md-eye'}
                    size={26}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginVertical: 15}}>
              <TouchableHighlight
                disabled={
                  this.state.password !== '' && this.state.password != null
                    ? false
                    : true
                }
                onPress={this.submitLoginByPassword}
                style={{
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor:
                    this.state.password != '' && this.state.password != null
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
)(SignInPhoneNumber);

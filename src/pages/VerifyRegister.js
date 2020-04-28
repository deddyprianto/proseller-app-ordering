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
  TouchableHighlight,
  Alert,
  SafeAreaView
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import {sendOTP} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import phoneNumber from 'react-native-phone-input/lib/phoneNumber';

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

class VerifyRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      phone: '',
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  sendOTPEmail = async () => {
    console.log('INI SENT OTP EMAIL', this.props.password);
    this.setState({loading: true, firstLoad: false});
    try {
      let phoneNumber = {
        phoneNumber: this.props.phoneNumber,
        password: this.props.password,
        email: this.props.email,
        fromMethod: 'email',
      };
      this.setState({loading: false});
      Actions.verifyOtpAfterRegisterEmail(phoneNumber);
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
  };

  sendOTP = async () => {
    this.setState({loading: true, firstLoad: false});
    try {
      let phoneNumber = {
        phoneNumber: this.props.phoneNumber,
        password: this.props.password,
        email: this.props.email,
        fromMethod: 'mobile',
      };
      this.setState({loading: false});
      Actions.verifyOtpAfterRegister(phoneNumber);
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
        buttonOTPpressed: false,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView>
          <Header
            titleHeader={
              this.props.fromMethod == 'mobile'
                ? 'Mobile Register'
                : 'Email Register'
            }
            backButton={true}
          />
          <View style={{margin: 20}}>
            <Text
              style={{
                color: colorConfig.store.title,
                fontSize: 16,
                marginBottom: 70,
                width: '80%',
                fontFamily: 'Lato-Medium',
              }}>
              You will receive 4-digit verification code via
              {this.props.fromMethod == 'mobile' ? (
                <Text> SMS </Text>
              ) : (
                <Text> Email </Text>
              )}
              at :
            </Text>
            {this.props.fromMethod == 'mobile' ? (
              <Text
                style={{
                  color: colorConfig.store.title,
                  fontSize: 28,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: 60,
                  fontFamily: 'Lato-Bold',
                }}>
                {this.props.phoneNumber}
              </Text>
            ) : (
              <Text
                style={{
                  color: colorConfig.store.title,
                  fontSize: 23,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: 60,
                  fontFamily: 'Lato-Bold',
                }}>
                {this.props.email}
              </Text>
            )}
            <View style={{marginVertical: 15}}>
              {this.props.fromMethod == 'mobile' ? (
                <TouchableHighlight
                  onPress={this.sendOTP}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: colorConfig.store.defaultColor,
                  }}>
                  <Text
                    style={{
                      color: colorConfig.store.textWhite,
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontFamily: 'Lato-Medium',
                    }}>
                    Continue
                  </Text>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  onPress={this.sendOTPEmail}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: colorConfig.store.defaultColor,
                  }}>
                  <Text
                    style={{
                      color: colorConfig.store.textWhite,
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontFamily: 'Lato-Medium',
                    }}>
                    Continue
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  status: state.accountsReducer.accountExist.status,
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
)(VerifyRegister);

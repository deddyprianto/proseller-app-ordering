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
  Linking,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
// import AwesomeAlert from 'react-native-awesome-alerts';
import {
  createNewUserByPassword,
  loginUser,
  notifikasi,
} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import generate from 'password-generation';
import CountryPicker from '../components/react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';
import OneSignal from 'react-native-onesignal';
import {deviceUserInfo} from '../actions/user.action';
import Icon from 'react-native-vector-icons/Ionicons';

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

class EmailRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: awsConfig.COUNTRY,
      companyName: awsConfig.COMPANY_NAME,
      companyPolicyURL: awsConfig.COMPANY_POLICY_URL,
      phoneNumber: awsConfig.phoneNumberCode,
      phone: '',
      loading: false,
      name: '',
      email: '',
      openModalCountry: false,
      password: '',
      retypePassword: '',
      showPass: false,
      passwordInvalid: false,
    };

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    this.imageWidth = new Animated.Value(styles.$largeImageSize);
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

  componentWillUnmount() {
    clearInterval(this.interval);
    try {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('ids', this.onIds);
    } catch (e) {}
  }

  generatePassword = () => {
    try {
      return generate([8], {specials: 0, nums: 2, uppers: 3, lowers: 3});
    } catch (e) {
      return 'P@ssw0rd123';
    }
  };

  submitRegister = async () => {
    this.setState({loading: true});
    const {password, retypePassword, passwordInvalid} = this.state;
    if (passwordInvalid) {
      Alert.alert('Sorry', 'Please use a valid password');
      this.setState({loading: false});
      return;
    }

    if (password != retypePassword) {
      Alert.alert('Sorry', 'Retype password is different from password');
      this.setState({loading: false});
      return;
    }
    if (password != '' && password.length < 8) {
      Alert.alert('Sorry', 'Password consists of 8 characters or more');
      this.setState({loading: false});
      return;
    }

    try {
      var dataRequest = {
        username: this.props.email,
        phoneNumber: this.state.phoneNumber + this.state.phone,
        email: this.props.email,
        name: this.state.name,
        type: 'userPool',
        password: this.state.password,
      };
      console.log(dataRequest, 'payload register by email');
      const response = await this.props.dispatch(
        createNewUserByPassword(dataRequest),
      );
      console.log(response, 'responsenya');
      if (response == true) {
        this.submitLogin();
      } else {
        this.setState({
          loading: false,
        });
        Alert.alert('Oopss..', response.Data.message);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  submitLogin = async () => {
    try {
      var dataLogin = {
        email: this.props.email,
        password: this.state.password,
        isUseApp: true,
        player_ids: this.props.deviceID.deviceID,
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      console.log(response, 'response login');
      if (response.status == false) {
        Alert.alert('Opss..', response.message);
        this.setState({loading: false});
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

  render() {
    const {intlData} = this.props;
    const {name, phone, passwordInvalid} = this.state;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header titleHeader={'Email Register'} backButton={true} />
          <View style={{width: 0, height: 0}}>
            <CountryPicker
              translation="eng"
              withCallingCode
              visible={this.state.openModalCountry}
              onClose={() => this.setState({openModalCountry: false})}
              withFilter
              placeholder={`x`}
              withFlag={true}
              onSelect={country => {
                this.setState({
                  phoneNumber: `+${country.callingCode[0]}`,
                  country: country.name,
                });
              }}
            />
          </View>
          <View style={{margin: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.store.title,
                  fontSize: 15,
                  fontFamily: 'Lato-Bold',
                }}>
                {intlData.messages.register} {intlData.messages.for}{' '}
                {this.props.email}
              </Text>
            </View>
          </View>
          <View style={{marginHorizontal: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                {intlData.messages.name}
              </Text>
              <TextInput
                placeholder={intlData.messages.fullName}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                style={{
                  fontSize: 15,
                  fontFamily: 'Lato-Medium',
                  padding: 12,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 1,
                  borderRadius: 13,
                }}
              />
            </View>
            <View style={{marginVertical: 5}}>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 5,
                  fontSize: 17,
                }}>
                {intlData.messages.phoneNumber}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                flexDirection: 'row',
                color: colorConfig.store.title,
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  maxWidth: '100%',
                }}>
                <PhoneInput
                  flagStyle={{
                    width: 35,
                    height: 25,
                    justifyContent: 'center',
                    marginRight: -5,
                    marginLeft: 5,
                  }}
                  textStyle={{fontSize: 0, fontFamily: 'Lato-Medium'}}
                  style={{
                    padding: 5,
                    color: 'black',
                    backgroundColor: colorConfig.store.transparentBG,
                    borderRadius: 5,
                  }}
                  ref={ref => {
                    this.phone = ref;
                  }}
                  onChangePhoneNumber={() => {
                    this.setState({phone: this.phone.getValue()});
                  }}
                  value={this.state.phoneNumber}
                  onPressFlag={() => {
                    this.setState({
                      openModalCountry: true,
                    });
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      openModalCountry: true,
                    });
                  }}
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <Text style={{fontSize: 18, fontFamily: 'Lato-Medium'}}>
                    {this.state.phoneNumber}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder={'Phone Number'}
                  value={this.state.phone}
                  keyboardType={'numeric'}
                  onChangeText={value => this.setState({phone: value})}
                  style={{
                    fontSize: 17,
                    fontFamily: 'Lato-Medium',
                    paddingHorizontal: 10,
                    paddingVertical: 11,
                    color: colorConfig.store.title,
                    borderColor: colorConfig.pageIndex.inactiveTintColor,
                    borderWidth: 1,
                    borderRadius: 10,
                    flex: 1,
                  }}
                />
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={'Password'}
                  secureTextEntry={this.state.showPass ? false : true}
                  value={this.state.password}
                  onChangeText={value => {
                    this.setState({password: value.trim()});
                    try {
                      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
                        this.setState({passwordInvalid: true});
                      } else {
                        this.setState({passwordInvalid: false});
                      }
                    } catch (e) {}
                  }}
                  style={{
                    fontSize: 15,
                    width: '100%',
                    fontFamily: 'Lato-Medium',
                    padding: 12,
                    color: colorConfig.store.title,
                    borderColor: colorConfig.pageIndex.inactiveTintColor,
                    borderWidth: 1,
                    borderRadius: 13,
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 20,
                  }}
                  onPress={() =>
                    this.setState({
                      showPass: !this.state.showPass,
                    })
                  }>
                  <Icon
                    name={this.state.showPass == true ? 'md-eye-off' : 'md-eye'}
                    size={26}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>
              {passwordInvalid && (
                <Text
                  style={{color: colorConfig.store.colorError, fontSize: 12}}>
                  Password must contain at least 1 uppercase, 1 lowercase
                  character
                </Text>
              )}
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                Retype Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  placeholder={'Retype your password'}
                  secureTextEntry={this.state.showPass ? false : true}
                  value={this.state.retypePassword}
                  onChangeText={value =>
                    this.setState({retypePassword: value.trim()})
                  }
                  style={{
                    fontSize: 15,
                    width: '100%',
                    fontFamily: 'Lato-Medium',
                    padding: 12,
                    color: colorConfig.store.title,
                    borderColor: colorConfig.pageIndex.inactiveTintColor,
                    borderWidth: 1,
                    borderRadius: 13,
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 20,
                  }}
                  onPress={() =>
                    this.setState({
                      showPass: !this.state.showPass,
                    })
                  }>
                  <Icon
                    name={this.state.showPass == true ? 'md-eye-off' : 'md-eye'}
                    size={26}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginVertical: 30}}>
              <TouchableHighlight
                disabled={name && phone ? false : true}
                onPress={this.submitRegister}
                style={{
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor:
                    name && phone
                      ? colorConfig.store.defaultColor
                      : colorConfig.store.disableButton,
                }}>
                <Text
                  style={{
                    color: colorConfig.store.textWhite,
                    fontSize: 18,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Lato-Medium',
                  }}>
                  {intlData.messages.createAccount}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{marginHorizontal: 19, marginBottom: 40}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: colorConfig.pageIndex.grayColor,
                  fontFamily: 'Lato-Medium',
                }}>
                {intlData.messages.string1}{' '}
                <Text
                  style={{
                    fontSize: 15,
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyName}
                </Text>{' '}
                {intlData.messages.string2}
                <Text
                  style={{
                    fontSize: 15,
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyName}
                </Text>{' '}
                {intlData.messages.string3}
                <Text
                  onPress={() => Linking.openURL(this.state.companyPolicyURL)}
                  style={{
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyPolicyURL}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  deviceID: state.userReducer.deviceUserInfo,
  status: state.accountsReducer.accountExist.status,
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
)(EmailRegister);

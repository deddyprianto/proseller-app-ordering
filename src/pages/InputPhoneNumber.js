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
  Platform,
  TouchableHighlight,
  Alert,
  AsyncStorage,
  PermissionsAndroid,
  Keyboard,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import {checkAccountExist} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import CountryPicker from '../components/react-native-country-picker-modal';
import {deviceUserInfo, userPosition} from '../actions/user.action';
import Geolocation from '@react-native-community/geolocation';
// import packageJson from '../../package';
import PhoneInput from 'react-native-phone-input';
// import VersionCheck from 'react-native-version-check';
import {getCompanyInfo} from '../actions/stores.action';
import {getMandatoryFields} from '../actions/account.action';
import {navigate} from '../utils/navigation.utils';

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

class InputPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.intlData = this.props.intlData;
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      phone: '',
      country: awsConfig.COUNTRY,
      openModalCountry: false,
      dialogChangeLanguage: false,
      showFooter: true,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount = async () => {
    const {loginByMobile} = this.props;
    if (loginByMobile === false) {
      Actions.replace('inputEmail');
    }

    // detect keyboard up / down
    this.props.dispatch(getMandatoryFields());
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    try {
      await this.props.dispatch(getCompanyInfo());
    } catch (e) {}

    // get device ID for push notif
    try {
      const value = await AsyncStorage.getItem('deviceID');
      if (value !== null) {
        await this.props.dispatch(deviceUserInfo(value));
      }
    } catch (error) {
      console.log(error, 'error retrieve data from async');
    }

    // permition to get user position
    this.getUserLocation();
  };

  getUserLocation = async () => {
    if (Platform.OS !== 'android') Geolocation.requestAuthorization();
    else {
      try {
        let granted = await this.askToAccessLocation();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          this.getUserLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  askToAccessLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'we need GPS location service',
        message: 'we need location service to provide your location',
        // buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted;
  };

  _keyboardDidShow = () => {
    this.setState({showFooter: false});
  };

  _keyboardDidHide = () => {
    this.setState({showFooter: true});
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  checkAccountExist = async () => {
    const {companyInfo, enableRegisterWithPassword} = this.props;
    this.setState({loading: true});
    try {
      var dataRequest = {
        phoneNumber: this.state.phoneNumber + this.state.phone,
      };
      let phoneNumber = {
        phoneNumber: dataRequest.phoneNumber,
      };
      // console.log(dataRequest, 'payload check account');
      const response = await this.props.dispatch(
        checkAccountExist(dataRequest),
      );
      if (response.status == true) {
        if (response.data.confirmation == false) {
          phoneNumber.email = response.data.email;
          phoneNumber.confirmed = false;

          // check mode sign in ( by password or by OTP )
          if (enableRegisterWithPassword) {
            navigate('signInPhoneNumberWithPassword', phoneNumber);
          } else {
            navigate('signInPhoneNumber', phoneNumber);
          }
        } else if (response.data.status == 'SUSPENDED') {
          Alert.alert(
            'Sorry',
            `Your account has been ${
              response.data.status
            }. Please contact administrator.`,
          );
        } else {
          phoneNumber.email = response.data.email;
          // check mode sign in ( by password or by OTP )
          if (enableRegisterWithPassword) {
            navigate('signInPhoneNumberWithPassword', phoneNumber);
          } else {
            navigate('signInPhoneNumber', phoneNumber);
          }
        }
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        navigate('mobileRegister', phoneNumber);
      }
    } catch (error) {
      Alert.alert('Opss..', this.intlData.messages.somethingWentWrong);
      this.setState({
        loading: false,
      });
    }
  };

  getUserPosition = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      await Geolocation.getCurrentPosition(
        async position => {
          await this.props.dispatch(userPosition(position));
        },
        async error => {},
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error, 'error get position');
    }
  };

  render() {
    const {intlData, loginByEmail} = this.props;
    this.getUserPosition();
    let backButton = false;
    if (Actions.currentScene !== 'pageIndex') {
      backButton = true;
    }

    return (
      <>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <SafeAreaView>
            <Header
              titleHeader={'Mobile Sign In / Register'}
              backButton={backButton}
            />
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
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  fontSize: 15,
                  marginBottom: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
                {intlData.messages.enterMobileNumber}
              </Text>
              <View
                style={{
                  marginVertical: 10,
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
                    textStyle={{fontSize: 0, fontFamily: 'Poppins-Regular'}}
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
                    <Text style={{fontSize: 18, fontFamily: 'Poppins-Regular'}}>
                      {this.state.phoneNumber}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    value={this.state.phone}
                    keyboardType={'numeric'}
                    onChangeText={value => {
                      try {
                        if (value[0] !== 0 && value[0] !== '0') {
                          this.setState({phone: value});
                        }
                      } catch (e) {
                        this.setState({phone: value});
                      }
                    }}
                    style={{
                      fontSize: 17,
                      fontFamily: 'Poppins-Regular',
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      color: colorConfig.store.title,
                      borderColor: colorConfig.pageIndex.inactiveTintColor,
                      borderWidth: 1,
                      borderRadius: 10,
                      flex: 1,
                    }}
                  />
                </View>
              </View>
              <View style={{marginVertical: 15}}>
                <TouchableHighlight
                  disabled={this.state.phone == '' ? true : false}
                  onPress={this.checkAccountExist}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor:
                      this.state.phone == ''
                        ? colorConfig.store.disableButton
                        : colorConfig.store.defaultColor,
                  }}>
                  <Text
                    style={{
                      color: colorConfig.store.textWhite,
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    {intlData.messages.next}
                  </Text>
                </TouchableHighlight>
              </View>
              {loginByEmail === true ? (
                <View style={{marginTop: 30}}>
                  <TouchableOpacity onPress={() => navigate('inputEmail')}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontFamily: 'Poppins-Regular',
                        textAlign: 'center',
                        color: colorConfig.store.secondaryColor,
                        fontSize: 17,
                      }}>
                      {intlData.messages.useEmail}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = state => ({
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  status: state.accountsReducer.accountExist.status,
  deviceID: state.userReducer.deviceUserInfo,
  intlData: state.intlData,
  enableRegisterWithPassword:
    state.orderReducer.orderingSetting.enableRegisterWithPassword,
  loginByEmail: state.orderReducer.orderingSetting.loginByEmail,
  loginByMobile: state.orderReducer.orderingSetting.loginByMobile,
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
)(InputPhoneNumber);

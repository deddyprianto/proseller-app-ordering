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
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import CountryPicker from '../components/react-native-country-picker-modal';
import {deviceUserInfo, requestOTP} from '../actions/user.action';
import Geolocation from 'react-native-geolocation-service';
import PhoneInput from 'react-native-phone-input';
import {getCompanyInfo} from '../actions/stores.action';
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
});

class ChangeCredentials extends Component {
  constructor(props) {
    super(props);
    this.intlData = this.props.intlData;
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      phone: '',
      email: '',
      country: awsConfig.COUNTRY,
      openModalCountry: false,
      dialogChangeLanguage: false,
      showFooter: true,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount = async () => {
    // detect keyboard up / down
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
    if (Platform.OS !== 'android') {
      Geolocation.requestAuthorization();
    } else {
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

  submitOTP = async () => {
    const {phone, email, phoneNumber} = this.state;
    const {mode} = this.props;

    this.setState({loading: true});
    try {
      let dataProfile = {
        username: this.props.dataDiri.username,
        cognitoUsername: this.props.dataDiri.cognitoUsername,
      };

      // detect change email
      if (mode === 'Email') {
        dataProfile.newEmail = email.toLowerCase();
      } else {
        dataProfile.newPhoneNumber = phoneNumber + phone;
      }

      const response = await this.props.dispatch(requestOTP(dataProfile));

      if (response.success) {
        let address = phoneNumber + phone;
        let initialTimer = 1;
        if (mode === 'Email') {
          address = email;
          initialTimer = 5;
        }
        Actions.push('changeCredentialsOTP', {
          mode,
          address,
          initialTimer,
          dataDiri: this.props.dataDiri,
        });
      } else {
        let message = 'Please try again';
        try {
          message = response.responseBody.Data.message;
        } catch (e) {}
        Alert.alert('Sorry', message);
      }
    } catch (e) {}
    this.setState({loading: false});
  };

  goBack = async () => {
    Actions.pop();
  };

  checkMode = () => {
    const {mode} = this.props;
    const {email, phone} = this.state;
    if (mode === 'Email') {
      if (email === '') return true;
      else return false;
    } else {
      if (phone === '') return true;
      else return false;
    }
  };

  render() {
    const {intlData, mode} = this.props;
    return (
      <SafeAreaView>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Change {mode}</Text>
          </TouchableOpacity>
          {/*<View style={styles.line} />*/}
        </View>
        <View style={{width: 0, height: 0}}>
          <CountryPicker
            translation="eng"
            withCallingCode
            visible={this.state.openModalCountry}
            onClose={() => this.setState({openModalCountry: false})}
            withFilter
            placeholder={'x'}
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
              fontFamily: 'Lato-Medium',
            }}>
            Enter your new {mode}
          </Text>
          {mode === 'Email' ? (
            <View
              style={{
                marginVertical: 18,
              }}>
              <TextInput
                keyboardType="email-address"
                placeholder={intlData.messages.emailAddress}
                value={this.state.email}
                onChangeText={value => this.setState({email: value})}
                style={{
                  fontSize: 17,
                  fontFamily: 'Lato-Medium',
                  padding: 13,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 2,
                  borderRadius: 13,
                }}
              />
            </View>
          ) : (
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
                  value={this.state.phone}
                  keyboardType={'numeric'}
                  onChangeText={value => this.setState({phone: value})}
                  style={{
                    fontSize: 17,
                    fontFamily: 'Lato-Medium',
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
          )}
          <View style={{marginVertical: 15}}>
            <TouchableHighlight
              disabled={this.checkMode()}
              onPress={this.submitOTP}
              style={{
                padding: 15,
                borderRadius: 10,
                backgroundColor: this.checkMode()
                  ? colorConfig.store.disableButton
                  : colorConfig.store.defaultColor,
              }}>
              <Text
                style={{
                  color: colorConfig.store.textWhite,
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontFamily: 'Lato-Medium',
                }}>
                Submit
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  status: state.accountsReducer.accountExist.status,
  deviceID: state.userReducer.deviceUserInfo,
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
)(ChangeCredentials);

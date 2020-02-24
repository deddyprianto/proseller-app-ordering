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
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {checkAccountExist} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import CountryPicker from 'react-native-country-picker-modal';
import {deviceUserInfo, userPosition} from '../actions/user.action';
import Geolocation from 'react-native-geolocation-service';

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
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      phone: '',
      country: awsConfig.COUNTRY,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount = async () => {
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
    if (Platform.OS !== 'android') Geolocation.requestAuthorization();
    else {
      try {
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
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          Defaults.modal.current.renderModel(modalOptions);
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  checkAccountExist = async () => {
    this.setState({loading: true});
    try {
      var dataRequest = {
        phoneNumber: this.state.phoneNumber + this.state.phone,
      };
      let phoneNumber = {
        phoneNumber: dataRequest.phoneNumber,
      };
      console.log(dataRequest, 'payload check account');
      const response = await this.props.dispatch(
        checkAccountExist(dataRequest),
      );
      if (response.status == true) {
        if (response.data.confirmation == false) {
          Alert.alert(
            'Opss..',
            "Looks like your account hasn't been confirmed, please confirm now.",
          );
          phoneNumber.email = response.data.email;
          Actions.verifyOtpAfterRegister(phoneNumber);
        } else {
          phoneNumber.email = response.data.email;
          Actions.signInPhoneNumber(phoneNumber);
        }
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        Actions.mobileRegister(phoneNumber);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  getUserPosition = async () => {
    try {
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
    this.getUserPosition();
    // console.log(this.props.deviceID.deviceID, 'this.props.deviceID.deviceID');
    return (
      <View style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header
            titleHeader={'Mobile Sign In / Register'}
            backButton={false}
          />
          <View style={{margin: 20}}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 16,
                fontFamily: 'Lato-Medium',
              }}>
              Enter your Mobile Number
            </Text>
            <View style={{marginVertical: 15}}>
              <View
                style={{
                  padding: 10,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 1.5,
                }}>
                <CountryPicker
                  translation="eng"
                  withCallingCode
                  withFilter
                  placeholder={`${this.state.country} (${
                    this.state.phoneNumber
                  })`}
                  withFlag={true}
                  onSelect={country => {
                    this.setState({
                      phoneNumber: `+${country.callingCode[0]}`,
                      country: country.name,
                    });
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginVertical: 15,
                flexDirection: 'row',
                color: colorConfig.store.title,
                borderColor: colorConfig.pageIndex.inactiveTintColor,
                borderWidth: 2,
                borderRadius: 13,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Lato-Medium',
                    padding: 15,
                  }}>
                  {this.state.phoneNumber}
                </Text>
              </View>
              <TextInput
                keyboardType="phone-pad"
                placeholder={'Phone Number'}
                maxLength={20}
                value={this.state.phone}
                onChangeText={value => this.setState({phone: value})}
                style={{
                  fontSize: 20,
                  width: '100%',
                  fontFamily: 'Lato-Medium',
                  padding: 15,
                }}
              />
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
                    fontFamily: 'Lato-Medium',
                  }}>
                  Next
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{marginTop: 30}}>
              <TouchableOpacity onPress={() => Actions.inputEmail()}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontFamily: 'Lato-Medium',
                    textAlign: 'center',
                    color: colorConfig.store.secondaryColor,
                    fontSize: 17,
                  }}>
                  Use Email Address to Sign In / Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
mapStateToProps = state => ({
  status: state.accountsReducer.accountExist.status,
  deviceID: state.userReducer.deviceUserInfo,
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
)(InputPhoneNumber);

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
  Platform,
  Picker,
  TouchableHighlight,
  Alert,
  AsyncStorage,
  PermissionsAndroid,
  Keyboard,
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
import {Dialog} from 'react-native-paper';
import {updateLanguage} from '../actions/language.action';
import Languages from '../service/i18n/languages';
import packageJson from '../../package';
import PhoneInput from 'react-native-phone-input';

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
    // detect keyboard up / down
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

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
    this.setState({loading: true});
    try {
      var dataRequest = {
        phoneNumber: this.state.phone,
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
          Alert.alert('Opss..', this.intlData.messages.accountNotConfirmed);
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

  _updateLanguage = async lang => {
    await this.props.dispatch(updateLanguage(lang));
    await this.setState({dialogChangeLanguage: false});
  };

  renderDialogQuantityModifier = () => {
    const {intlData} = this.props;
    const options = Languages.map(language => {
      return (
        <Picker.Item
          value={language.code}
          key={language.code}
          label={language.name}
        />
      );
    });

    return (
      <Dialog
        dismissable={true}
        visible={this.state.dialogChangeLanguage}
        onDismiss={() => this.setState({dialogChangeLanguage: false})}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {intlData.messages.selectLanguage}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.panelQty}>
              <Picker
                style={{height: 60, width: 300}}
                selectedValue={intlData.locale}
                onValueChange={itemValue => this._updateLanguage(itemValue)}>
                {options}
              </Picker>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  openDialogLanguage = () => {
    this.setState({dialogChangeLanguage: true});
  };

  render() {
    const {intlData} = this.props;
    this.getUserPosition();
    return (
      <>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header
            titleHeader={'Mobile Register / Register'}
            backButton={false}
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
                fontSize: 16,
                fontFamily: 'Lato-Medium',
              }}>
              {intlData.messages.enterMobileNumber}
            </Text>
            <View
              style={{
                marginVertical: 15,
                flexDirection: 'row',
                color: colorConfig.store.title,
                borderColor: colorConfig.pageIndex.inactiveTintColor,
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <PhoneInput
                flagStyle={{width: 35, height: 25}}
                textStyle={{fontSize: 18, fontFamily: 'Lato-Medium'}}
                style={{
                  fontSize: 18,
                  width: '100%',
                  padding: 15,
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
                  {intlData.messages.next}
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
                  {intlData.messages.useEmail}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {this.state.showFooter ? (
          <View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 40,
              }}
              onPress={this.openDialogLanguage}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: colorConfig.store.defaultColor,
                  fontWeight: 'bold',
                  fontFamily: 'Lato-Bold',
                  fontSize: 16,
                }}>
                {intlData.messages.languageName}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 10,
                color: colorConfig.pageIndex.grayColor,
                fontSize: 14,
              }}>
              Version: {packageJson.version}
            </Text>
          </View>
        ) : null}
        {this.renderDialogQuantityModifier()}
      </>
    );
  }
}
mapStateToProps = state => ({
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
)(InputPhoneNumber);

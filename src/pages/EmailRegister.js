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
  Alert, SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {createNewUser, resendOTPCognito} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import generate from 'password-generation';
import CountryPicker from 'react-native-country-picker-modal';
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
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
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
    try {
      var dataRequest = {
        username: this.props.email,
        phoneNumber: this.state.phone,
        email: this.props.email,
        name: this.state.name,
        type: 'userPool',
        password: this.generatePassword(),
      };
      console.log(dataRequest, 'payload register by email');
      const response = await this.props.dispatch(createNewUser(dataRequest));
      console.log(response, 'responsenya');
      if (response == true) {
        await this.sendOTP(dataRequest.email);
        await this.setState({
          loading: false,
        });
        let phoneNumber = {
          phoneNumber: dataRequest.phoneNumber,
          password: dataRequest.password,
          email: this.props.email,
          fromMethod: 'email',
        };
        Actions.verifyRegister(phoneNumber);
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

  sendOTP = async email => {
    try {
      var dataRequest = {
        email: email,
      };
      console.log(dataRequest, 'payload send otp');
      const response = await this.props.dispatch(resendOTPCognito(dataRequest));
      console.log('send otp pada saat register ', response);
    } catch (error) {}
  };

  render() {
    const {intlData} = this.props;
    const {name, phone} = this.state;
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
                  fontWeight: 'bold',
                  fontFamily: 'Lato-Medium',
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
                  padding: 15,
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
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                {intlData.messages.phoneNumber}
              </Text>
            </View>
            <View
              style={{
                // marginVertical: 15,
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
            <View style={{marginHorizontal: 19}}>
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

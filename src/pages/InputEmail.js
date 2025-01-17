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
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {confirmUser, checkAccountExist} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import appConfig from '../config/appConfig';
import Icon from 'react-native-vector-icons/Ionicons';
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

class InputEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      email: '',
      country: awsConfig.COUNTRY,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  emailIsValid = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  checkAccountExist = async () => {
    // check validity email
    if (!this.emailIsValid(this.state.email.toLowerCase())) {
      Alert.alert('Oppss..', 'Please use a valid email.');
      return;
    }

    this.setState({loading: true});
    const {companyInfo, enableRegisterWithPassword} = this.props;
    try {
      var dataRequest = {
        email: this.state.email.toLowerCase(),
      };
      let email = {
        email: dataRequest.email.toLowerCase(),
      };
      console.log(dataRequest, 'payload check account email');
      const response = await this.props.dispatch(
        checkAccountExist(dataRequest),
      );
      if (response.status == true) {
        if (response.data.confirmation == false) {
          email.confirmed = false;
          email.phoneNumber = response.data.phoneNumber;
          // check mode sign in ( by password or by OTP )
          if (enableRegisterWithPassword) {
            navigate('signInEmailWithPassword', email);
          } else {
            navigate('signInEmail', email);
          }
        } else if (response.data.status == 'SUSPENDED') {
          Alert.alert(
            'Sorry',
            `Your account has been ${
              response.data.status
            }. Please contact administrator.`,
          );
        } else {
          // check mode sign in ( by password or by OTP )
          if (enableRegisterWithPassword) {
            navigate('signInEmailWithPassword', email);
          } else {
            navigate('signInEmail', email);
          }
        }
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        navigate('emailRegister', email);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {intlData, loginByMobile} = this.props;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header titleHeader={'Email Sign In / Register'} backButton={true} />
          <View style={{margin: 20}}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
              }}>
              {intlData.messages.enterEmail}
            </Text>
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
                  fontFamily: 'Poppins-Regular',
                  padding: 13,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 2,
                  borderRadius: 13,
                }}
              />
            </View>
            <View style={{marginVertical: 15}}>
              <TouchableHighlight
                disabled={this.state.email == '' ? true : false}
                onPress={this.checkAccountExist}
                style={{
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor:
                    this.state.email == ''
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
            {loginByMobile === true ? (
              <View style={{marginTop: 30}}>
                <TouchableOpacity onPress={() => Actions.pop()}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontFamily: 'Poppins-Regular',
                      textAlign: 'center',
                      color: colorConfig.store.secondaryColor,
                      fontSize: 17,
                    }}>
                    {intlData.messages.useMobile}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  status: state.accountsReducer.accountExist.status,
  intlData: state.intlData,
  enableRegisterWithPassword:
    state.orderReducer.orderingSetting.enableRegisterWithPassword,
  loginByEmail: state.orderReducer.orderingSetting.loginByEmail,
  loginByMobile: state.orderReducer.orderingSetting.loginByMobile,
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
)(InputEmail);

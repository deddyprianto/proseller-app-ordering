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
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {Form, TextValidator} from 'react-native-validator-form';
import AwesomeAlert from 'react-native-awesome-alerts';

import InputText from '../components/inputText';
import {
  confirmUser,
  loginUser,
  sendCodeConfirmation,
} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
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

class VerifyCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      confirmationCode: '',
      press: false,
      showPass: true,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      loading: false,
      showPageConfirmation: false,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  signin() {
    Actions.pop();
  }

  signup() {
    Actions.signup();
  }

  handleSubmit = async () => {
    this.setState({loading: true});
    try {
      var dataVerify = {
        phoneNumber: this.state.phoneNumber,
        confirmationCode: this.state.confirmationCode,
        appClientId: awsConfig.appClientId,
      };
      console.log(dataVerify, 'dataVerify');
      const response = await this.props.dispatch(confirmUser(dataVerify));
      if (!response.success) {
        throw response;
      } else {
        this.setState({
          showAlert: true,
          pesanAlert: 'Your account is success to verify!',
          titleAlert: 'Verify Success!',
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        pesanAlert: error.responseBody.Data.message,
        titleAlert: 'Oopps..',
        loading: false,
      });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  showPagePhoneNumber = () => {
    this.setState({showPageConfirmation: false});
  };

  handleResend = async () => {
    this.setState({loading: true});
    try {
      this.setState({loadingVerifyPhone: true});
      var dataRequest = {
        phoneNumber: this.phone.getValue(),
      };
      console.log(dataRequest, 'payload resend sms');
      const response = await this.props.dispatch(
        sendCodeConfirmation(dataRequest),
      );
      if (response.responseBody.ResultCode == 200) {
        this.setState({
          showAlert: true,
          pesanAlert: 'Confirmation code has been resent to your phone',
          titleAlert: 'Confirmation!',
          loading: false,
          showPageConfirmation: true,
        });
      } else {
        this.setState({
          loadingVerifyPhone: false,
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Opps..',
          loading: false,
          showPageConfirmation: false,
        });
      }
    } catch (error) {
      this.setState({
        loadingVerifyPhone: false,
        showAlert: true,
        pesanAlert: 'Something went wrong, please try again.',
        titleAlert: 'Oppss...',
        loading: false,
        showPageConfirmation: false,
      });
    }
  };

  showPass = () => {
    if (this.state.press == false) {
      this.setState({showPass: false, press: true});
    } else {
      this.setState({showPass: true, press: false});
    }
  };

  gotoLoginPage = () => {
    Actions.signin();
  };

  renderTextInput = field => {
    const {
      meta: {touched, error},
      label,
      icon,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {onChange, ...restInput},
    } = field;
    return (
      <View>
        <InputText
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          icon={icon}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.backgroundImage}>
        {console.log(this.props)}
        {this.state.loading && <Loader />}
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
            }}>
            <TouchableOpacity onPress={this.signin}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  margin: 10,
                }}
              />
            </TouchableOpacity>

            <View style={styles.container}>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Verify Code
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          {!this.state.showPageConfirmation ? (
            <View
              style={{
                margin: 10,
                backgroundColor: colorConfig.pageIndex.backgroundColor,
                borderRadius: 10,
                padding: 10,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1,
              }}>
              <Form ref="form" onSubmit={this.handleResend}>
                <PhoneInput
                  ref={ref => {
                    this.phone = ref;
                  }}
                  style={{marginTop: 15, paddingLeft: 5}}
                  value={this.state.phoneNumber}
                />
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.activeTintColor,
                    height: 1,
                    marginLeft: 4,
                    marginRight: 5,
                    marginTop: 7,
                  }}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleResend}>
                  <Text style={styles.buttonText}>Send Confirmation Code</Text>
                </TouchableOpacity>
              </Form>
            </View>
          ) : (
            <View
              style={{
                margin: 10,
                backgroundColor: colorConfig.pageIndex.backgroundColor,
                borderRadius: 10,
                padding: 10,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1,
              }}>
              <Form ref="form" onSubmit={this.handleSubmit}>
                <View>
                  <TextInput
                    placeholder={'Your confirmation code'}
                    style={{paddingVertical: 10, paddingLeft: 5}}
                    secureTextEntry={this.state.showPass}
                    value={this.state.confirmationCode}
                    keyboardType="numeric"
                    textContentType="oneTimeCode"
                    onChangeText={value =>
                      this.setState({
                        confirmationCode: value.replace(/\s/g, ''),
                      })
                    }
                  />
                  <View
                    style={{
                      backgroundColor: colorConfig.pageIndex.activeTintColor,
                      height: 1,
                      marginLeft: 4,
                      marginRight: 5,
                      marginTop: 7,
                    }}
                  />
                  <TouchableOpacity
                    style={{position: 'absolute', top: 8, right: 15}}
                    onPress={this.showPass}>
                    <Icon
                      name={this.state.press == true ? 'md-eye' : 'md-eye-off'}
                      size={23}
                      color={colorConfig.pageIndex.grayColor}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleSubmit}>
                  <Text style={styles.buttonText}>Verify Account</Text>
                </TouchableOpacity>
              </Form>

              <TouchableOpacity onPress={this.showPagePhoneNumber}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colorConfig.pageIndex.activeTintColor,
                  }}>
                  Resend Confirmation Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmButtonStyle={{padding: 10}}
          titleStyle={{
            fontSize: 20,
            color: colorConfig.store.defaultColor,
            fontWeight: 'bold',
          }}
          messageStyle={{fontSize: 13, textAlign: 'center'}}
          confirmText={
            this.state.titleAlert == 'Verify Success!' ? 'Login' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            if (this.state.titleAlert == 'Verify Success!') {
              this.gotoLoginPage();
            } else {
              this.hideAlert();
            }
          }}
        />
      </View>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.code_auth) {
    errors.code_auth = 'Code is required';
  }
  return errors;
};

mapStateToProps = state => ({
  dataRegister: state.authReducer.createUser.dataRegister,
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
    validate,
  }),
)(VerifyCode);

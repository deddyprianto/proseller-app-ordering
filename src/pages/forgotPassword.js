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
  ActivityIndicator,
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
  sendCodeConfirmation,
  confirmForgotPassword,
  loginUser,
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
  buttonConfirm: {
    height: 45,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 15,
    marginVertical: 10,
    paddingVertical: 13,
    marginTop: 20,
    width: imageWidth - 40,
  },
  button: {
    height: 45,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 15,
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

const TextandSpinner = props => {
  if (props.loading) {
    return <ActivityIndicator animating={true} size="large" color="white" />;
  } else {
    return <Text style={styles.buttonText}>{props.text}</Text>;
  }
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      confirmationCode: '',
      password: '',
      repassword: '',
      pres: false,
      press: false,
      showPas: true,
      showPass: true,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      pressSend: false,
      changePasswordForm: false,
      //  loading spinner
      loadingVerifyPhone: false,
      loadingSavePassword: false,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentWillMount() {
    Form.addValidationRule('isPasswordMatch', value => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    Form.removeValidationRule('isPasswordMatch');
  }

  signin() {
    Actions.pop();
  }

  signup() {
    Actions.signup();
  }

  handleSendCode = async () => {
    try {
      this.setState({loadingVerifyPhone: true});
      var dataRequest = {
        phoneNumber: this.phone.getValue(),
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        companyId: awsConfig.companyId,
      };
      const response = await this.props.dispatch(
        sendCodeConfirmation(dataRequest),
      );
      if (response.responseBody.ResultCode == 200) {
        this.setState({
          pressSend: true,
          loadingVerifyPhone: false,
          phoneNumber: dataRequest.phoneNumber,
        });
      } else {
        this.setState({
          loadingVerifyPhone: false,
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Failed!',
        });
      }
    } catch (error) {}
  };

  handleConfirmation = async () => {
    this.setState({loadingSavePassword: true});
    try {
      var dataRequest = {
        phoneNumber: this.state.phoneNumber,
        newPassword: this.state.password,
        confirmationCode: this.state.confirmationCode,
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        companyId: awsConfig.companyId,
      };
      console.log(dataRequest);
      const response = await this.props.dispatch(
        confirmForgotPassword(dataRequest),
      );
      if (response.responseBody.ResultCode != 200) {
        this.setState({
          loadingSavePassword: false,
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Confirm Error!',
        });
      } else {
        this.setState({
          loadingSavePassword: false,
          showAlert: true,
          pesanAlert: 'Your password success to change!',
          titleAlert: 'Confirm Success!',
        });
      }
    } catch (error) {
      this.setState({
        loadingSavePassword: false,
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opss...',
      });
    }
  };

  handleResend = () => {
    this.setState({pressSend: false});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  submitLogin = async () => {
    try {
      var dataLogin = {
        phoneNumber: this.state.phoneNumber,
        password: this.state.password,
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        companyId: awsConfig.companyId,
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      if (response.success == false) {
        throw response;
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        titleAlert: 'Login Error!',
        pesanError: error.responseBody.message,
      });
    }
  };

  showPas = () => {
    if (this.state.pres == false) {
      this.setState({showPas: false, pres: true});
    } else {
      this.setState({showPas: true, pres: false});
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
    const {handleSubmit, loginUser} = this.props;
    const imageStyle = [styles.logo, {width: this.imageWidth}];
    let styleButton;
    const validPhoneNumber =
      this.state.phoneNumber == ''
        ? [styles.button, {backgroundColor: 'gray'}]
        : styles.button;
    return (
      <View style={styles.backgroundImage}>
        {console.log(this.props)}
        {loginUser && loginUser.isLoading && <Loader />}
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
                Forgot Password
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          <View
            style={{
              margin: 10,
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              borderRadius: 10,
              padding: 10,
              borderColor: colorConfig.pageIndex.activeTintColor,
              borderWidth: 1,
            }}>
            {!this.state.pressSend ? (
              <Form ref="form" onSubmit={this.handleSendCode}>
                {/*<TextInput*/}
                {/*  placeholder={'Phone Number'}*/}
                {/*  style={{paddingVertical: 10}}*/}
                {/*  value={this.state.phoneNumber}*/}
                {/*  onChangeText={value =>*/}
                {/*    this.setState({phoneNumber: value})*/}
                {/*  }*/}
                {/*/>*/}
                <PhoneInput
                  ref={ref => {
                    this.phone = ref;
                  }}
                  style={{
                    marginTop: 15,
                    paddingLeft: 5,
                    paddingVertical: 10,
                  }}
                  value={this.state.phoneNumber}
                />
                <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                <TouchableOpacity
                  style={validPhoneNumber}
                  disabled={this.state.phoneNumber == '' ? true : false}
                  onPress={this.handleSendCode}>
                  <TextandSpinner
                    text="Verify Phone Number"
                    loading={this.state.loadingVerifyPhone}
                  />
                </TouchableOpacity>
              </Form>
            ) : (
              <Form ref="form" onSubmit={this.handleConfirmation}>
                <View>
                  <TextInput
                    placeholder={'Confirmation Code'}
                    style={{paddingVertical: 10}}
                    keyboardType='numeric'
                    value={this.state.confirmationCode}
                    onChangeText={value =>
                      this.setState({
                        confirmationCode: value.replace(/\s/g, ''),
                      })
                    }
                  />
                  <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                  {/*<TextValidator*/}
                  {/*  style={{marginBottom: -10}}*/}
                  {/*  name="confirmationCode"*/}
                  {/*  label="confirmationCode"*/}
                  {/*  validators={['required']}*/}
                  {/*  errorStyle={{*/}
                  {/*    container: {top: 5, left: 5},*/}
                  {/*    text: {color: 'red'},*/}
                  {/*    underlineValidColor:*/}
                  {/*      colorConfig.pageIndex.activeTintColor,*/}
                  {/*    underlineInvalidColor: 'red',*/}
                  {/*  }}*/}
                  {/*  errorMessages={[*/}
                  {/*    'This field is required',*/}
                  {/*    'Confirmation Code invalid',*/}
                  {/*  ]}*/}
                  {/*  placeholder="Confirmation Code"*/}
                  {/*  keyboardType={'numeric'}*/}
                  {/*  under*/}
                  {/*  value={this.state.confirmationCode}*/}
                  {/*  onChangeText={value =>*/}
                  {/*    this.setState({*/}
                  {/*      confirmationCode: value.replace(/\s/g, ''),*/}
                  {/*    })*/}
                  {/*  }*/}
                  {/*/>*/}
                </View>
                <View>
                  <TextInput
                    placeholder={'New Password'}
                    style={{paddingVertical: 10}}
                    secureTextEntry={this.state.showPas}
                    value={this.state.password}
                    onChangeText={value =>
                      this.setState({
                        password: value.replace(/\s/g, ''),
                      })
                    }
                  />
                  <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                  {/*<TextValidator*/}
                  {/*  style={{marginBottom: -10}}*/}
                  {/*  name="password"*/}
                  {/*  label="password"*/}
                  {/*  validators={[*/}
                  {/*    'required',*/}
                  {/*    'minStringLength:8',*/}
                  {/*    'matchRegexp:^(?=.*[0-9])',*/}
                  {/*    'matchRegexp:^(?=.*[A-Z])',*/}
                  {/*    'matchRegexp:^(?=.*[a-z])',*/}
                  {/*  ]}*/}
                  {/*  errorStyle={{*/}
                  {/*    container: {top: 5, left: 5},*/}
                  {/*    text: {color: 'red'},*/}
                  {/*    underlineValidColor:*/}
                  {/*      colorConfig.pageIndex.activeTintColor,*/}
                  {/*    underlineInvalidColor: 'red',*/}
                  {/*  }}*/}
                  {/*  errorMessages={[*/}
                  {/*    'This field is required',*/}
                  {/*    'Password min 8 character',*/}
                  {/*    'Password contain at least 1 number',*/}
                  {/*    'Password contain at least 1 uppercase character',*/}
                  {/*    'Password contain at least 1 lowercase character',*/}
                  {/*  ]}*/}
                  {/*  placeholder="New password"*/}
                  {/*  secureTextEntry={this.state.showPas}*/}
                  {/*  type="text"*/}
                  {/*  under*/}
                  {/*  value={this.state.password}*/}
                  {/*  onChangeText={value =>*/}
                  {/*    this.setState({*/}
                  {/*      password: value.replace(/\s/g, ''),*/}
                  {/*    })*/}
                  {/*  }*/}
                  {/*/>*/}
                  <TouchableOpacity
                    style={{position: 'absolute', top: 8, right: 15}}
                    onPress={this.showPas}>
                    <Icon
                      name={this.state.pres == true ? 'md-eye' : 'md-eye-off'}
                      size={23}
                      color={colorConfig.pageIndex.grayColor}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    placeholder={'Retype New Password'}
                    style={{paddingVertical: 10}}
                    secureTextEntry={this.state.showPass}
                    type="text"
                    under
                    value={this.state.repassword}
                    onChangeText={value => this.setState({repassword: value})}
                  />
                  <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                  {/*<TextValidator*/}
                  {/*  style={{marginBottom: -10}}*/}
                  {/*  name="repassword"*/}
                  {/*  label="repassword"*/}
                  {/*  validators={['required', 'isPasswordMatch']}*/}
                  {/*  errorStyle={{*/}
                  {/*    container: {top: 5, left: 5},*/}
                  {/*    text: {color: 'red'},*/}
                  {/*    underlineValidColor:*/}
                  {/*      colorConfig.pageIndex.activeTintColor,*/}
                  {/*    underlineInvalidColor: 'red',*/}
                  {/*  }}*/}
                  {/*  errorMessages={[*/}
                  {/*    'This field is required',*/}
                  {/*    'Password mismatch',*/}
                  {/*  ]}*/}
                  {/*  placeholder="Your confirm password"*/}
                  {/*  secureTextEntry={this.state.showPass}*/}
                  {/*  type="text"*/}
                  {/*  under*/}
                  {/*  value={this.state.repassword}*/}
                  {/*  onChangeText={value => this.setState({repassword: value})}*/}
                  {/*/>*/}
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
                  onPress={this.handleConfirmation}>
                  <TextandSpinner
                    text="Save Password"
                    loading={this.state.loadingSavePassword}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.handleResend}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colorConfig.pageIndex.activeTintColor,
                    }}>
                    Resend Confirmation Code
                  </Text>
                </TouchableOpacity>
              </Form>
            )}
          </View>
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
          confirmText={
            this.state.titleAlert == 'Confirm Success!' ? 'Login' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Confirm Success!'
              ? this.gotoLoginPage()
              : this.hideAlert();
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
)(ForgotPassword);

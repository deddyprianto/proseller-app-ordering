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

class Aunt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber:
        this.props.dataRegister != undefined
          ? this.props.dataRegister.phoneNumber
          : awsConfig.phoneNumberCode,
      confirmationCode: '',
      press: false,
      showPass: true,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
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
    try {
      var dataVerify = {
        phoneNumber: this.state.phoneNumber,
        confirmationCode: this.state.confirmationCode,
        appClientId: awsConfig.appClientId,
      };
      // console.log('dataVerify');
      const response = await this.props.dispatch(confirmUser(dataVerify));
      if (!response.success) {
        throw response;
      } else {
        this.setState({
          showAlert: true,
          pesanAlert: 'Your account success to verify!',
          titleAlert: 'Verify Success!',
        });
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        pesanAlert: error.responseBody.message,
        titleAlert: 'Oopps..',
      });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  submitLogin = async () => {
    try {
      var dataLogin = {
        phoneNumber: this.props.dataRegister.phoneNumber,
        password: this.props.dataRegister.password,
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
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

  handleResend = async () => {
    try {
      this.setState({loadingVerifyPhone: true});
      var dataRequest = {
        phoneNumber: this.phone.value(),
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        companyId: awsConfig.companyId,
      };
      const response = await this.props.dispatch(
        sendCodeConfirmation(dataRequest),
      );
      if (response.responseBody.ResultCode == 200) {
        this.setState({
          showAlert: true,
          pesanAlert: 'Confirmation code has been resent to your phone',
          titleAlert: 'Confirmation!',
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

  showPass = () => {
    if (this.state.press == false) {
      this.setState({showPass: false, press: true});
    } else {
      this.setState({showPass: true, press: false});
    }
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
                Verify Code
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
            <Form ref="form" onSubmit={this.handleSubmit}>
              {/*<TextValidator*/}
              {/*  style={{marginBottom: -10}}*/}
              {/*  name="phoneNumber"*/}
              {/*  label="phoneNumber"*/}
              {/*  validators={['required']}*/}
              {/*  errorStyle={{*/}
              {/*    container: {top: 5, left: 5},*/}
              {/*    text: {color: 'red'},*/}
              {/*    underlineValidColor: colorConfig.pageIndex.activeTintColor,*/}
              {/*    underlineInvalidColor: 'red',*/}
              {/*  }}*/}
              {/*  errorMessages={['This field is required']}*/}
              {/*  placeholder="Phone Number"*/}
              {/*  type="text"*/}
              {/*  under*/}
              {/*  value={this.state.phoneNumber}*/}
              {/*  onChangeText={value => this.setState({phoneNumber: value})}*/}
              {/*/>*/}
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

              <View>
                {/*<TextValidator*/}
                {/*  style={{marginBottom: -10}}*/}
                {/*  name="confirmationCode"*/}
                {/*  label="confirmationCode"*/}
                {/*  validators={['required']}*/}
                {/*  errorStyle={{*/}
                {/*    container: {top: 5, left: 5},*/}
                {/*    text: {color: 'red'},*/}
                {/*    underlineValidColor: colorConfig.pageIndex.activeTintColor,*/}
                {/*    underlineInvalidColor: 'red',*/}
                {/*  }}*/}
                {/*  errorMessages={[*/}
                {/*    'This field is required',*/}
                {/*    'Confirmation Code invalid',*/}
                {/*  ]}*/}
                {/*  placeholder="Your confirmation code"*/}
                {/*  secureTextEntry={this.state.showPass}*/}
                {/*  keyboardType={'numeric'}*/}
                {/*  under*/}
                {/*  value={this.state.confirmationCode}*/}
                {/*  onChangeText={value =>*/}
                {/*    this.setState({confirmationCode: value.replace(/\s/g, '')})*/}
                {/*  }*/}
                {/*/>*/}
                <TextInput
                  placeholder={'Your confirmation code'}
                  style={{paddingVertical: 10, paddingLeft: 5,}}
                  secureTextEntry={this.state.showPass}
                  value={this.state.confirmationCode}
                  onChangeText={value =>
                    this.setState({confirmationCode: value.replace(/\s/g, '')})
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
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </Form>

            <TouchableOpacity onPress={this.handleResend}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colorConfig.pageIndex.activeTintColor,
                }}>
                Resend Confirmation Code
              </Text>
            </TouchableOpacity>

            {/* <Field
              name="username"
              placeholder="Email"
              icon='md-contact'
              component={this.renderTextInput} />
            <Field
              name="confirmationCode"
              placeholder="Code Authentification"
              icon='md-key'
              component={this.renderTextInput} /> */}
          </View>
          {/* <View style={styles.viewLoginWith}>
            <TouchableOpacity onPress={this.signin}><Text style={styles.signupButton}>Login</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.signup}><Text style={styles.verifyButton}>Create Account</Text></TouchableOpacity>
          </View> */}
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
            this.state.titleAlert == 'Verify Success!' ? 'Login' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Verify Success!'
              ? this.submitLogin()
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
)(Aunt);

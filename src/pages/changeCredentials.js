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
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {Form, TextValidator} from 'react-native-validator-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhoneInput from 'react-native-phone-input';
import InputText from '../components/inputText';
import {sendCodeConfirmation, loginUser} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

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

export default class ChangeCredentials extends Component {
  constructor(props) {
    super(props);
    console.log('DATA DIRI ANDA ', this.props.dataDiri);
    this.state = {
      credentials: '',
      confirmationCode: '',
      phoneNumber: '+65',
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

  goBack() {
    Actions.pop();
  }

  sendCredentialsToServer = async dataRequest => {
    try {
      console.log('dataRequest ', JSON.stringify(dataRequest));
      const response = await this.props.dispatch(
        sendCodeConfirmation(dataRequest),
      );
      if (response.responseBody.ResultCode == 200) {
        this.setState({
          loadingVerifyPhone: false,
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Success!',
        });
      } else {
        this.setState({
          loadingVerifyPhone: false,
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Failed!',
        });
      }
    } catch (e) {
      this.setState({
        loadingVerifyPhone: false,
        showAlert: true,
        pesanAlert: response.responseBody.Data.message,
        titleAlert: 'Failed!',
      });
    }
  };

  handleChangeCredentials = async () => {
    try {
      this.setState({loadingVerifyPhone: true});
      // check wether credentials to change is phone number or email
      if (this.props.field == 'Email') {
        var dataRequest = {
          email: this.props.dataDiri.email,
          newEmail: this.state.credentials,
        };
        this.sendCredentialsToServer(dataRequest);
      } else {
        var dataRequest = {
          phoneNumber: this.props.dataDiri.phoneNumber,
          newPhoneNumber: this.phone.getValue(),
        };
        this.sendCredentialsToServer(dataRequest);
      }
    } catch (error) {}
  };

  handleResend = () => {
    this.setState({pressSend: false});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
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
    const {dataDiri} = this.props;
    const imageStyle = [styles.logo, {width: this.imageWidth}];
    let styleButton;
    const validPhoneNumber =
      this.state.phoneNumber == ''
        ? [styles.button, {backgroundColor: 'gray'}]
        : styles.button;
    return (
      <View style={styles.backgroundImage}>
        {this.state.loadingVerifyPhone && <Loader />}
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
            }}>
            <TouchableOpacity onPress={this.goBack}>
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
                Change {this.props.field}
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
            <Form ref="form" onSubmit={this.handleChangeCredentials}>
              <TextValidator
                style={{marginBottom: -10}}
                name="confirmationCode"
                label="confirmationCode"
                validators={['required']}
                errorStyle={{
                  container: {top: 5, left: 5},
                  text: {color: 'red'},
                  underlineValidColor: colorConfig.pageIndex.activeTintColor,
                  underlineInvalidColor: 'red',
                }}
                errorMessages={['This field is required']}
                placeholder={`Confirmation Code`}
                type="text"
                under
                value={this.state.confirmationCode}
                onChangeText={value => this.setState({confirmationCode: value})}
              />
              {this.props.field == 'Phone Number' ? (
                <View>
                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                    style={{marginTop: 15, paddingLeft: 5, marginBottom: 5}}
                    value={this.state.phoneNumber}
                  />

                  <View
                    style={{
                      backgroundColor: colorConfig.pageIndex.activeTintColor,
                      height: 1,
                      marginLeft: 4,
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                </View>
              ) : (
                <TextValidator
                  style={{marginBottom: -10}}
                  name="phoneNumber"
                  label="phoneNumber"
                  validators={['required']}
                  errorStyle={{
                    container: {top: 5, left: 5},
                    text: {color: 'red'},
                    underlineValidColor: colorConfig.pageIndex.activeTintColor,
                    underlineInvalidColor: 'red',
                  }}
                  errorMessages={['This field is required']}
                  placeholder={`New ${this.props.field}`}
                  type="text"
                  under
                  value={this.state.credentials}
                  onChangeText={value => this.setState({credentials: value})}
                />
              )}
              <TouchableOpacity
                style={validPhoneNumber}
                onPress={this.handleChangeCredentials}>
                <TextandSpinner
                  text={`Verify ${this.props.field}`}
                  loading={this.state.loadingVerifyPhone}
                />
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
            if (this.state.titleAlert == 'Success!') {
              this.hideAlert();
              this.goBack();
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

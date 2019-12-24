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
  Image,
  ScrollView,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {Form, TextValidator} from 'react-native-validator-form';
import Icon from 'react-native-vector-icons/Ionicons';

import InputText from '../components/inputText';
import {loginUser, loginOther} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import awsConfig from '../config/awsConfig';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 80,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: imageWidth * 2 - 40,
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupTextAuth: {
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  signupText: {
    color: colorConfig.signin.signupText,
    fontSize: 14,
  },
  signupButton: {
    color: '#1b245c',
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  verifyButton: {
    color: '#1b245c',
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  button: {
    width: 300,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorConfig.signin.buttonText,
    textAlign: 'center',
  },
  errorText: {
    color: colorConfig.signin.errorText,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backgroundImage: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  viewLogin: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  logoLoginWith: {
    width: 35,
    height: 35,
    marginLeft: 5,
    marginRight: 10,
  },
  textLoginWith: {
    fontSize: 14,
    color: colorConfig.pageIndex.grayColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 30,
  },
  buttonFB: {
    width: 300,
    height: 70,
  },
  buttonTextFB: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4267B2',
    textAlign: 'center',
  },
  buttonGoogle: {
    width: 300,
    height: 45,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 25,
    marginVertical: 10,
    borderColor: 'red',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextGoogle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      pesanError: '',
      accessToken: '',
      expires_at: '',
      email: '',
      screenWidth: Dimensions.get('window').width,
      showPass1: true,
      press1: false,
      username: '',
      password: '',
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount() {}

  goBack() {
    Actions.signin();
  }

  signup() {
    Actions.signup();
  }

  auth() {
    Actions.auth();
  }

  forgotPassword = () => {
    Actions.forgotPassword();
  };

  loginUser = async values => {
    try {
      var dataLogin = {
        username: this.state.username.toLowerCase(),
        password: this.state.password,
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        type: 'userPool',
      };
      const response = await this.props.dispatch(loginUser(dataLogin));
      if (response.success == false) {
        throw response;
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        pesanError: error.responseBody.message,
      });
    }
  };

  onSubmit = values => {
    this.loginUser(values);
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  showPass1 = () => {
    if (this.state.press1 == false) {
      this.setState({showPass1: false, press1: true});
    } else {
      this.setState({showPass1: true, press1: false});
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
          icon={icon}
          label={label}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  onSubmitGoogle = async () => {
    console.log('Google');
  };

  onSubmitFacebook = async () => {
    console.log('Facebook');
    try {
      await LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        result => {
          if (result.isCancelled) {
            console.log('Login was cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const {accessToken, expirationTime} = data;
              fetch(
                'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' +
                  accessToken,
              )
                .then(response => response.json())
                .then(async json => {
                  const expires_at = expirationTime + new Date().getTime();
                  this.setState({
                    accessToken,
                    expires_at,
                    email: json.email,
                  });
                  var values = {
                    accessToken,
                    expires_at,
                    email: json.email,
                    name: json.name,
                    idFB: json.id,
                    appClientId: awsConfig.appClientId,
                    cognitoPoolId: awsConfig.cognitoPoolId,
                    model: 'facebook',
                  };
                  const response = await this.props.dispatch(
                    loginOther(values),
                  );

                  if (response.statusCustomer == false) {
                    console.log('Minta password');
                    Actions.signinWaitPassword({dataLogin: response});
                  } else {
                    console.log('Login FB');
                  }
                })
                .catch(() => {
                  reject('ERROR GETTING DATA FROM FACEBOOK');
                });
            });
          }
        },
        error => {
          console.log(error);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {handleSubmit, loginUser} = this.props;

    const imageStyle = [styles.logo, {width: this.imageWidth}];
    return (
      <ImageBackground
        source={appConfig.appBackground}
        style={styles.backgroundImage}
        resizeMode="stretch">
        {loginUser && loginUser.isLoading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <Image
              source={appConfig.appLogo}
              style={{
                marginTop: 10,
                height: 100,
                width: 120,
              }}
              resizeMode="contain"
            />
            <Image
              source={appConfig.appTextWelcome}
              style={{
                marginTop: -40,
                height: 180,
                width: 220,
              }}
              resizeMode="contain"
            />
          </View>
          <Form ref="form" onSubmit={this.handleSubmit}>
            <View
              style={{
                backgroundColor: colorConfig.pageIndex.backgroundColor,
                borderRadius: 5,
                paddingTop: 10,
                paddingBottom: 20,
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: -20,
              }}>
              <TextValidator
                name="email"
                label="email"
                validators={['required']}
                text={{color: '#1b245c'}}
                errorStyle={{
                  container: {top: 5, left: 5},
                  text: {color: 'red'},
                  underlineValidColor: '#1b245c',
                  underlineInvalidColor: 'red',
                }}
                errorMessages={['This field is required', 'Email invalid']}
                placeholder="Email / Phone Number"
                type="text"
                under
                value={this.state.username}
                onChangeText={value =>
                  this.setState({
                    username: value.replace(/\s/g, '').toLowerCase(),
                  })
                }
              />
              <View>
                <TextValidator
                  style={{marginBottom: -10}}
                  name="password"
                  label="password"
                  text={{color: '#1b245c'}}
                  validators={[
                    'required',
                    'minStringLength:8',
                    'matchRegexp:^(?=.*[0-9])',
                    'matchRegexp:^(?=.*[A-Z])',
                    'matchRegexp:^(?=.*[a-z])',
                  ]}
                  errorStyle={{
                    container: {top: 5, left: 5},
                    text: {color: 'red'},
                    underlineValidColor: '#1b245c',
                    underlineInvalidColor: 'red',
                  }}
                  errorMessages={[
                    'This field is required',
                    'Password min 8 character',
                    'Password contain at least 1 number',
                    'Password contain at least 1 uppercase character',
                    'Password contain at least 1 lowercase character',
                  ]}
                  placeholder="Password"
                  secureTextEntry={this.state.showPass1}
                  type="text"
                  under
                  value={this.state.password}
                  onChangeText={value =>
                    this.setState({password: value.replace(/\s/g, '')})
                  }
                />
                <TouchableOpacity
                  style={{position: 'absolute', top: 10, right: 15}}
                  onPress={this.showPass1}>
                  <Icon
                    name={this.state.press1 == true ? 'md-eye' : 'md-eye-off'}
                    size={23}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: 'row',
                marginBottom: 10,
                marginTop: 10,
              }}>
              <TouchableOpacity onPress={this.forgotPassword}>
                <Text style={styles.verifyButton}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                height: 55,
                borderRadius: 5,
                borderColor: colorConfig.pageIndex.backgroundColor,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleSubmit(this.onSubmit)}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Form>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={this.signup}>
              <Text style={styles.signupButton}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.auth}>
              <Text style={styles.verifyButton}>Verify Code</Text>
            </TouchableOpacity>
          </View>

          {appConfig.appStatusLoginOther == false ? null : (
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: colorConfig.pageIndex.backgroundColor,
                  height: 55,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                }}
                onPress={this.onSubmitFacebook}>
                <Image
                  source={appConfig.appLogoFB}
                  style={{
                    height: 25,
                    width: 35,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: '#1b245c',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Sign up with Facebook
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text
            style={{
              color: '#fff',
              fontSize: 10,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            {appConfig.appVersion}
          </Text>
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Signin Error"
          message={this.state.pesanError}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Close"
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </ImageBackground>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'login',
    validate,
  }),
)(Signin);

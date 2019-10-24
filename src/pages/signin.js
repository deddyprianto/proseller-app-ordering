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
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {LoginManager, LoginButton, AccessToken} from 'react-native-fbsdk';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';
import {Auth} from 'aws-amplify';
import AWS from 'aws-sdk';

import InputText from '../components/inputText';
import SigninOther from '../components/signinOther';
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
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 10,
  },
  verifyButton: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: 'sans-serif',
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
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  viewLogin: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 10,
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
    height: 45,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 25,
    marginVertical: 10,
    borderColor: '#4267B2',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount() {
    // GoogleSignin.configure({
    //   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    //   webClientId:
    //     '583037359433-vhcuou7902ug2k8ctl37e1p8mon2qrvv.apps.googleusercontent.com',
    // });
  }

  goBack() {
    Actions.signin();
  }

  signup() {
    Actions.signup();
  }

  auth() {
    Actions.auth();
  }

  loginUser = async values => {
    try {
      const response = await this.props.dispatch(loginUser(values));
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
      <View style={styles.backgroundImage}>
        {loginUser && loginUser.isLoading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <Image
              source={appConfig.appLogo}
              style={{
                margin: 20,
                height: 80,
                width: 100,
              }}
              resizeMode="contain"
            />
          </View>
          <Field
            name="username"
            placeholder="Email"
            icon="md-contact"
            component={this.renderTextInput}
          />
          <Field
            name="password"
            icon="md-lock"
            placeholder="Password"
            secureTextEntry={true}
            component={this.renderTextInput}
          />
          <View
            style={{
              justifyContent: 'flex-end',
              // paddingVertical:2,
              flexDirection: 'row',
              marginBottom: 15,
            }}>
            <TouchableOpacity>
              <Text style={styles.verifyButton}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(this.onSubmit)}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
                    height: 1,
                    width: 120,
                  }}
                />
                <Text style={styles.textLoginWith}>OR</Text>
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
                    height: 1,
                    width: 120,
                  }}
                />
              </View>
              {/* <LoginButton
                publishPermissions={['publish_actions']}
                readPermissions={['public_profile']}
                onLoginFinished={(error, result) => {
                  console.log('accessToken');
                  if (error) {
                    console.log('login has error: ', result.error);
                  } else if (result.isCancelled) {
                    console.log('login is cancelled.');
                  } else {
                    
                  }
                }}
                onLogoutFinished={console.log('logout')}
              /> */}
              <TouchableOpacity
                style={styles.buttonFB}
                onPress={this.onSubmitFacebook}>
                <Image
                  style={styles.logoLoginWith}
                  source={require('../assets/img/icon-facebook.png')}
                />
                <Text style={styles.buttonTextFB}>Login With Facebook</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.buttonGoogle}
                onPress={this.onSubmitGoogle}>
                <Image
                  style={styles.logoLoginWith}
                  source={require('../assets/img/icon-google.png')}
                />
                <Text style={styles.buttonTextGoogle}>Login With Google</Text>
              </TouchableOpacity> */}
              {/* <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
                disabled={this.state.isSigninInProgress}
              /> */}
            </View>
          )}
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
      </View>
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form: 'login',
    validate,
  }),
)(Signin);

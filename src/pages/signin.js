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

import InputText from '../components/inputText';
import SigninOther from '../components/signinOther';
import {loginUser} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

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
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 10,
  },
});

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      pesanError: '',
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
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
          <View style={styles.viewLoginWith}>
            <TouchableOpacity onPress={this.signup}>
              <Text style={styles.signupButton}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.auth}>
              <Text style={styles.verifyButton}>Verify Code</Text>
            </TouchableOpacity>
          </View>

          {appConfig.appStatusLoginOther == false ? null : <SigninOther />}
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

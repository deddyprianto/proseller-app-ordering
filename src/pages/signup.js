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
} from 'react-native';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Form, TextValidator} from 'react-native-validator-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhoneInput from 'react-native-phone-input';

import awsConfig from '../config/awsConfig';
import {createNewUser} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth / 2,
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
    color: colorConfig.signup.signupText,
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
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorConfig.signup.buttonText,
    textAlign: 'center',
  },
  errorText: {
    color: colorConfig.signup.errorText,
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
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  item: {
    backgroundColor: 'rgba(255, 255,255,0.8)',
    borderRadius: 25,
    height: 40,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginBottom: 5,
  },
  item1: {
    // backgroundColor: 'rgba(255, 255,255,0.8)',
    // borderRadius: 25,
    height: 40,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 5,
    width: imageWidth - 30,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
  },
  form1: {
    marginLeft: 5,
    width: Dimensions.get('window').width,
  },
  info: {
    // width: 200,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 20,
  },
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      press1: false,
      press2: false,
      showPass1: true,
      showPass2: true,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      email: '',
      reemail: '',
      username: '',
      password: '',
      repassword: '',
      name: '',
      phoneNumber: '+65',
      nickname: '',
      address: '',
      birthdate: '',
      gender: '',
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    var tanggal = new Date(date);
    var birthdate =
      (tanggal.getDate().toString().length == 1
        ? '0' + tanggal.getDate()
        : tanggal.getDate()) +
      '/' +
      (tanggal.getMonth().toString().length == 1
        ? '0' + tanggal.getMonth()
        : tanggal.getMonth()) +
      '/' +
      tanggal.getFullYear();
    // console.log(tanggal.getMonth().toString().length);
    this.setState({birthdate: birthdate});
    this.hideDateTimePicker();
  };

  goBack() {
    Actions.signin();
  }

  auth() {
    Actions.auth();
  }

  handleSubmit = async () => {
    try {
      var dataRegister = {
        companyId: awsConfig.companyId,
        email: this.state.email.toLowerCase(),
        password: this.state.password,
        name: this.state.name,
        phoneNumber: this.phone.getValue(),
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        type: 'userPool',
      };

      const response = await this.props.dispatch(createNewUser(dataRegister));
      console.log(response, 'response register')
      if (!response.success) {
        throw response;
      } else {
        this.setState({
          showAlert: true,
          pesanAlert:
            "A verify code has been sent to your phone. Select 'Verify Code' to verify your account!",
          titleAlert: 'Register Success!',
        });
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        pesanAlert: error.responseBody.Data.message,
        titleAlert: 'Register Error!',
      });
    }
  };

  // handleSubmit = () => {
  //   this.refs.form.submit();
  // }

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

  showPass2 = () => {
    if (this.state.press2 == false) {
      this.setState({showPass2: false, press2: true});
    } else {
      this.setState({showPass2: true, press2: false});
    }
  };

  componentWillMount() {
    Form.addValidationRule('isEmailMatch', value => {
      if (value !== this.state.email) {
        return false;
      }
      return true;
    });
    Form.addValidationRule('isPasswordMatch', value => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    Form.removeValidationRule('isEmailMatch');
    Form.removeValidationRule('isPasswordMatch');
  }

  updateInfo() {
    this.setState({
      phoneNumber: this.phone.getValue(),
    });
  }

  render() {
    const {handleSubmit, createUser} = this.props;
    const imageStyle = [styles.logo, {width: this.imageWidth}];
    return (
      <View style={styles.backgroundImage}>
        {console.log(createUser, 'createUser')}
        {createUser.isLoading && <Loader />}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colorConfig.pageIndex.backgroundColor,
          }}>
          <TouchableOpacity onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
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
              Register
            </Text>
          </View>
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          is24Hour={true}
          onCancel={this.hideDateTimePicker}
        />
        <View style={styles.line} />
        <ScrollView>
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
              <TextValidator
                style={{marginBottom: -10}}
                name="name"
                label="name"
                validators={['required']}
                errorStyle={{
                  container: {top: 5, left: 5},
                  text: {color: 'red'},
                  underlineValidColor: colorConfig.pageIndex.activeTintColor,
                  underlineInvalidColor: 'red',
                }}
                errorMessages={['This field is required']}
                placeholder="Your name"
                type="text"
                under
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
              />

              <TextValidator
                style={{marginBottom: -10}}
                name="email"
                label="email"
                validators={['required', 'isEmail']}
                errorStyle={{
                  container: {top: 5, left: 5},
                  text: {color: 'red'},
                  underlineValidColor: colorConfig.pageIndex.activeTintColor,
                  underlineInvalidColor: 'red',
                }}
                errorMessages={['This field is required', 'Email invalid']}
                placeholder="Your email"
                type="text"
                under
                value={this.state.email}
                onChangeText={value =>
                  this.setState({email: value.replace(/\s/g, '').toLowerCase()})
                }
              />

              <TextValidator
                style={{marginBottom: -10}}
                name="reemail"
                label="reemail"
                validators={['required', 'isEmailMatch']}
                errorStyle={{
                  container: {top: 5, left: 5},
                  text: {color: 'red'},
                  underlineValidColor: colorConfig.pageIndex.activeTintColor,
                  underlineInvalidColor: 'red',
                }}
                errorMessages={['This field is required', 'Email mismatch']}
                placeholder="Your confirm email"
                type="text"
                under
                value={this.state.reemail}
                onChangeText={value =>
                  this.setState({
                    reemail: value.replace(/\s/g, '').toLowerCase(),
                  })
                }
              />

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
                  marginTop: 5,
                }}
              />

              <View>
                <TextValidator
                  style={{marginBottom: -10}}
                  name="password"
                  label="password"
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
                    underlineValidColor: colorConfig.pageIndex.activeTintColor,
                    underlineInvalidColor: 'red',
                  }}
                  errorMessages={[
                    'This field is required',
                    'Password min 8 character',
                    'Password contain at least 1 number',
                    'Password contain at least 1 uppercase character',
                    'Password contain at least 1 lowercase character',
                  ]}
                  placeholder="Your password"
                  secureTextEntry={this.state.showPass1}
                  type="text"
                  under
                  value={this.state.password}
                  onChangeText={value =>
                    this.setState({password: value.replace(/\s/g, '')})
                  }
                />
                <TouchableOpacity
                  style={{position: 'absolute', top: 8, right: 15}}
                  onPress={this.showPass1}>
                  <Icon
                    name={this.state.press1 == true ? 'md-eye' : 'md-eye-off'}
                    size={23}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <TextValidator
                  style={{marginBottom: -10}}
                  name="repassword"
                  label="repassword"
                  validators={['required', 'isPasswordMatch']}
                  errorStyle={{
                    container: {top: 5, left: 5},
                    text: {color: 'red'},
                    underlineValidColor: colorConfig.pageIndex.activeTintColor,
                    underlineInvalidColor: 'red',
                  }}
                  errorMessages={[
                    'This field is required',
                    'Password mismatch',
                  ]}
                  placeholder="Your confirm password"
                  secureTextEntry={this.state.showPass2}
                  type="text"
                  under
                  value={this.state.repassword}
                  onChangeText={value => this.setState({repassword: value})}
                />
                <TouchableOpacity
                  style={{position: 'absolute', top: 8, right: 15}}
                  onPress={this.showPass2}>
                  <Icon
                    name={this.state.press2 == true ? 'md-eye' : 'md-eye-off'}
                    size={23}
                    color={colorConfig.pageIndex.grayColor}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </Form>
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
            this.state.titleAlert == 'Register Success!'
              ? 'Verify Code'
              : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Register Success!'
              ? Actions.auth()
              : this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

mapStateToProps = state => ({
  createUser: state.authReducer.createUser,
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
    form: 'register',
    validate,
  }),
)(Signup);

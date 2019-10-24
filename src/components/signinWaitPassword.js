/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {Form, TextValidator} from 'react-native-validator-form';
import PhoneInput from 'react-native-phone-input';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Loader from '../components/loader';
import {createNewUserOther, loginOther} from '../actions/auth.actions';

class SigninWaitPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      password: '',
      repassword: '',
      press1: false,
      press2: false,
      showPass1: true,
      showPass2: true,
      phoneNumber: '+65',
    };
  }

  handleSubmit = async () => {
    try {
      var dataLogin = {
        tenantId: awsConfig.tenantId,
        email: this.props.dataLogin.email,
        username: this.props.dataLogin.email,
        password: this.state.password,
        newPassword: this.state.password,
        name: this.props.dataLogin.name,
        phoneNumber: this.phone.getValue(),
        type: 'identityPool',
      };
      console.log(dataLogin, 'signinWaitPassword');
      await this.props.dispatch(createNewUserOther(dataLogin));
      await this.props.dispatch(loginOther(dataLogin));
    } catch (error) {
      console.log(error);
    }
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

  updateInfo() {
    this.setState({
      phoneNumber: this.phone.getValue(),
    });
  }

  goBack() {
    Actions.pop();
  }

  render() {
    const {handleSubmit, createUser} = this.props;
    return (
      <View style={{flex: 1}}>
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
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Enter Your Phone Number and Password
            </Text>
          </View>
        </View>
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
              <PhoneInput
                ref={ref => {
                  this.phone = ref;
                }}
                onChangePhoneNumber={value =>
                  this.setState({phoneNumber: value})
                }
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
              <TextValidator
                style={{marginBottom: -10}}
                name="password"
                label="password"
                validators={[
                  'required',
                  'minStringLength:8',
                  'matchRegexp:^(?=.*[0-9])',
                  'matchRegexp:^(?=.*[A-Z])',
                  'matchRegexp:^(?=.*[a-b])',
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
                style={{position: 'absolute', top: 50, right: 15}}
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
                errorMessages={['This field is required', 'Password mismatch']}
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
            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
              <Text style={styles.buttonText}>Next to Login</Text>
            </TouchableOpacity>
          </Form>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    left: -20,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  button: {
    marginTop: 30,
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
});

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
)(SigninWaitPassword);

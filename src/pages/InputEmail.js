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
          Alert.alert(
            'Opss..',
            "Looks like your account hasn't been confirmed, please confirm now.",
          );
          email.phoneNumber = response.data.phoneNumber;
          Actions.verifyOtpAfterRegisterEmail(email);
        } else {
          Actions.signInEmail(email);
        }
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
        Actions.emailRegister(email);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <View style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header titleHeader={'Email Sign In / Register'} backButton={true} />
          <View style={{margin: 20}}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 16,
                fontFamily: 'Lato-Medium',
              }}>
              Enter your Email Address
            </Text>
            <View
              style={{
                marginVertical: 25,
              }}>
              <TextInput
                keyboardType="email-address"
                placeholder={'Email Address'}
                value={this.state.email}
                onChangeText={value => this.setState({email: value})}
                style={{
                  fontSize: 17,
                  fontFamily: 'Lato-Medium',
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
                    fontFamily: 'Lato-Medium',
                  }}>
                  Next
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{marginTop: 30}}>
              <TouchableOpacity onPress={() => Actions.inputPhoneNumber()}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontFamily: 'Lato-Medium',
                    textAlign: 'center',
                    color: colorConfig.store.secondaryColor,
                    fontSize: 17,
                  }}>
                  Use Mobile Number to Sign In / Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
mapStateToProps = state => ({
  status: state.accountsReducer.accountExist.status,
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

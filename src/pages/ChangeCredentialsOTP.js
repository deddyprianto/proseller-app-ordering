/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {StyleSheet, View, Alert, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import {
  getUserProfile,
  updateUser,
  verificationUser,
} from '../actions/user.action';
import HeaderV2 from '../components/layout/header/HeaderV2';
import appConfig from '../config/appConfig';
import OtpComponent from '../components/otpComponent/OtpComponent';

const styles = StyleSheet.create({
  backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
  },
});

class ChangeCredentialsOTP extends Component {
  constructor(props) {
    super(props);

    // const {initialTimer} = this.props;

    this.state = {
      loading: false,
      isWrongOtp: false,
    };
  }

  verificationHandle = async otp => {
    this.setState({isWrongOtp: false});

    const sendData = {
      otp: Number(otp),
    };
    this.setState({loading: true});
    if (this.props.mode === 'Email') {
      sendData.email = this.props.address;
    } else {
      sendData.phoneNumber = this.props.address;
    }
    const response = await this.props.dispatch(verificationUser(sendData));
    if (!response.success) {
      return this.setState({isWrongOtp: true, loading: false});
    }
    this.setState({loading: false});
    Actions.pop();
  };

  handleSubmitLogin = val => {
    if (!this.props.isVerification) {
      this.submitLogin(val);
    } else {
      this.verificationHandle(val);
    }
  };

  submitLogin = async otp => {
    try {
      const {mode, address} = this.props;
      this.setState({loading: true, isWrongOtp: false});
      let dataProfile = {
        username: this.props.dataDiri.username,
        otp,
      };
      if (mode === 'Email') {
        dataProfile.newEmail = address.toLowerCase();
      } else {
        dataProfile.newPhoneNumber = address;
      }
      const response = await this.props.dispatch(updateUser(dataProfile));
      if (response.success) {
        await this.props.dispatch(getUserProfile());
        Actions.popTo('pageIndex');
        Alert.alert('Profile Updated!', `Your ${mode} has been updated.`);
      } else {
        this.setState({isWrongOtp: true});
      }
      this.setState({loading: false});
    } catch (e) {
      Alert.alert('Sorry', 'Please try again');
      this.setState({loading: false});
    }
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <HeaderV2 isCenterLogo={appConfig.appName !== 'fareastflora'} />
        <View>
          <OtpComponent
            method={this.props.mode?.toLowerCase()}
            onSubmitOtp={otp => this.handleSubmitLogin(otp)}
            methodValue={this.props.address}
            isWrongOtp={this.state.isWrongOtp}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  attempt: state.authReducer.attemptSendOTP.attempt,
  intlData: state.intlData,
});

const mapDispatchToProps = dispatch => ({
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
)(ChangeCredentialsOTP);

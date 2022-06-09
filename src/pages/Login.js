import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import appConfig from '../config/appConfig';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {checkAccountExist, sendOTP} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';

import LoadingScreen from '../components/loadingScreen';

const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 45,
  },
  image: {
    width: 150,
    height: 40,
    marginHorizontal: 20,
  },
  touchableNext: {
    height: 40,
    width: '100%',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableNextDisabled: {
    height: 40,
    width: '100%',
    backgroundColor: '#B7B7B7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    color: colorConfig.primaryColor,
    fontSize: 20,
  },
  viewLoginMethodSelector: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    width: '100%',
    height: 46,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
  },
  loginMethodActive: {
    height: 34,
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  loginMethodInactive: {
    height: 34,
    backgroundColor: '#F9F9F9',
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInformation: {
    width: '80%',
    textAlign: 'center',
    color: '#B7B7B7',
  },
  textNext: {color: 'white'},
});

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');

  useEffect(() => {
    setCountryCode(awsConfig.phoneNumberCode);
  }, []);

  const handleRequestOtp = async () => {
    let payload = {};
    const isEmail = loginMethod === 'email';
    const methodValue = isEmail ? email : countryCode + phoneNumber;

    if (isEmail) {
      payload.email = email;
    } else {
      payload.phoneNumber = countryCode + phoneNumber;
    }

    setIsLoading(true);
    const response = await dispatch(checkAccountExist(payload));

    if (response?.status) {
      await dispatch(sendOTP(payload));
      Actions.otp({
        isLogin: true,
        method: loginMethod,
        methodValue: methodValue,
      });
    } else {
      const message = response?.message || 'Login Failed';
      dispatch(
        showSnackbar({
          message: message,
        }),
      );
    }
    setIsLoading(false);
  };

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={appConfig.funtoastIcon}
      />
    );
  };

  const handleChangeLoginMethod = value => {
    setLoginMethod(value);
    setEmail('');
    setPhoneNumber('');
  };

  const handleStyleLoginMethod = value => {
    if (value === loginMethod) {
      return styles.loginMethodActive;
    }
    return styles.loginMethodInactive;
  };

  const renderChangeLoginMethod = () => {
    return (
      <View style={styles.viewLoginMethodSelector}>
        <TouchableOpacity
          onPress={() => {
            handleChangeLoginMethod('email');
          }}
          style={handleStyleLoginMethod('email')}>
          <Text>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeLoginMethod('phoneNumber');
          }}
          style={handleStyleLoginMethod('phoneNumber')}>
          <Text>Mobile Number</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPhoneNumberLoginInput = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Enter mobile number to begin :"
        value={phoneNumber}
        onChangeCountryCode={value => {
          setCountryCode(value);
        }}
        onChange={value => {
          setPhoneNumber(value);
        }}
      />
    );
  };

  const renderEmailLoginInput = () => {
    return (
      <FieldTextInput
        label="Enter email to begin :"
        placeholder="Enter email to begin "
        value={email}
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderLoginMethodInput = () => {
    if (loginMethod === 'email') {
      return renderEmailLoginInput();
    } else {
      return renderPhoneNumberLoginInput();
    }
  };

  const renderButtonNext = () => {
    const active = email || phoneNumber.length >= 6;

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleRequestOtp();
        }}>
        <Text style={styles.textNext}>REQUEST OTP</Text>
      </TouchableOpacity>
    );
  };

  const renderTextInformation = () => {
    const text = loginMethod === 'email' ? 'email' : 'mobile number';
    return (
      <Text style={styles.textInformation}>
        4-digits verification code will be sent to your {text}
      </Text>
    );
  };

  return (
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
        <View style={{marginTop: '25%'}} />
        {renderImages()}
        <View style={{marginTop: '10%'}} />
        <Text style={styles.textHeader}>Login Account</Text>
        <View style={{marginTop: '15%'}} />
        {renderChangeLoginMethod()}
        <View style={{marginTop: '15%'}} />
        {renderLoginMethodInput()}
        <View style={{marginTop: '15%'}} />
        {renderButtonNext()}
        <View style={{marginTop: '15%'}} />
        {renderTextInformation()}
      </View>
    </ScrollView>
  );
};

export default Login;

import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';

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
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {checkAccountExist, sendOTP} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';

import LoadingScreen from '../components/loadingScreen';
import Theme from '../theme';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      height: HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 45,
      backgroundColor: theme.colors.background,
    },
    image: {
      width: 150,
      height: 40,
      marginHorizontal: 20,
    },

    textHeader: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[20],
      fontFamily: theme.fontFamily.poppinsRegular,
    },

    textInformation: {
      width: '80%',
      textAlign: 'center',
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },

    textNext: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textLoginMethodActive: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLoginMethodInactive: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    touchableNext: {
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },

    touchableNextDisabled: {
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },

    viewLoginMethodSelector: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 46,
      borderRadius: 8,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 6,
      marginTop: '15%',
      backgroundColor: theme.colors.forthColor,
    },

    viewLoginMethodActive: {
      flex: 1,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      backgroundColor: theme.colors.background,
    },

    viewLoginMethodInactive: {
      flex: 1,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.forthColor,
    },
  });
  return styles;
};

const Login = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');

  const loginSettings = useSelector(
    state => state.settingReducer.loginSettings,
  );

  useEffect(() => {
    if (loginSettings.loginByEmail) {
      setLoginMethod('email');
    } else {
      setLoginMethod('phoneNumber');
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [loginSettings]);

  const handleRequestOtp = async () => {
    const isEmail = loginMethod === 'email';
    const methodValue = isEmail ? email : countryCode + phoneNumber;

    let payload = {};
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
        source={appConfig.logoMerchant}
      />
    );
  };

  const handleChangeLoginMethod = value => {
    setLoginMethod(value);
    setEmail('');
    setPhoneNumber('');
  };

  const renderLoginMethod = value => {
    const isActive = value === loginMethod;
    const isEmail = value === 'email';

    const text = isEmail ? 'Email' : 'Mobile Number';

    const style = isActive
      ? styles.viewLoginMethodActive
      : styles.viewLoginMethodInactive;

    const textStyle = isActive
      ? styles.textLoginMethodActive
      : styles.textLoginMethodInactive;

    return (
      <TouchableOpacity
        onPress={() => {
          handleChangeLoginMethod(value);
        }}
        style={style}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderChangeLoginMethod = () => {
    const {loginByMobile, loginByEmail} = loginSettings;

    if (loginByEmail && loginByMobile) {
      return (
        <View style={styles.viewLoginMethodSelector}>
          {renderLoginMethod('email')}
          {renderLoginMethod('phoneNumber')}
        </View>
      );
    }
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

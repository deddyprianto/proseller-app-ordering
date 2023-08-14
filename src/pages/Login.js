import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import LoadingScreen from '../components/loadingScreen';

import {Body, Header} from '../components/layout';

import {checkAccountExist, sendOTP} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';

import Theme from '../theme';
import HeaderV2 from '../components/layout/header/HeaderV2';
import appConfig from '../config/appConfig';
import GlobalInputText from '../components/globalInputText';
import useSettings from '../hooks/settings/useSettings';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 16,
    },
    textHeader: {
      marginTop: 32,
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textInformation: {
      marginTop: 16,
      width: '100%',
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
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLoginMethodInactive: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLogin: {
      marginTop: 4,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    touchableNext: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },

    touchableNextDisabled: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },

    viewLoginMethodSelector: {
      marginTop: 40,
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 46,
      borderRadius: 8,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 6,
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
    viewMethodInput: {
      width: '100%',
    },
    phoneContainer: {
      marginTop: 16,
    },
    noMb: {
      marginBottom: 0,
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
  const {checkTncPolicyData} = useSettings();
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

  const handleChangeLoginMethod = value => {
    setLoginMethod(value);
    setEmail('');
    setPhoneNumber('');
  };

  const renderLoginMethod = value => {
    const isActive = value === loginMethod;
    const isEmail = value === 'email';

    const text = isEmail ? 'Use Email' : 'Use Mobile Phone';

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

  const renderTextLogin = () => {
    const text = 'Welcome back, you’ve been missed!';
    return <Text style={styles.textLogin}>{text}</Text>;
  };

  const renderPhoneNumberLoginInput = () => {
    return (
      <View style={styles.phoneContainer}>
        <FieldPhoneNumberInput
          inputLabel={'Mobile Phone'}
          isMandatory={true}
          type="phone"
          label="Enter mobile number to begin :"
          value={phoneNumber}
          placeholder="Mobile Number"
          onChangeCountryCode={value => {
            setCountryCode(value);
          }}
          rootStyle={styles.noMb}
          withoutFlag
          onChange={value => {
            setPhoneNumber(value);
          }}
        />
      </View>
    );
  };

  const renderEmailLoginInput = () => {
    return (
      <GlobalInputText
        label="Email"
        isMandatory
        placeholder="Enter your email"
        value={email}
        onChangeText={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderLoginMethodInput = () => {
    const renderInput =
      loginMethod === 'email'
        ? renderEmailLoginInput()
        : renderPhoneNumberLoginInput();

    return <View style={styles.viewMethodInput}>{renderInput}</View>;
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
        <Text style={styles.textNext}>Request OTP</Text>
      </TouchableOpacity>
    );
  };

  const renderTextInformation = () => {
    const text = loginMethod === 'email' ? 'email' : 'mobile number';
    return (
      <Text style={styles.textInformation}>
        4 digits OTP will be sent to your {text}
      </Text>
    );
  };
  console.log({tnc: checkTncPolicyData().tnc}, 'laka');
  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <HeaderV2 isCenterLogo={appConfig.appName !== 'fareastflora'} />
      <Body style={styles.root}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Login</Text>
            {renderTextLogin()}
            {renderChangeLoginMethod()}
            {renderLoginMethodInput()}
            {renderButtonNext()}
            {renderTextInformation()}
          </View>
        </KeyboardAwareScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default Login;

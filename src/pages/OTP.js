/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {sendOTP, loginUser} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';

import {Header} from '../components/layout';
import OTPField from '../components/fieldOTP';
import LoadingScreen from '../components/loadingScreen';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import Theme from '../theme';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      height: HEIGHT - 54,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    touchableNext: {
      marginTop: 32,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    textHeader: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNext: {
      color: 'white',
    },
    textVerify: {
      marginTop: 32,
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInputOtp: {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 0,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    viewInputOtp: {
      marginVertical: 32,
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textSendOtp: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.textQuaternary,
    },
    textSendOtpDisabled: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.textTertiary,
    },
    textBold: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
  });
  return styles;
};

const OTP = ({isLogin, method, methodValue}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [sendCounter, setSendCounter] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const countdown = () => {
    let second = 59;
    let minute = sendCounter >= 2 ? 4 : 0;
    setSeconds(second);
    setMinutes(minute);
    const result = setInterval(() => {
      second = second - 1;
      setSeconds(second);
      if (second === 0) {
        if (!minute && !second) {
          clearInterval(result);
        } else {
          second = 60;
          minute = minute - 1;
          setMinutes(minute);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    countdown();

    const backAction = () => {
      Actions.popTo('pageIndex');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleLogin = async otp => {
    let value = {};
    if (method === 'email') {
      value.email = methodValue;
    } else {
      value.phoneNumber = methodValue;
    }

    value.isUseApp = true;
    value.codeOTP = otp;

    /**
     * Get device token from onesignal
     */
    try {
      const deviceState = await OneSignal.getDeviceState();
      value.player_ids = deviceState?.userId;
    } catch (e) {
      console.error('Unable to get push token ', e);
    }

    setIsLoading(true);
    const response = await dispatch(loginUser(value));
    setIsLoading(false);
    if (response?.statusCustomer) {
      Actions.pageIndex();
    } else {
      const message = response?.message || 'Failed';

      await dispatch(showSnackbar({message}));
    }
  };

  const renderTextHeader = () => {
    let text = '';
    if (isLogin) {
      text = method === 'email' ? 'Email Login' : 'Mobile Login';
    } else {
      text = method === 'email' ? 'Email Register' : 'Mobile Register';
    }

    return <Text style={styles.textHeader}>{text}</Text>;
  };

  const renderTextVerify = () => {
    const text = method === 'email' ? 'email' : 'number';

    return (
      <Text style={styles.textVerify}>
        We sent an OTP code to verify your {text} at
        <Text style={styles.textBold}> {methodValue}</Text>
      </Text>
    );
  };

  const handleResendOtp = async () => {
    let value = {};

    if (method === 'email') {
      value.email = methodValue;
    } else {
      value.phoneNumber = methodValue;
    }
    setSendCounter(sendCounter + 1);
    setIsLoading(true);
    await countdown();
    await dispatch(sendOTP(value));
    setIsLoading(false);
  };

  const renderResendOTP = () => {
    const disabled = minutes || seconds;
    const time = moment(`${minutes}:${seconds}`, 'mm:ss').format('mm:ss');
    const text = disabled ? `Resend OTP after ${time}` : 'Resend OTP';

    const styleText = disabled
      ? styles.textSendOtpDisabled
      : styles.textSendOtp;

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          handleResendOtp();
        }}>
        <Text style={styleText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonNext = () => {
    return (
      <TouchableOpacity
        disabled={isLoading}
        style={styles.touchableNext}
        onPress={() => {
          handleLogin();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const renderOtpField = () => {
    return (
      <OTPField
        onComplete={value => {
          handleLogin(value);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header isMiddleLogo />
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {renderTextHeader()}
          {renderTextVerify()}
          {renderOtpField()}
          {renderResendOTP()}
          {renderButtonNext()}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OTP;

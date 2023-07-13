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

import {Header} from '../components/layout';
import OTPField from '../components/fieldOTP';
import LoadingScreen from '../components/loadingScreen';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import Theme from '../theme';
import GlobalText from '../components/globalText';
import appConfig from '../config/appConfig';
import HeaderV2 from '../components/layout/header/HeaderV2';
import GlobalModal from '../components/modal/GlobalModal';
import GlobalButton from '../components/button/GlobalButton';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      display: 'flex',
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    touchableNext: {
      marginTop: 32,
      height: 40,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    textHeader: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
      marginTop: 32,
    },
    textNext: {
      color: 'white',
    },
    textVerify: {
      marginTop: 8,
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
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textBold: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    resendText: {
      textAlign: 'center',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    modalContainer: {
      padding: 0,
    },
    titleCancelStyle: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 16,
    },
    cancelDescription: {
      textAlign: 'center',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    actionCancelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      // flex: 1,
    },
    btnContainer: {
      width: '49%',
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
  const [isWrongOtp, setIsWrongOtp] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openCancelVerification, setOpenCancelVerification] = React.useState(
    false,
  );
  const countdown = () => {
    let minuteCount = sendCounter >= 2 ? 4 : 1;

    const then = moment()
      .add(minuteCount, 'minutes')
      .format('MM/DD/YYYY HH:mm:ss');

    const result = setInterval(() => {
      const now = moment().format('MM/DD/YYYY HH:mm:ss');
      const ms = moment(then).diff(moment(now));

      var duration = moment.duration(ms);
      var second = duration.seconds();
      var minute = duration.minutes();
      setSeconds(second);
      setMinutes(minute);

      if (second <= 0 && minute <= 0) {
        setSeconds(0);
        setMinutes(0);
        clearInterval(result);
      }
    }, 1);
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
    setIsWrongOtp(false);
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
      setIsWrongOtp(true);
    }
  };

  const renderTextHeader = () => {
    let text = '';
    if (isLogin) {
      text = method === 'email' ? 'Verify Your Email' : 'Verify Your Mobile No';
    } else {
      text = method === 'email' ? 'Verify Your Email' : 'Verify Your Mobile No';
    }

    return <Text style={styles.textHeader}>{text}</Text>;
  };

  const renderTextVerify = () => {
    const text = method === 'email' ? 'email' : 'number';

    return (
      <Text style={styles.textVerify}>
        We have sent an OTP code to verify your {text} at
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
    const text = disabled ? `Resend OTP in ${time}` : 'Resend OTP';

    const styleText = disabled
      ? styles.textSendOtpDisabled
      : styles.textSendOtp;

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          handleResendOtp();
        }}>
        <GlobalText style={styles.resendText}>
          Didn’t receive code? <GlobalText style={styleText}>{text}</GlobalText>
        </GlobalText>
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
        <Text style={styles.textNext}>Verify and Create Account</Text>
      </TouchableOpacity>
    );
  };

  const renderOtpField = () => {
    return (
      <OTPField
        isWrongOtp={isWrongOtp}
        onComplete={value => {
          handleLogin(value);
        }}
      />
    );
  };

  const onBackHandle = () => {
    setOpenCancelVerification(true);
    return true;
  };

  const onClosePopupCancel = () => {
    setOpenCancelVerification(false);
  };

  const onBack = () => {
    Actions.pop();
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackHandle);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackHandle);
    };
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {appConfig.appName === 'fareastflora' ? (
        <HeaderV2 onBackBtn={onBackHandle} />
      ) : (
        <Header onBackBtn={onBackHandle} isMiddleLogo />
      )}
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {renderTextHeader()}
          {renderTextVerify()}
          {renderOtpField()}
          {renderResendOTP()}
          {renderButtonNext()}
        </View>
      </KeyboardAwareScrollView>
      <GlobalModal
        onBackdropPress={onClosePopupCancel}
        isVisible={openCancelVerification}
        title="Cancel Verification?"
        titleStyle={styles.titleCancelStyle}
        hideCloseIcon>
        <View>
          <GlobalText style={styles.cancelDescription}>
            This action might caused the OTP you have received to be invalid.
          </GlobalText>
        </View>
        <View style={styles.actionCancelContainer}>
          <View style={styles.btnContainer}>
            <GlobalButton
              onPress={onClosePopupCancel}
              isOutline
              title="Cancel"
            />
          </View>
          <View style={styles.btnContainer}>
            <GlobalButton onPress={onBack} title="Yes" />
          </View>
        </View>
      </GlobalModal>
    </SafeAreaView>
  );
};

export default OTP;

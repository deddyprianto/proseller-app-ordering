/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import Theme from '../../theme/Theme';
import OTPField from '../fieldOTP/FieldOTP';
import useCountdownV2 from '../../hooks/time/useCountdownV2';
import moment from 'moment';
import GlobalText from '../globalText';
import {useDispatch} from 'react-redux';
import {sendOTP} from '../../actions/auth.actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import GlobalButton from '../button/GlobalButton';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
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
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textVerify: {
      marginTop: 8,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
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
    containerOtp: {
      display: 'flex',
      paddingHorizontal: 16,
    },
  });
  return {styles};
};

/**
 * @typedef {Object} OtpProps
 * @property {boolean} isLogin
 * @property {string} method
 * @property {string} methodValue
 * @property {boolean} isWrongOtp
 * @property {Function} onSubmitOtp
 * @property {string} buttonNextText
 */

/**
 * @param {OtpProps} props
 */

const OtpComponent = props => {
  const {method, methodValue, isWrongOtp, onSubmitOtp} = props;
  const {styles} = useStyles();
  const [sendCounter, setSendCounter] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const dispatch = useDispatch();
  const {countdownStart, minutes, seconds} = useCountdownV2();

  const renderTextHeader = () => {
    let text = '';
    if (method === 'email') {
      text = 'Verify Your Email';
    } else {
      text = 'Verify Your Mobile No';
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

  const submitOtp = value => {
    if (onSubmitOtp && typeof onSubmitOtp === 'function') {
      onSubmitOtp(value);
    }
  };

  const onChageOtpText = val => setOtp(val);

  const renderOtpField = () => {
    return (
      <OTPField
        onChangeOtp={onChageOtpText}
        isWrongOtp={isWrongOtp}
        onComplete={submitOtp}
      />
    );
  };
  const startCountDown = () => {
    const minuteCount = sendCounter >= 2 ? 4 : 1;
    const expiredData = moment()
      .add(minuteCount, 'minutes')
      .format();
    countdownStart(expiredData);
  };

  React.useEffect(() => {
    startCountDown();
    handleResendOtp();
  }, []);

  const handleResendOtp = async () => {
    let value = {};

    if (method === 'email') {
      value.email = methodValue;
    } else {
      value.phoneNumber = methodValue;
    }
    setSendCounter(sendCounter + 1);
    setIsLoading(true);
    startCountDown();
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
      <GlobalButton
        disabled={isLoading || otp.length < 4}
        title={props.buttonNextText || 'Verify'}
        onPress={() => submitOtp(otp)}
      />
    );
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.containerOtp}>
        {renderTextHeader()}
        {renderTextVerify()}
        {renderOtpField()}
        {renderResendOTP()}
        {renderButtonNext()}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(OtpComponent);

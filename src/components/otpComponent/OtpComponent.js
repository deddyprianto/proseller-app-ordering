import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import OTPField from '../otpField/OTPField';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      display: 'flex',
      paddingHorizontal: 16,
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
      fontFamily: theme.fontFamily.poppinsMedium,
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
  return {styles};
};

/**
 * @typedef {Object} GlobalTextProps
 * @property {boolean} isLogin
 * @property {string} method
 * @property {string} methodValue
 * @property {boolean} isWrongOtp
 * @property {Function} onSubmitOtp
 */

/**
 * @param {GlobalTextProps} props
 */

const OtpComponent = props => {
  const {isLogin, method, methodValue, isWrongOtp, onSubmitOtp} = props;
  const {styles} = useStyles();

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

  const renderOtpField = () => {
    return <OTPField isWrongOtp={isWrongOtp} onComplete={onSubmitOtp} />;
  };

  return <></>;
};

export default OtpComponent;

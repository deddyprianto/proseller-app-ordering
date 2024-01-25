/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef, useEffect} from 'react';

import {StyleSheet, View, TextInput} from 'react-native';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../helper/Layout';
import Theme from '../../theme/Theme';
import GlobalText from '../globalText';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    root: {
      marginVertical: 32,
      width: '100%',
      flex: 1,
      alignItems: 'center',
    },
    textInputOtp: isWrongOtp => ({
      width: normalizeLayoutSizeWidth(54),
      height: normalizeLayoutSizeHeight(72),
      borderRadius: 12,
      paddingVertical: 0,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: colors.greyScale4,
      fontSize: 24,
      fontFamily: fontFamily.poppinsMedium,
      color: isWrongOtp ? '#EB4B41' : 'black',
    }),
    textInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '70%',
    },
    errorMessage: {
      color: '#EB4B41',
      fontFamily: fontFamily.poppinsMedium,
      fontSize: 14,
    },
    errorContainer: {
      marginTop: 32,
    },
  });
  return {styles, colors, fontFamily};
};

const FieldOTP = ({onComplete, isWrongOtp, onChangeOtp}) => {
  const refs = useRef([]);
  const otpArray = Array.from(Array(4));
  const {styles} = useStyles();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [onOtpFocus, setOnOtpFocus] = React.useState(false);
  useEffect(() => {
    if (otp[3]) {
      const value = otp.join('');
      onComplete(value);
    }
    if (otp && onChangeOtp && typeof onChangeOtp === 'function') {
      onChangeOtp(otp.join(''));
    }
  }, [otp]);

  const handleInputOtp = (event, index) => {
    let results = [...otp];
    results[index] = event;
    setOtp(results);

    if (event) {
      if (index !== 0 && !event) {
        return refs.current[index - 1]?.focus();
      }

      if (otpArray.length - 1 !== index && event) {
        return refs.current[index + 1]?.focus();
      }
    }
  };

  const onAutomaticOpenKeyboard = () => {
    setTimeout(() => {
      setOnOtpFocus(true);
    }, 500);
  };

  React.useEffect(() => {
    if (onOtpFocus) {
      refs.current[0]?.focus();
    }
  }, [onOtpFocus]);

  const renderTextInput = (index, length) => {
    return (
      <TextInput
        ref={ref => {
          refs.current[index] = ref;
        }}
        maxLength={1}
        value={otp[index]}
        keyboardType="numeric"
        style={styles.textInputOtp(isWrongOtp)}
        selection={{start: otp[index]?.length || 0}}
        onLayout={onAutomaticOpenKeyboard}
        onChangeText={value => {
          handleInputOtp(value.replace(/[^0-9]/g, ''), index);
        }}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace' && index !== 0) {
            refs.current[index] = null;
            refs.current[index - 1]?.focus();
          }
        }}
      />
    );
  };
  const renderInputOtp = () => {
    const result = otpArray.map((_, index) => {
      return renderTextInput(index, otpArray.length);
    });
    return result;
  };

  return (
    <View style={styles.root}>
      <View style={styles.textInputContainer}>{renderInputOtp()}</View>
      {isWrongOtp ? (
        <View style={styles.errorContainer}>
          <GlobalText style={styles.errorMessage}>
            Invalid OTP. Please check your entry and try again.
          </GlobalText>
        </View>
      ) : null}
    </View>
  );
};

export default FieldOTP;

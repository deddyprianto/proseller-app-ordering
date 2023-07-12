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
    textInputOtp: {
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
    },
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

const FieldOTP = ({onComplete, isWrongOtp}) => {
  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };
  const {styles} = useStyles();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (otp[3]) {
      const value = otp.join('');
      onComplete(value);
    }
  }, [otp]);

  const handleInputOtp = (event, index) => {
    let results = [...otp];
    results[index] = event;
    setOtp(results);

    const arrayLength = Array.from(Array(4)).length;
    if (event) {
      if (index !== 0 && !event) {
        return ref[`otp${index - 1}`].focus();
      }

      if (arrayLength - 1 !== index && event) {
        return ref[`otp${index + 1}`].focus();
      }
    }
  };

  const renderTextInput = index => {
    return (
      <TextInput
        ref={r => {
          ref[`otp${index}`] = r;
        }}
        value={otp[index]}
        autoFocus={index === 0}
        keyboardType="numeric"
        style={styles.textInputOtp}
        maxLength={1}
        onChangeText={value => {
          handleInputOtp(value.replace(/[^0-9]/g, ''), index);
        }}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace' && !otp[index] && index !== 0) {
            return ref[`otp${index - 1}`].focus();
          }
        }}
      />
    );
  };

  const renderInputOtp = () => {
    const result = Array.from(Array(4)).map((_, index) => {
      return renderTextInput(index);
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef, useEffect} from 'react';

import {StyleSheet, View, TextInput} from 'react-native';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginVertical: 32,
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      backgroundColor: theme.colors.background,
    },
  });
  return styles;
};

const FieldOTP = ({onComplete}) => {
  const styles = useStyles();
  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };

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

    console.log(results);
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

  return <View style={styles.root}>{renderInputOtp()}</View>;
};

export default FieldOTP;

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef, useEffect} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';

import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';
import {sendOTP, loginUser} from '../actions/auth.actions';
import LoadingScreen from '../components/loadingScreen';
import {showSnackbar} from '../actions/setting.action';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
  textHeader: {
    color: colorConfig.primaryColor,
    fontSize: 20,
  },
  textNext: {color: 'white'},
  textVerify: {
    width: '80%',
    textAlign: 'center',
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
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSendOtp: {
    width: '100%',
    textAlign: 'center',
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
  },
  textSendOtpDisabled: {
    width: '100%',
    textAlign: 'center',
    color: '#B7B7B7',
    textDecorationLine: 'underline',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

const OTP = ({isLogin, method, methodValue}) => {
  const dispatch = useDispatch();

  const [sendCounter, setSendCounter] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState([]);

  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };

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

  const handleLogin = async () => {
    let value = {};
    const otpFormatted = otp.join('');
    if (method === 'email') {
      value.email = methodValue;
    } else {
      value.phoneNumber = methodValue;
    }

    value.codeOTP = otpFormatted;

    const response = await dispatch(loginUser(value));
    if (response?.statusCustomer) {
      Actions.pageIndex();
    } else {
      const message = response?.message || 'Failed';

      await dispatch(showSnackbar({message}));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (otp[3]) {
        setIsLoading(true);
        await handleLogin();
        setIsLoading(false);
      }
    };

    loadData();
  }, [otp]);

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="contain"
        source={appConfig.logoMerchant}
      />
    );
  };

  const renderTextHeader = () => {
    let text = '';
    if (isLogin) {
      text = method === 'email' ? 'Email Sign In' : 'Mobile Sign In';
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

  const handleInputOtp = (value, index) => {
    const arrayLength = Array.from(Array(4)).length;

    let results = [...otp];
    results[index] = value;
    setOtp(results);
    if (index !== 0 && !value) {
      return ref[`otp${index - 1}`].focus();
    }

    if (arrayLength - 1 !== index && value) {
      return ref[`otp${index + 1}`].focus();
    }
  };

  const renderTextInput = ({inputRef, autoFocus, onChangeText}) => {
    return (
      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        keyboardType="numeric"
        style={styles.textInputOtp}
        maxLength={1}
        onChangeText={onChangeText}
      />
    );
  };

  const renderInputOtp = () => {
    const result = Array.from(Array(4)).map((_, index) => {
      return renderTextInput({
        autoFocus: index === 0,
        inputRef: r => {
          ref[`otp${index}`] = r;
        },
        onChangeText: value => {
          handleInputOtp(value.replace(/[^0-9]/g, ''), index);
        },
      });
    });

    return <View style={styles.viewInputOtp}>{result}</View>;
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
  return (
    <SafeAreaView>
      <LoadingScreen loading={isLoading} />
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={{marginTop: '25%'}} />
          {renderImages()}
          <View style={{marginTop: '15%'}} />
          {renderTextHeader()}
          <View style={{marginTop: '20%'}} />
          {renderTextVerify()}
          <View style={{marginTop: '15%'}} />
          {renderInputOtp()}
          <View style={{marginTop: '15%'}} />
          {renderResendOTP()}
          <View style={{marginTop: '10%'}} />
          {renderButtonNext()}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OTP;

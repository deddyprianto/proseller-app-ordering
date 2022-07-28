import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import appConfig from '../config/appConfig';
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {ScrollView} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import {checkAccountExist} from '../actions/auth.actions';
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
      paddingHorizontal: 48,
    },
    image: {
      width: 150,
      height: 40,
      marginHorizontal: 20,
    },
    textCreateNewAccount: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[20],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textNext: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textChangeMethod: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
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
  });
  return styles;
};

const Register = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registerMethod, setRegisterMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const loginSettings = useSelector(
    state => state.settingReducer.loginSettings,
  );

  useEffect(() => {
    if (loginSettings.loginByEmail) {
      setRegisterMethod('email');
    } else {
      setRegisterMethod('phoneNumber');
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [loginSettings]);

  const handleCheckAccount = async () => {
    let payload = {};
    let value = '';

    if (registerMethod === 'email') {
      payload.email = email;
      value = email;
    } else {
      payload.phoneNumber = countryCode + phoneNumber;
      value = countryCode + phoneNumber;
    }

    setIsLoading(true);
    const response = await dispatch(checkAccountExist(payload));

    if (response?.status) {
      const message =
        registerMethod === 'email'
          ? 'Email already exist'
          : 'Mobile Number already exist';

      dispatch(
        showSnackbar({
          message,
        }),
      );
    } else {
      Actions.registerForm({registerMethod, inputValue: value});
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

  const renderPhoneNumberRegisterInput = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Enter mobile number to begin :"
        value={phoneNumber}
        placeholder="Mobile Number"
        onChangeCountryCode={value => {
          setCountryCode(value);
        }}
        onChange={value => {
          setPhoneNumber(value);
        }}
      />
    );
  };

  const renderEmailRegisterInput = () => {
    return (
      <FieldTextInput
        label="Enter email to begin :"
        placeholder="Enter email to begin"
        value={email}
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderRegisterMethodInput = () => {
    if (registerMethod === 'email') {
      return renderEmailRegisterInput();
    } else {
      return renderPhoneNumberRegisterInput();
    }
  };

  const renderButtonNext = () => {
    const active = phoneNumber.length >= 6 || email;

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleCheckAccount();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const handleChangeRegisterMethod = () => {
    setEmail('');
    setPhoneNumber('');
    if (registerMethod === 'email') {
      setRegisterMethod('phoneNumber');
    } else {
      setRegisterMethod('email');
    }
  };

  const renderTextChangeMethod = () => {
    const {loginByMobile, loginByEmail} = loginSettings;
    if (loginByEmail && loginByMobile) {
      const text =
        registerMethod === 'email'
          ? 'Use Mobile Number to Create Account'
          : 'Use Email Address to Create Account';

      return (
        <TouchableOpacity
          onPress={() => {
            handleChangeRegisterMethod();
          }}>
          <Text style={styles.textChangeMethod}>{text}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
        <View style={{marginTop: '25%'}} />
        {renderImages()}
        <View style={{marginTop: '10%'}} />
        <Text style={styles.textCreateNewAccount}>Create a new account</Text>
        <View style={{marginTop: '30%'}} />
        {renderRegisterMethodInput()}
        <View style={{marginTop: '10%'}} />
        {renderButtonNext()}
        <View style={{marginTop: '15%'}} />
        {renderTextChangeMethod()}
      </View>
    </ScrollView>
  );
};

export default Register;

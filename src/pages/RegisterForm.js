import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import {Header} from '../components/layout';
import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import {createNewUser} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';
import LoadingScreen from '../components/loadingScreen';
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
    image: {
      width: 150,
      height: 40,
      marginHorizontal: 20,
    },
    textHeader: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRegisterFor: {
      marginVertical: 32,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
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
    touchableNextDisabled: {
      marginTop: 32,
      height: 40,
      width: '100%',
      backgroundColor: '#B7B7B7',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textNext: {
      color: 'white',
    },
    textChangeMethod: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.textQuaternary,
    },
    viewMethodInput: {
      marginTop: 32,
      width: '100%',
    },
  });
  return styles;
};

const RegisterForm = ({registerMethod, inputValue}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (registerMethod === 'email') {
      setEmail(inputValue);
    } else {
      setPhoneNumber(inputValue);
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [inputValue, registerMethod]);

  const handleRegister = async () => {
    const phone =
      registerMethod === 'email' ? countryCode + phoneNumber : inputValue;
    const methodValue = registerMethod === 'email' ? email : phone;

    const payload = {
      name: name,
      password: 'P@ssw0rd123',
      username: phone,
      email: email,
      phoneNumber: phone,
      registerMethod,
    };
    setIsLoading(true);
    const response = await dispatch(createNewUser(payload));

    if (typeof response === 'boolean' && response) {
      setIsLoading(false);
      Actions.otp({
        isLogin: false,
        method: registerMethod,
        methodValue: methodValue,
      });
    } else {
      setIsLoading(false);

      const message = response?.message || 'Register Failed!';
      dispatch(
        showSnackbar({
          message,
        }),
      );
    }
  };

  const renderTextHeader = () => {
    const title =
      registerMethod === 'email' ? 'Email Register' : 'Mobile Register';

    return <Text style={styles.textHeader}>{title}</Text>;
  };

  const renderTestRegisterFor = () => {
    return (
      <Text style={styles.textRegisterFor}>Register for {inputValue}</Text>
    );
  };

  const renderNameInput = () => {
    return (
      <FieldTextInput
        label="Full Name"
        value={name}
        placeholder="Full Name"
        onChange={value => {
          setName(value);
        }}
      />
    );
  };

  const renderPhoneNumberRegisterInput = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Phone Number"
        value={phoneNumber}
        placeholder="Phone Number"
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
        label="Email"
        value={email}
        placeholder="Email"
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderEmailOrPhoneInput = () => {
    const renderInput =
      registerMethod === 'email'
        ? renderPhoneNumberRegisterInput()
        : renderEmailRegisterInput();

    return <View style={styles.viewMethodInput}>{renderInput}</View>;
  };

  const renderButtonNext = () => {
    let active = false;

    if (registerMethod === 'email') {
      active = name && phoneNumber.length >= 6;
    } else {
      active = name && email;
    }

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleRegister();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header isMiddleLogo />
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {renderTextHeader()}
          {renderTestRegisterFor()}
          {renderNameInput()}
          {renderEmailOrPhoneInput()}
          {renderButtonNext()}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterForm;

import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import appConfig from '../config/appConfig';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import {createNewUser} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';
import LoadingScreen from '../components/loadingScreen';

const HEIGHT = Dimensions.get('window').height;

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
  textHeader: {
    color: colorConfig.primaryColor,
    fontSize: 20,
  },
  textRegisterFor: {
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  touchableNext: {
    height: 40,
    width: '100%',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableNextDisabled: {
    height: 40,
    width: '100%',
    backgroundColor: '#B7B7B7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNext: {color: 'white'},
  textChangeMethod: {
    width: '100%',
    textAlign: 'center',
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
  },
});

const RegisterForm = ({registerMethod, inputValue}) => {
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

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={appConfig.logoMerchant}
      />
    );
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
    if (registerMethod === 'email') {
      return renderPhoneNumberRegisterInput();
    } else {
      return renderEmailRegisterInput();
    }
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
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
        <View style={{marginTop: '25%'}} />
        {renderImages()}
        <View style={{marginTop: '10%'}} />
        {renderTextHeader()}
        <View style={{marginTop: '10%'}} />
        {renderTestRegisterFor()}
        <View style={{marginTop: '10%'}} />
        {renderNameInput()}
        <View style={{marginTop: '5%'}} />
        {renderEmailOrPhoneInput()}
        <View style={{marginTop: '15%'}} />
        {renderButtonNext()}
      </View>
    </ScrollView>
  );
};

export default RegisterForm;

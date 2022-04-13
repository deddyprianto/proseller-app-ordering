import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import CountryPicker from '../components/react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 40,
    marginHorizontal: 20,
    marginTop: 80,
  },
  touchableNext: {
    height: 40,
    width: 150,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
  },
  textCreateNewAccount: {
    color: colorConfig.primaryColor,
    fontSize: 20,
    marginTop: 30,
  },
  textNext: {color: 'white'},
  textInputPhone: {
    paddingVertical: 0,
    width: 200,
    height: 40,
  },
  textEnterMobileNumber: {
    width: '70%',
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 100,
  },
  viewCountryPicker: {width: 0, height: 0},
  viewInputPhoneNumber: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  width70: {width: 70},
  viewFlag: {
    width: 35,
    height: 25,
  },
});

const Login = () => {
  const [openModal, setOpenModal] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    setCountryCode(awsConfig.phoneNumberCode);
  }, []);

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={appConfig.funtoastIcon}
      />
    );
  };

  const renderButtonNext = () => {
    return (
      <TouchableOpacity
        style={styles.touchableNext}
        onPress={() => {
          Actions.otp();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const renderModalCountryPicker = () => {
    return (
      <View style={styles.viewCountryPicker}>
        <CountryPicker
          translation="eng"
          withCallingCode
          visible={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          withFilter
          withFlag={true}
          onSelect={country => {
            setCountryCode(`+${country.callingCode[0]}`);
          }}
        />
      </View>
    );
  };
  const renderInputPhoneNumber = () => {
    return (
      <View style={styles.viewInputPhoneNumber}>
        <PhoneInput
          style={styles.width70}
          flagStyle={styles.viewFlag}
          value={countryCode}
          onPressFlag={() => {
            setOpenModal(true);
          }}
        />
        <TextInput
          keyboardType={'numeric'}
          style={styles.textInputPhone}
          value={phoneNumber}
          onChangeText={value => {
            setPhoneNumber(value.replace(/[^0-9]/g, ''));
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderModalCountryPicker()}
      {renderImages()}
      <Text style={styles.textCreateNewAccount}>Login</Text>
      <Text style={styles.textEnterMobileNumber}>
        Enter mobile number to begin :
      </Text>
      {renderInputPhoneNumber()}
      {renderButtonNext()}
    </SafeAreaView>
  );
};

export default Login;

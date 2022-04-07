import React, {useState, useRef} from 'react';
import {Actions} from 'react-native-router-flux';

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

import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
  textInputOtpNumber: {
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

const OTP = () => {
  const [openModal, setOpenModal] = useState(false);
  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };

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
          Actions.pageIndex();
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

  const renderTextInput = ({inputRef, autoFocus, onChangeText}) => {
    return (
      <View>
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          keyboardType="numeric"
          style={{
            width: 30,
            height: 30,
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: 0,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
          maxLength={1}
          onChangeText={onChangeText}
        />
      </View>
    );
  };

  const handleInputOtp = (event, index) => {
    const arrayLength = Array.from(Array(4)).length;

    if (index !== 0 && !event) {
      return ref[`otp${index - 1}`].focus();
    }

    if (arrayLength - 1 !== index && event) {
      return ref[`otp${index + 1}`].focus();
    }
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
    return result;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderModalCountryPicker()}
      {renderImages()}
      <Text style={styles.textCreateNewAccount}>Create a new account</Text>
      <Text style={styles.textInputOtpNumber}>
        We sent an OTP code to verify your number
      </Text>
      <View
        style={{
          width: '40%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {renderInputOtp()}
      </View>

      {renderButtonNext()}
    </SafeAreaView>
  );
};

export default OTP;

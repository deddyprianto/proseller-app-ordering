import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, TextInput} from 'react-native';

import CountryPicker from '../react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

import awsConfig from '../../config/awsConfig';

const styles = StyleSheet.create({
  container: {width: '100%'},
  viewCountryPicker: {width: 0, height: 0},
  viewPhoneNumberInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
  },
  textInputPhoneNumber: {
    paddingVertical: 0,
    width: '75%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  wrapFlag: {
    width: '25%',
  },
  viewFlag: {
    width: 35,
    height: 25,
  },
  textInputDefault: {
    paddingVertical: 0,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    marginTop: 12,
  },
  text: {
    width: '100%',
    textAlign: 'left',
  },
});

const TextInputField = ({
  type,
  label,
  customLabel,
  placeholder,
  value,
  onChange,
  onChangeCountryCode,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [countryCode, setCountryCode] = useState('');

  useEffect(() => {
    setCountryCode(awsConfig.phoneNumberCode);
  }, []);

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
            onChangeCountryCode(`+${country.callingCode[0]}`);
            setCountryCode(`+${country.callingCode[0]}`);
          }}
        />
      </View>
    );
  };

  const renderPhoneNumberInput = () => {
    const phoneNumber = value.replace(countryCode, '');

    return (
      <View style={styles.viewPhoneNumberInput}>
        <PhoneInput
          style={styles.wrapFlag}
          flagStyle={styles.viewFlag}
          value={countryCode}
          onPressFlag={() => {
            setOpenModal(true);
          }}
        />
        <TextInput
          keyboardType={'numeric'}
          style={styles.textInputPhoneNumber}
          value={phoneNumber}
          placeholder={placeholder}
          onChangeText={value => {
            onChange(value.replace(/[^0-9]/g, ''));
          }}
        />
      </View>
    );
  };

  const renderNumberInput = () => {
    return (
      <TextInput
        keyboardType={'numeric'}
        style={styles.textInputDefault}
        value={value}
        placeholder={placeholder}
        onChangeText={value => {
          onChange(value.replace(/[^0-9]/g, ''));
        }}
      />
    );
  };

  const renderTextInput = () => {
    return (
      <TextInput
        style={styles.textInputDefault}
        value={value}
        placeholder={placeholder}
        onChangeText={value => {
          onChange(value);
        }}
      />
    );
  };

  const renderInput = () => {
    if (type === 'phone') {
      return renderPhoneNumberInput();
    } else if (type === 'number') {
      return renderNumberInput();
    } else {
      return renderTextInput();
    }
  };

  const renderLabel = () => {
    if (customLabel) {
      return customLabel(value);
    }

    return <Text style={styles.text}>{label}</Text>;
  };

  return (
    <View style={styles.container}>
      {renderModalCountryPicker()}
      {renderLabel()}
      {renderInput()}
    </View>
  );
};

export default TextInputField;

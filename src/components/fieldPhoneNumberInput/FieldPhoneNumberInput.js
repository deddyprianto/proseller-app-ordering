import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, TextInput} from 'react-native';

import CountryPicker from '../react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

import awsConfig from '../../config/awsConfig';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderColor: '#00000061',
  },
  viewCountryPicker: {width: 0, height: 0},
  viewInput: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  viewCountryCodeAndPhoneNumber: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapFlag: {
    width: '12%',
  },
  viewFlag: {
    width: 35,
    height: 25,
  },
  textLabel: {
    width: '100%',
    textAlign: 'left',
    color: '#00000099',
    fontSize: 12,
  },
  textCountryCode: {
    color: '#00000099',
    fontSize: 14,
  },
  textInputPhoneNumber: {
    width: '80%',
    height: 21,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  divider: {
    backgroundColor: '#E5E5E5',
    width: 1,
    height: '100%',
  },
});

const FieldPhoneNumberInput = ({
  label,
  customLabel,
  placeholder,
  value,
  valueCountryCode,
  onChange,
  onChangeCountryCode,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [countryCode, setCountryCode] = useState('+65');

  useEffect(() => {
    setCountryCode(valueCountryCode || awsConfig.phoneNumberCode);
  }, [valueCountryCode]);

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

  const renderLabel = () => {
    if (customLabel) {
      return customLabel(value);
    }

    return <Text style={styles.textLabel}>{label}</Text>;
  };

  const renderFlag = () => {
    return (
      <PhoneInput
        style={styles.wrapFlag}
        flagStyle={styles.viewFlag}
        onPressFlag={() => {
          setOpenModal(true);
        }}
        value={countryCode}
      />
    );
  };

  const renderInput = () => {
    const phoneNumber = value.replace(countryCode, '');

    return (
      <View style={styles.viewInput}>
        {renderLabel()}
        <View style={styles.viewCountryCodeAndPhoneNumber}>
          <Text style={styles.textCountryCode}>{countryCode}</Text>
          <View style={{marginRight: 6}} />
          <TextInput
            keyboardType={'numeric'}
            style={styles.textInputPhoneNumber}
            value={phoneNumber}
            placeholder={placeholder}
            onChangeText={value => {
              onChange(value.replace(/[^0-9]/g, ''));
              onChangeCountryCode(countryCode);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderModalCountryPicker()}
      {renderFlag()}
      <View style={styles.divider} />
      {renderInput()}
    </View>
  );
};

export default FieldPhoneNumberInput;

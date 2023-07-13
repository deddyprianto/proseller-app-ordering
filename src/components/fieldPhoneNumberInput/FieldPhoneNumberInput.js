import React, {useEffect, useState} from 'react';

import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';

import CountryPicker from '../react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';
import GlobalText from '../globalText';
import ArrowBottom from '../../assets/svg/ArrowBottom';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderColor: theme.colors.border1,
      backgroundColor: theme.colors.background,
    },
    viewCountryPicker: {
      width: 0,
      height: 0,
    },
    viewInput: {
      flex: 1,
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewCountryCodeAndPhoneNumber: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewFlag: {
      width: 35,
      height: 25,
      borderRadius: 4,
    },
    textLabel: {
      height: 16,
      width: '100%',
      textAlign: 'left',
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textPlaceholder: {
      height: 21,
      color: theme.colors.text2,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textCountryCode: {
      height: 21,
      marginRight: 8,
      color: theme.colors.text2,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textInputPhoneNumber: {
      flex: 1,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    divider: {
      width: 1,
      height: 34,
      marginHorizontal: 12,
      backgroundColor: theme.colors.border,
    },
    mandatoryStyle: {
      color: '#CE1111',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    labelText: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    withoutFlagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowBottomContainer: {
      marginRight: 16,
    },
  });
  return styles;
};

const FieldPhoneNumberInput = ({
  label,
  customLabel,
  placeholder,
  value,
  valueCountryCode,
  onChange,
  onChangeCountryCode,
  inputLabel,
  isMandatory,
  withoutFlag,
}) => {
  const styles = useStyles();
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

  const renderFlag = () => {
    return (
      <PhoneInput
        style={styles.viewFlag}
        flagStyle={styles.viewFlag}
        onPressFlag={() => {
          setOpenModal(true);
        }}
        value={countryCode}
      />
    );
  };

  const renderLabel = () => {
    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    return <GlobalText style={styles.textLabel}>{label}</GlobalText>;
  };

  const handleOpenModal = () => setOpenModal(true);

  const renderValue = () => {
    const phoneNumber = value.replace(countryCode, '');

    return (
      <View style={styles.viewCountryCodeAndPhoneNumber}>
        {withoutFlag ? (
          <TouchableOpacity
            onPress={handleOpenModal}
            style={styles.withoutFlagContainer}>
            <GlobalText>{countryCode}</GlobalText>
            <View style={styles.arrowBottomContainer}>
              <ArrowBottom />
            </View>
          </TouchableOpacity>
        ) : (
          <GlobalText style={styles.textCountryCode}>{countryCode}</GlobalText>
        )}
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
    );
  };

  const renderInput = () => {
    return (
      <View style={styles.viewInput}>
        {renderLabel()}
        {renderValue()}
      </View>
    );
  };

  return (
    <>
      <GlobalText style={styles.labelText}>
        {inputLabel}{' '}
        {isMandatory ? (
          <GlobalText style={styles.mandatoryStyle}>*</GlobalText>
        ) : null}{' '}
      </GlobalText>
      <View style={styles.root}>
        {renderModalCountryPicker()}
        {withoutFlag ? null : (
          <>
            {renderFlag()}
            <View style={styles.divider} />
          </>
        )}

        {renderInput()}
      </View>
    </>
  );
};

export default FieldPhoneNumberInput;

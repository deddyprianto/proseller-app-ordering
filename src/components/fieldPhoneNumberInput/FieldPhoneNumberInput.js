import React, {useEffect, useState} from 'react';

import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';

import CountryPicker from '../react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';
import GlobalText from '../globalText';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../helper/Layout';

import CountryCodeSelectorModal from './Components/CountryCodeSelectorModal';

import ArrowUpSvg from '../../assets/svg/ArrowUpSvg';
import ArrowBottomSvg from '../../assets/svg/ArrowBottomSvg';
import {useSelector} from 'react-redux';
import ErrorInput from '../../assets/svg/ErorInputSvg';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: isError => ({
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: isError ? 2 : 1,
      borderRadius: 8,
      marginBottom: 12,

      paddingVertical: normalizeLayoutSizeHeight(1),
      paddingHorizontal: 16,
      borderColor: isError
        ? theme.colors.semanticColorError
        : theme.colors.border1,
      backgroundColor: theme.colors.background,
    }),
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
    viewCountryCodeSelector: {},
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
      height: normalizeLayoutSizeHeight(46),
      marginTop: 1,
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
      marginBottom: 4,
    },
    withoutFlagContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: normalizeLayoutSizeWidth(46),
    },
    arrowBottomContainer: {
      marginRight: 16,
      marginBottom: 3,
    },
    errorText: {
      paddingHorizontal: 16,
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.semanticColorError,
    },
    coutryCodeText: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsRegular,
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
  rootStyle,
  isError,
  errorMessage,
}) => {
  const styles = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [countryCode, setCountryCode] = useState('+65');
  const [countryCodeModal, setCountryCodeModal] = useState(false);

  const countryCodeList = useSelector(
    state => state.settingReducer.dialCodeSettings,
  );

  useEffect(() => {
    if (valueCountryCode) {
      setCountryCode(valueCountryCode);
    } else if (countryCodeList?.length === 1) {
      setCountryCode(countryCodeList[0]?.dialCode);
    } else {
      setCountryCode(awsConfig.phoneNumberCode);
    }
  }, [valueCountryCode, countryCodeList]);

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
    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    return <GlobalText style={styles.textLabel}>{label}</GlobalText>;
  };

  const renderArrow = () => {
    if (countryCodeList?.length <= 1) {
      return;
    } else if (countryCodeModal) {
      return <ArrowUpSvg />;
    } else {
      return <ArrowBottomSvg />;
    }
  };

  const renderValueLeftSide = () => {
    if (withoutFlag) {
      return (
        <TouchableOpacity
          disabled={countryCodeList?.length <= 1}
          onPress={() => {
            setCountryCodeModal(!countryCodeModal);
          }}
          style={styles.withoutFlagContainer}>
          <GlobalText style={styles.coutryCodeText}>{countryCode}</GlobalText>
          <View style={styles.arrowBottomContainer}>{renderArrow()}</View>
        </TouchableOpacity>
      );
    } else {
      return (
        <GlobalText style={styles.textCountryCode}>{countryCode}</GlobalText>
      );
    }
  };

  const renderValue = () => {
    const phoneNumber = value.replace(countryCode, '');

    return (
      <View style={styles.viewCountryCodeAndPhoneNumber}>
        {renderValueLeftSide()}
        <TextInput
          keyboardType={'numeric'}
          style={styles.textInputPhoneNumber}
          textAlignVertical="center"
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
        {withoutFlag ? null : renderLabel()}
        {renderValue()}
      </View>
    );
  };

  const renderInputLabel = () => {
    if (inputLabel) {
      return (
        <GlobalText style={styles.labelText}>
          {inputLabel}{' '}
          {isMandatory ? (
            <GlobalText style={styles.mandatoryStyle}>*</GlobalText>
          ) : null}{' '}
        </GlobalText>
      );
    }
  };

  const renderCountryCodeSelector = () => {
    if (countryCodeModal) {
      return (
        <View style={styles.CountryCodeSelectorModal}>
          <CountryCodeSelectorModal
            value={countryCode}
            onChange={value => {
              setCountryCode(value);
              setCountryCodeModal(false);
            }}
          />
        </View>
      );
    }
  };

  const renderFlag = () => {
    if (!withoutFlag) {
      return (
        <>
          <PhoneInput
            style={styles.viewFlag}
            flagStyle={styles.viewFlag}
            onPressFlag={() => {
              setOpenModal(true);
            }}
            value={countryCode}
          />
          <View style={styles.divider} />
        </>
      );
    }
  };
  return (
    <>
      {renderInputLabel()}
      <View style={[styles.root(isError), rootStyle]}>
        {renderModalCountryPicker()}
        {renderFlag()}
        {renderInput()}
        {isError ? <ErrorInput /> : null}
      </View>
      {isError ? (
        <GlobalText style={styles.errorText}>{errorMessage} </GlobalText>
      ) : null}
      {renderCountryCodeSelector()}
    </>
  );
};

export default FieldPhoneNumberInput;

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import awsConfig from '../config/awsConfig';

import {Body, Header} from '../components/layout';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import {createNewUser} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';
import LoadingScreen from '../components/loadingScreen';
import Theme from '../theme';
import {getMandatoryFields} from '../actions/account.action';
import appConfig from '../config/appConfig';
import HeaderV2 from '../components/layout/header/HeaderV2';
import GlobalText from '../components/globalText';
import GlobalInputText from '../components/globalInputText';
import CalendarSvg from '../assets/svg/CalendareSvg';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {fieldValidation} from '../helper/Validation';
import useValidation from '../hooks/validation/useValidation';
import {debounce} from 'lodash';
import {checkReferralCodeAction} from '../actions/user.action';
import useSettings from '../hooks/settings/useSettings';
import {navigate} from '../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      paddingHorizontal: 16,
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
      marginTop: 32,
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
      width: '100%',
      marginTop: 0,
    },
    completeTextStyle: {
      marginBottom: 48,
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 14,
    },
    dropDownStyle: {
      backgroundColor: '#fafafa',
      zIndex: 3,
    },
    containerStyle: {
      paddingBottom: 30,
    },
    divider: {
      height: 1,
      backgroundColor: '#D6D6D6',
      marginVertical: 16,
    },
    messageStyleBtm: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    primaryText: {
      color: theme.colors.primary,
    },
    emailContainer: {
      marginTop: 0,
    },
    phoneContainer: {
      marginTop: 16,
    },
    messageText: {
      color: '#438E49',
    },
    spaceGender: {
      height: 80,
      zIndex: -1,
    },
    noMb: {
      marginBottom: 0,
    },
  });
  return styles;
};

const RegisterForm = ({
  registerMethod,
  inputValue,
  approvedData,
  registerPayload,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {findReferralCodeSetting} = useValidation();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthdate] = React.useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
  const [referralCode, setReferraCode] = React.useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = React.useState([]);
  const [gender, setGender] = React.useState(null);
  const [isInitField, setIsInitField] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [invalidReferral, setInvalidReferral] = React.useState(false);
  const [referralFrom, setReferralFrom] = React.useState(null);
  const [isLoadingCheckReferral, setIsLoadingCheckReferral] = React.useState(
    false,
  );
  const {checkMinimumAge} = useSettings();
  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );

  const [openGender, setOpenGender] = React.useState(false);
  const genderItems = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
  ];

  const monthItems = [
    {label: 'January', value: '2000-01-01'},
    {label: 'February', value: '2000-02-01'},
    {label: 'March', value: '2000-03-01'},
    {label: 'April', value: '2000-04-01'},
    {label: 'May', value: '2000-05-01'},
    {label: 'June', value: '2000-06-01'},
    {label: 'July', value: '2000-07-01'},
    {label: 'August', value: '2000-08-01'},
    {label: 'September', value: '2000-09-01'},
    {label: 'October', value: '2000-10-01'},
    {label: 'November', value: '2000-11-01'},
    {label: 'December', value: '2000-12-01'},
  ];
  const priority_key_mandatory = 'SetLowerPriorityAsMandatory';
  useEffect(() => {
    if (registerMethod === 'email') {
      setEmail(inputValue);
    } else {
      setPhoneNumber(inputValue);
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [inputValue, registerMethod]);

  const handleRegister = async () => {
    let phone =
      registerMethod === 'email' ? countryCode + phoneNumber : inputValue;
    const methodValue = registerMethod === 'email' ? email : phone;
    let customField = {
      birthDate,
      gender,
      address,
    };
    let newCustomKey = {};
    Object.keys(customField).forEach(key => {
      if (!customField[key] || customField[key] === '') {
        return;
      }
      newCustomKey = {...newCustomKey, [key]: customField[key]};
    });
    if (phoneNumber.length <= 0) {
      phone = null;
    }
    let payload = {
      name: name,
      password: 'P@ssw0rd123',
      username: phone,
      email: email,
      phoneNumber: phone,
      registerMethod,
      optIn: approvedData.consent,
      acceptPrivacyAndTerms: approvedData.privacyTerm,
    };
    payload = {...payload, ...newCustomKey};
    if (referralCode.length > 0) {
      payload.referralCode = referralCode;
    }
    setIsLoading(true);
    const response = await dispatch(createNewUser(payload));
    if (typeof response === 'boolean' && response) {
      setIsLoading(false);
      navigate('otp', {
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

  const getSettingField = async () => {
    setIsInitField(true);
    const response = await dispatch(getMandatoryFields());
    const onlyShowField = response?.filter(
      field => field.signUpField && field.show === true,
    );
    setActiveField(onlyShowField);
    setIsInitField(false);
  };

  React.useEffect(() => {
    getSettingField();
  }, []);

  const renderTextHeader = () => {
    const title =
      registerMethod === 'email' ? 'Personal Details' : 'Personal Details';

    return (
      <>
        <GlobalText style={styles.textHeader}>{title}</GlobalText>
        <GlobalText style={styles.completeTextStyle}>
          Complete the following fields
        </GlobalText>
      </>
    );
  };

  const renderNameInput = () => {
    return (
      <GlobalInputText
        label="Name"
        value={name}
        isMandatory
        placeholder="Enter Your Name"
        onChangeText={value => {
          setName(value);
        }}
      />
    );
  };

  const renderPhoneNumberRegisterInput = () => {
    return (
      <View style={styles.phoneContainer}>
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
          inputLabel={'Mobile Phone'}
          isMandatory={checkLowerPriorityMandatory()}
          withoutFlag={true}
          rootStyle={styles.noMb}
        />
      </View>
    );
  };

  const renderEmailRegisterInput = () => {
    return (
      <GlobalInputText
        label="Email"
        placeholder="Email"
        value={email}
        isMandatory={checkLowerPriorityMandatory()}
        // containerInputStyle={styles.emailContainer}
        onChangeText={value => {
          setEmail(value);
        }}
      />
    );
  };

  const toggleDatePicker = () =>
    setIsDatePickerVisible(prevState => !prevState);

  const onSetgender = item => setGender(item.value);

  const changeAddress = addressValue => setAddress(addressValue);
  const openGendet = () => setOpenGender(true);
  const closeGender = () => setOpenGender(false);
  const renderCustomField = () => {
    const component = activeField.map(field => {
      if (field.fieldName === 'birthDate') {
        if (field?.format === 'dd-MM-yyyy') {
          return (
            <GlobalInputText
              isMandatory={field?.mandatory}
              label="Birthdate"
              type="button"
              onPressBtn={toggleDatePicker}
              rightIcon={<CalendarSvg />}
              value={
                birthDate
                  ? moment(handleDate()).format('DD-MMM-YYYY')
                  : 'Select birthdate'
              }
            />
          );
        }
        return (
          <GlobalInputText
            isMandatory={field?.mandatory}
            label="Birthdate"
            type="dropdown"
            items={monthItems}
            defaultValue={null}
            onChangeItem={date => handleConfirm(date.value, true)}
            placeholder="Birthmonth"
          />
        );
      }
      if (field.fieldName === 'gender') {
        return (
          <>
            <GlobalInputText
              placeholder={'Select gender'}
              items={genderItems}
              defaultValue={gender}
              onChangeItem={onSetgender}
              type="dropdown"
              label="Gender"
              isMandatory={field?.mandatory}
              onOpen={openGendet}
              onClose={closeGender}
            />
            {openGender ? <View style={styles.spaceGender} /> : null}
          </>
        );
      }
      if (field.fieldName === 'address') {
        return (
          <GlobalInputText
            placeholder={'Address'}
            value={address}
            onChangeText={changeAddress}
            label="Address"
            isMandatory={field?.mandatory}
          />
        );
      }
    });
    return component;
  };
  const renderEmailOrPhoneInput = () => {
    const renderInput =
      registerMethod === 'email'
        ? renderPhoneNumberRegisterInput()
        : renderEmailRegisterInput();

    return <View style={styles.viewMethodInput}>{renderInput}</View>;
  };

  const checkLowerPriorityMandatory = () => {
    const findPriority = orderSetting.find(
      data => data.settingKey === priority_key_mandatory,
    );
    return findPriority?.settingValue === true;
  };

  const handleMandatoryLowerPriority = isHaveEmptyField => {
    if (checkLowerPriorityMandatory()) {
      if (registerMethod === 'email') {
        return name && phoneNumber.length >= 6 && !isHaveEmptyField;
      } else {
        return name && email && !isHaveEmptyField;
      }
    }
    return name && !isHaveEmptyField;
  };

  const renderButtonNext = () => {
    let active = false;
    const requiredField = activeField
      .filter(field => field.mandatory)
      .map(data => data.fieldName);
    const customField = {
      gender,
      address,
      birthDate: birthDate,
      referralCode,
    };
    const isHaveEmptyField =
      fieldValidation(requiredField, customField).length > 0;
    active = handleMandatoryLowerPriority(isHaveEmptyField);

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleRegister();
        }}>
        <GlobalText style={styles.textNext}>Next</GlobalText>
      </TouchableOpacity>
    );
  };

  const getMaxDate = () => {
    try {
      let year = new Date().getFullYear() - 1;
      return new Date(`${year}-12-31`);
    } catch (e) {
      return new Date();
    }
  };

  const handleConfirm = (date, isMonth) => {
    if (!isMonth) {
      toggleDatePicker();
    }
    const newDate = moment(date).format('YYYY-MM-DD');
    setBirthdate(newDate);
  };

  const handleDate = () => {
    if (birthDate) {
      return new Date(moment(birthDate).format());
    }
    return new Date(moment().subtract(10, 'year'));
  };

  const minimumDate = () => {
    let years = 10;
    const {settingValue} = checkMinimumAge();
    if (settingValue) {
      years = Number(settingValue);
    }
    const minDate = moment()
      .subtract(years, 'years')
      .format();

    return new Date(minDate);
  };

  const memoDatePicker = React.useMemo(
    () => (
      <DatePicker
        modal
        mode={'date'}
        androidVariant={'iosClone'}
        maximumDate={minimumDate()}
        open={isDatePickerVisible}
        date={handleDate()}
        onConfirm={handleConfirm}
        onCancel={toggleDatePicker}
      />
    ),
    [isDatePickerVisible],
  );

  const renderMessage = () => {
    let method = registerMethod === 'email' ? 'email' : 'Mobile No';
    let value = registerMethod === 'email' ? email : phoneNumber;
    return (
      <View>
        <GlobalText style={styles.messageStyleBtm}>
          You will receive a 4-digit verification code via {method} at{' '}
          <GlobalText style={[styles.messageStyleBtm, styles.messageText]}>
            {value}{' '}
          </GlobalText>
        </GlobalText>
      </View>
    );
  };

  const changeTextReferralCode = text => {
    setReferraCode(text);
    setIsLoadingCheckReferral(true);
    checkReferralCode(text);
  };

  const checkReferralCode = debounce(async code => {
    const response = await dispatch(checkReferralCodeAction(code));
    if (!response.status) {
      setIsLoadingCheckReferral(false);
      return setInvalidReferral(true);
    }
    setInvalidReferral(false);
    setReferralFrom(response?.source);
    setIsLoadingCheckReferral(false);
  }, 500);

  const renderReferralCode = () => (
    <>
      {findReferralCodeSetting()?.signUpField ? (
        <View>
          <GlobalInputText
            placeholder="Enter your referral code"
            label="Referral Code"
            isMandatory={findReferralCodeSetting().mandatory}
            value={referralCode}
            onChangeText={changeTextReferralCode}
            isError={
              invalidReferral &&
              referralCode.length > 0 &&
              !isLoadingCheckReferral
            }
            errorMessage={'Invalid referral code'}
            isSuccess={
              !invalidReferral &&
              !isLoadingCheckReferral &&
              referralCode.length > 0
            }
            successMessage={`Referral code from ${referralFrom}`}
          />
        </View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading || isInitField} />
      {isInitField ? null : (
        <>
          {appConfig.appName === 'fareastflora' ? (
            <HeaderV2 />
          ) : (
            <Header isMiddleLogo />
          )}

          <Body style={{flex: 1}}>
            <KeyboardAwareScrollView>
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={styles.containerStyle}
                style={styles.container}>
                {renderTextHeader()}
                {renderNameInput()}
                {renderEmailOrPhoneInput()}
                {renderCustomField()}
                {renderReferralCode()}
                <View style={styles.divider} />
                {renderMessage()}
                {renderButtonNext()}
              </ScrollView>
              {memoDatePicker}
            </KeyboardAwareScrollView>
          </Body>
        </>
      )}
    </SafeAreaView>
  );
};

export default RegisterForm;

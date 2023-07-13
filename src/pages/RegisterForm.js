/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';
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
import FieldTextInput from '../components/fieldTextInput';
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
  });
  return styles;
};

const RegisterForm = ({registerMethod, inputValue}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthdate] = React.useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = React.useState([]);
  const [gender, setGender] = React.useState(null);
  const [isInitField, setIsInitField] = React.useState(false);
  const [address, setAddress] = React.useState('');

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
    let payload = {
      name: name,
      password: 'P@ssw0rd123',
      username: phone,
      email: email,
      phoneNumber: phone,
      registerMethod,
    };
    payload = {...payload, ...newCustomKey};
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
          isMandatory
          withoutFlag={true}
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
        isMandatory
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
              value={birthDate}
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
          <GlobalInputText
            placeholder={'Select gender'}
            items={genderItems}
            defaultValue={gender}
            onChangeItem={onSetgender}
            type="dropdown"
            label="Gender"
            isMandatory={field?.mandatory}
          />
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

  const renderButtonNext = () => {
    let active = false;
    const requiredField = activeField
      .filter(field => field.mandatory)
      .map(data => data.fieldName);
    const customField = {
      gender,
      address,
      birthDate: birthDate,
    };
    const isHaveEmptyField =
      fieldValidation(requiredField, customField).length > 0;
    if (registerMethod === 'email') {
      active = name && phoneNumber.length >= 6 && !isHaveEmptyField;
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
    const newDate = moment(date).format('DD/MM/YYYY');
    setBirthdate(newDate);
  };

  const memoDatePicker = React.useMemo(
    () => (
      <DatePicker
        modal
        mode={'date'}
        androidVariant={'iosClone'}
        maximumDate={getMaxDate()}
        open={isDatePickerVisible}
        date={new Date(moment().subtract(10, 'year'))}
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
          You will receive 4-digit verification code via {method} at{' '}
          <GlobalText style={[styles.messageStyleBtm, styles.primaryText]}>
            {value}{' '}
          </GlobalText>
        </GlobalText>
      </View>
    );
  };

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

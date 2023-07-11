import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import awsConfig from '../config/awsConfig';

import {Header} from '../components/layout';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {useDispatch, useSelector} from 'react-redux';
import {checkAccountExist} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';
import LoadingScreen from '../components/loadingScreen';
import Theme from '../theme';
import HeaderV2 from '../components/layout/header/HeaderV2';
import RegisterV2 from './RegisterV2';
import appConfig from '../config/appConfig';
import GlobalText from '../components/globalText';

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
    textCreateNewAccount: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNext: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textChangeMethod: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textLogin: {
      marginTop: 8,
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewChangeMethod: {
      marginTop: 48,
    },
    viewMethodInput: {
      marginTop: 48,
      width: '100%',
    },
    touchableNext: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    touchableNextDisabled: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
  });
  return styles;
};

const Register = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registerMethod, setRegisterMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [approvedData, setApprovedData] = React.useState({
    privacyTerm: false,
    consent: false,
  });
  const loginSettings = useSelector(
    state => state.settingReducer.loginSettings,
  );

  const onTickCheckbox = (key, value) => {
    console.log(key, value, 'lupis');
    setApprovedData({...approvedData, [key]: value});
  };

  useEffect(() => {
    if (loginSettings.loginByEmail) {
      setRegisterMethod('email');
    } else {
      setRegisterMethod('phoneNumber');
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [loginSettings]);

  const handleCheckAccount = async () => {
    let payload = {};
    let value = '';

    if (registerMethod === 'email') {
      payload.email = email;
      value = email;
    } else {
      payload.phoneNumber = countryCode + phoneNumber;
      value = countryCode + phoneNumber;
    }

    setIsLoading(true);
    const response = await dispatch(checkAccountExist(payload));

    if (response?.status || !response?.isValid) {
      const existMessage =
        registerMethod === 'email'
          ? 'Email already exist'
          : 'Mobile Number already exist';

      const message = response?.message || existMessage;

      dispatch(
        showSnackbar({
          message,
        }),
      );
    } else {
      Actions.registerForm({registerMethod, inputValue: value});
    }

    setIsLoading(false);
  };

  const renderTextLogin = () => {
    const text =
      registerMethod === 'email'
        ? 'Enter your email to create new account'
        : 'Enter your mobile number to create new account';

    return <Text style={styles.textLogin}>{text}</Text>;
  };

  const renderPhoneNumberRegisterInput = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Enter mobile number to begin :"
        value={phoneNumber}
        placeholder="Mobile Number"
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
        label="Enter email to begin :"
        placeholder="Enter email to begin"
        value={email}
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderRegisterMethodInput = () => {
    const renderInput =
      registerMethod === 'email'
        ? renderEmailRegisterInput()
        : renderPhoneNumberRegisterInput();

    return <View style={styles.viewMethodInput}>{renderInput}</View>;
  };

  const renderButtonNext = () => {
    const active = phoneNumber.length >= 6 || email;

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleCheckAccount();
        }}>
        <GlobalText style={styles.textNext}>Next</GlobalText>
      </TouchableOpacity>
    );
  };

  const handleChangeRegisterMethod = () => {
    setEmail('');
    setPhoneNumber('');
    if (registerMethod === 'email') {
      setRegisterMethod('phoneNumber');
    } else {
      setRegisterMethod('email');
    }
  };

  const renderTextChangeMethod = () => {
    const {loginByMobile, loginByEmail} = loginSettings;
    if (loginByEmail && loginByMobile) {
      const text =
        registerMethod === 'email'
          ? 'Use Mobile Number to Create Account'
          : 'Use Email Address to Create Account';

      return (
        <TouchableOpacity
          style={styles.viewChangeMethod}
          onPress={() => {
            handleChangeRegisterMethod();
          }}>
          <GlobalText style={styles.textChangeMethod}>{text}</GlobalText>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {appConfig.appName === 'fareastflora' ? (
        <HeaderV2 />
      ) : (
        <Header isMiddleLogo />
      )}

      <KeyboardAwareScrollView>
        {appConfig.appName === 'fareastflora' ? (
          <RegisterV2
            emailValue={email}
            onChangeEmail={value => setEmail(value)}
            onNext={handleCheckAccount}
            onTickCheckbox={onTickCheckbox}
            checkboxValue={approvedData}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.textCreateNewAccount}>
              Create a new account
            </Text>
            {renderTextLogin()}
            {renderRegisterMethodInput()}
            {renderButtonNext()}
            {renderTextChangeMethod()}
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;

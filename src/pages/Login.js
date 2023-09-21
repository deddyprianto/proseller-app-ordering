/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import awsConfig from '../config/awsConfig';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import LoadingScreen from '../components/loadingScreen';
import {Body} from '../components/layout';
import {checkAccountExist, sendOTP} from '../actions/auth.actions';
import Theme from '../theme';
import HeaderV2 from '../components/layout/header/HeaderV2';
import appConfig from '../config/appConfig';
import GlobalInputText from '../components/globalInputText';
import useSettings from '../hooks/settings/useSettings';
import GlobalModal from '../components/modal/GlobalModal';
import GlobalButton from '../components/button/GlobalButton';
import GlobalText from '../components/globalText';
import additionalSetting from '../config/additionalSettings';
import {emailValidation} from '../helper/Validation';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 16,
    },
    textHeader: {
      marginTop: 32,
      color: theme.colors.primary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textInformation: {
      marginTop: 16,
      width: '100%',
      textAlign: 'center',
      color: theme.colors.greyScale5,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textNext: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textLoginMethodActive: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLoginMethodInactive: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLogin: {
      marginTop: 8,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    touchableNext: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },

    touchableNextDisabled: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },

    viewLoginMethodSelector: {
      marginTop: 40,
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 46,
      borderRadius: 8,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 6,
      backgroundColor: theme.colors.forthColor,
    },

    viewLoginMethodActive: {
      flex: 1,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      backgroundColor: theme.colors.background,
    },

    viewLoginMethodInactive: {
      flex: 1,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.forthColor,
    },
    viewMethodInput: {
      width: '100%',
    },
    phoneContainer: {
      marginTop: 16,
    },
    noMb: {
      marginBottom: 0,
    },
    privacyText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      width: '100%',
      textAlign: 'center',
      marginTop: 16,
      fontSize: 14,
    },
    linkText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.brandTertiary,
    },
    blackText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      color: 'black',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.greyScale5,
    },
    mt40: {
      marginTop: 40,
    },
    registerText: {
      marginTop: 24,
      textAlign: 'center',
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 16,
    },
    mt8: {
      marginTop: 8,
    },
  });
  return styles;
};

const Login = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');
  const {checkTncPolicyData} = useSettings();
  const [openType, setOpenType] = React.useState(null);
  const [buttonActive, setButtonActive] = React.useState(false);
  const [errorLogin, setErrorLogin] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(null);
  const [errorPhone, setErrorPhone] = React.useState(null);
  const loginSettings = useSelector(
    state => state.settingReducer.loginSettings,
  );
  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );
  const login_priority_key = 'LoginPriority';
  const isEmail = 'EMAIL';
  const checkDefaultLogin = () => {
    const findDefaultLogin = orderSetting?.find(
      data => data?.settingKey === login_priority_key,
    );
    if (findDefaultLogin) return findDefaultLogin;
    return {};
  };
  useEffect(() => {
    if (loginSettings.loginByEmail && loginSettings.loginByMobile) {
      if (checkDefaultLogin()?.settingValue === isEmail) {
        setLoginMethod('email');
      } else {
        setLoginMethod('phoneNumber');
      }
    } else if (loginSettings.loginByEmail) {
      setLoginMethod('email');
    } else {
      setLoginMethod('phoneNumber');
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [loginSettings]);

  const handleRequestOtp = async () => {
    const isEmail = loginMethod === 'email';
    const methodValue = isEmail ? email : countryCode + phoneNumber;
    let payload = {};
    if (isEmail) {
      const isValidEmail = emailValidation(email);
      payload.email = email;
      if (!isValidEmail) {
        setErrorLogin(true);
        return setErrorEmail('Email is invalid. Please try again.');
      }
    } else {
      payload.phoneNumber = countryCode + phoneNumber;
      if (phoneNumber.length < 8 || phoneNumber.length > 12) {
        setErrorLogin(true);
        return setErrorPhone('Mobile phone is invalid. Please try again');
      }
    }
    setIsLoading(true);
    const response = await dispatch(checkAccountExist(payload));
    if (response?.status) {
      setErrorLogin(false);
      await dispatch(sendOTP(payload));
      Actions.otp({
        isLogin: true,
        method: loginMethod,
        methodValue: methodValue,
      });
    } else {
      setErrorEmail(
        'Sorry, no account found with this email. Try to enter another.',
      );
      setErrorPhone(
        'Sorry, no account found with this mobile phone. Try to enter another.',
      );
      setErrorLogin(true);
    }
    setIsLoading(false);
  };

  const handleChangeLoginMethod = value => {
    setErrorLogin(false);
    setLoginMethod(value);
    setEmail(null);
    setErrorPhone(null);
    setEmail('');
    setPhoneNumber('');
  };

  const renderLoginMethod = value => {
    const isActive = value === loginMethod;
    const isEmail = value === 'email';

    const text = isEmail ? 'Use Email' : 'Use Mobile Phone';

    const style = isActive
      ? styles.viewLoginMethodActive
      : styles.viewLoginMethodInactive;

    const textStyle = isActive
      ? styles.textLoginMethodActive
      : styles.textLoginMethodInactive;

    return (
      <TouchableOpacity
        onPress={() => {
          handleChangeLoginMethod(value);
        }}
        style={style}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderChangeLoginMethod = () => {
    const {loginByMobile, loginByEmail} = loginSettings;

    if (loginByEmail && loginByMobile) {
      return (
        <View style={styles.viewLoginMethodSelector}>
          {renderLoginMethod('email')}
          {renderLoginMethod('phoneNumber')}
        </View>
      );
    }
  };

  const renderTextLogin = () => {
    const text = 'Welcome back, you’ve been missed!';
    return <Text style={styles.textLogin}>{text}</Text>;
  };

  const renderPhoneNumberLoginInput = () => {
    return (
      <View style={styles.phoneContainer}>
        <FieldPhoneNumberInput
          inputLabel={'Mobile Phone'}
          isMandatory={true}
          type="phone"
          label="Enter mobile number to begin :"
          value={phoneNumber}
          placeholder="Enter your mobile phone"
          onChangeCountryCode={value => {
            setCountryCode(value);
          }}
          rootStyle={styles.noMb}
          withoutFlag
          isError={errorLogin}
          errorMessage={errorPhone}
          onChange={value => {
            setPhoneNumber(value);
          }}
        />
      </View>
    );
  };

  const handleChangeText = value => {
    if (value.length === 0) setErrorLogin(false);
    setEmail(value);
  };

  const renderEmailLoginInput = () => {
    return (
      <GlobalInputText
        isError={errorLogin}
        label="Email"
        isMandatory
        placeholder="Enter your email"
        value={email}
        errorMessage={errorEmail}
        onChangeText={handleChangeText}
      />
    );
  };

  const renderLoginMethodInput = () => {
    const renderInput =
      loginMethod === 'email'
        ? renderEmailLoginInput()
        : renderPhoneNumberLoginInput();

    return (
      <View style={[styles.viewMethodInput, styles.mt8]}>{renderInput}</View>
    );
  };

  const renderButtonNext = () => {
    const active = email || phoneNumber;

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleRequestOtp();
        }}>
        <Text style={styles.textNext}>Request OTP</Text>
      </TouchableOpacity>
    );
  };

  const renderTextInformation = () => {
    const text = loginMethod === 'email' ? 'email' : 'mobile number';
    return (
      <Text style={styles.textInformation}>
        4 digits OTP will be sent to your {text}
      </Text>
    );
  };

  const closeModal = () => {
    setButtonActive(false);
    setOpenType(null);
  };

  const onButtonActive = active => {
    setButtonActive(active);
  };

  const handleOpenTypePolicy = type => {
    setOpenType(type);
  };

  const renderPolicy = () => {
    if (checkTncPolicyData().tnc || checkTncPolicyData().privacy) {
      return (
        <GlobalText style={styles.privacyText}>
          By logging in, you agree to the{' '}
          {checkTncPolicyData().tnc ? (
            <GlobalText
              onPress={() => handleOpenTypePolicy('terms')}
              style={styles.linkText}>
              Terms and Conditions
            </GlobalText>
          ) : (
            ''
          )}{' '}
          {checkTncPolicyData().privacy ? (
            <GlobalText
              onPress={() => handleOpenTypePolicy('privacy')}
              style={styles.linkText}>
              <GlobalText style={styles.blackText}>and</GlobalText> Privacy
              Policy
            </GlobalText>
          ) : (
            ''
          )}{' '}
          of {additionalSetting().applicationName}.
        </GlobalText>
      );
    }
    return null;
  };

  const goToRegisterPage = () => {
    Actions.register();
  };

  const renderRegisterText = () => (
    <View>
      <GlobalText style={styles.registerText}>
        Don’t have an account?{' '}
        <GlobalText onPress={goToRegisterPage} style={styles.linkText}>
          Register
        </GlobalText>
      </GlobalText>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <HeaderV2 isCenterLogo={appConfig.appName !== 'fareastflora'} />
      <Body style={styles.root}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Login</Text>
            {renderTextLogin()}
            {renderChangeLoginMethod()}
            {renderLoginMethodInput()}
            {renderButtonNext()}
            {renderTextInformation()}
            {renderPolicy()}
            <View style={[styles.divider, styles.mt40]} />
            {renderRegisterText()}
          </View>
        </KeyboardAwareScrollView>
      </Body>
      <GlobalModal
        title="Terms and Conditions"
        closeModal={closeModal}
        isCloseToBottom={onButtonActive}
        titleStyle={styles.titleModal}
        stickyBottom={
          <View>
            <GlobalButton
              disabled={!buttonActive}
              onPress={closeModal}
              title="Understood"
            />
          </View>
        }
        isVisible={openType === 'terms'}>
        <GlobalText>{checkTncPolicyData().tnc?.settingValue}</GlobalText>
      </GlobalModal>
      <GlobalModal
        title="Privacy Policy"
        titleStyle={styles.titleModal}
        stickyBottom={
          <View>
            <GlobalButton
              disabled={!buttonActive}
              onPress={closeModal}
              title="Understood"
            />
          </View>
        }
        isCloseToBottom={onButtonActive}
        closeModal={closeModal}
        isVisible={openType === 'privacy'}>
        <GlobalText>{checkTncPolicyData().privacy?.settingValue}</GlobalText>
      </GlobalModal>
    </SafeAreaView>
  );
};

export default Login;

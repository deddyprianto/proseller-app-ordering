import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import awsConfig from '../config/awsConfig';

import {Header} from '../components/layout';
import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import {createNewUser} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';

import LoadingScreen from '../components/loadingScreen';
import ButtonCheckbox from '../components/buttonCheckbox';
import TermsAndConditionsModal from '../components/modal/TermsAndConditionsModal';

import Theme from '../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    footer: {
      padding: 16,
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      backgroundColor: theme.colors.background,
    },
    textHeader: {
      marginVertical: 4,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRegisterFor: {
      marginBottom: 32,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNext: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textFooter: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textFooterBold: {
      textDecorationLine: 'underline',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textReferralFrom: {
      fontStyle: 'italic',
      color: theme.colors.semanticSuccess,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewReferralInput: {
      width: '100%',
    },
    viewNext: {
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    viewNextDisabled: {
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
    viewMethodInput: {
      marginVertical: 32,
      width: '100%',
    },
    viewCheckboxAndText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
  });
  return styles;
};

const RegisterForm = ({registerMethod, inputValue}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [referralCode, setReferralCode] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [isAgree, setIsAgree] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const referralCodeReceived = useSelector(
    state => state.settingReducer.referralCode,
  );

  useEffect(() => {
    if (registerMethod === 'email') {
      setEmail(inputValue);
    } else {
      setPhoneNumber(inputValue);
    }

    setCountryCode(awsConfig.phoneNumberCode);
  }, [inputValue, registerMethod]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleReferralCodeReceived = code => {
    const removePrefix = code.replace(`${awsConfig.APP_DEEP_LINK}/`, '');
    const result = removePrefix.split('/')[1];
    return result;
  };

  const handleRegister = async () => {
    const phone =
      registerMethod === 'email' ? countryCode + phoneNumber : inputValue;
    const methodValue = registerMethod === 'email' ? email : phone;

    const payload = {
      name: name,
      password: 'P@ssw0rd123',
      username: phone,
      email: email,
      phoneNumber: phone,
    };
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

  const renderTextHeader = () => {
    const title =
      registerMethod === 'email' ? 'Email Register' : 'Mobile Register';

    return <Text style={styles.textHeader}>{title}</Text>;
  };

  const renderRegisterFor = () => {
    return (
      <Text style={styles.textRegisterFor}>Register for {inputValue}</Text>
    );
  };

  const renderNameInput = () => {
    return (
      <FieldTextInput
        label="Full Name"
        value={name}
        placeholder="Full Name"
        onChange={value => {
          setName(value);
        }}
      />
    );
  };

  const renderPhoneNumberRegisterInput = () => {
    return (
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
      />
    );
  };
  const renderTextReferralFrom = () => {
    if (referralCodeReceived) {
      return (
        <Text style={styles.textReferralFrom}>Referral Code from Jon Doe</Text>
      );
    }
  };

  const renderReferralInput = () => {
    const a = handleReferralCodeReceived(referralCodeReceived);
    const code = a || referralCode;

    return (
      <View style={styles.viewReferralInput}>
        <FieldTextInput
          disabled={referralCodeReceived}
          value={code}
          placeholder="Referral Code"
          onChange={value => {
            setReferralCode(value);
          }}
        />
        {renderTextReferralFrom()}
      </View>
    );
  };

  const renderEmailRegisterInput = () => {
    return (
      <FieldTextInput
        label="Email"
        value={email}
        placeholder="Email"
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderEmailOrPhoneInput = () => {
    const renderInput =
      registerMethod === 'email'
        ? renderPhoneNumberRegisterInput()
        : renderEmailRegisterInput();

    return <View style={styles.viewMethodInput}>{renderInput}</View>;
  };

  const renderCheckboxAndText = () => {
    return (
      <View style={styles.viewCheckboxAndText}>
        <ButtonCheckbox
          active={isAgree}
          onPress={() => {
            setIsAgree(!isAgree);
          }}
        />
        <Text style={styles.textFooter}>
          By checking this box, you agree to the{' '}
          <Text
            style={styles.textFooterBold}
            onPress={() => {
              handleOpenModal();
            }}>
            Terms and Conditions
          </Text>
        </Text>
      </View>
    );
  };

  const renderButtonNext = () => {
    let active = false;

    if (registerMethod === 'email') {
      active = name && phoneNumber.length >= 6 && isAgree;
    } else {
      active = name && email && isAgree;
    }

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.viewNext : styles.viewNextDisabled}
        onPress={() => {
          handleRegister();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.body}>
          {renderTextHeader()}
          {renderRegisterFor()}
          {renderNameInput()}
          {renderEmailOrPhoneInput()}
          {renderReferralInput()}
        </View>
      </KeyboardAwareScrollView>
    );
  };

  const renderFooter = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.footer}>
          {renderCheckboxAndText()}
          {renderButtonNext()}
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderTermsAndConditionsModal = () => {
    return (
      <TermsAndConditionsModal
        open={isOpenModal}
        handleClose={() => {
          handleCloseModal();
        }}
        onPress={() => {
          setIsAgree(true);
          handleCloseModal();
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header isMiddleLogo />
      {renderBody()}
      {renderFooter()}
      {renderTermsAndConditionsModal()}
    </SafeAreaView>
  );
};

export default RegisterForm;

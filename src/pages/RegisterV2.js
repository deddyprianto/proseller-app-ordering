import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from '../components/globalText';
import Theme from '../theme/Theme';
import GlobalInputText from '../components/globalInputText';
import {normalizeLayoutSizeHeight} from '../helper/Layout';
import CheckBox from '@react-native-community/checkbox';
import GlobalButton from '../components/button/GlobalButton';
import {TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import GlobalModal from '../components/modal/GlobalModal';
import {useSelector} from 'react-redux';
import {emailValidation} from '../helper/Validation';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput/FieldPhoneNumberInput';
import useSettings from '../hooks/settings/useSettings';
const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    registerContainer: {
      paddingHorizontal: 16,
      marginTop: 32,
    },
    registerText: {
      fontSize: 24,
      color: colors.primary,
      fontFamily: fontFamily.poppinsMedium,
    },
    startedStyle: {
      marginTop: 8,
    },
    inputContianer: {
      marginTop: normalizeLayoutSizeHeight(48),
    },
    checkBoxParent: {
      flex: 1,
    },
    checkBoxContainer: {
      flexDirection: 'row',
      marginTop: 16,
      flex: 1,
      width: '95%',
    },
    checkBoxStyle: {
      width: 24,
      height: 24,
    },
    boxContainer: {
      marginRight: 10,
    },
    clickableText: {
      color: colors.primary,
    },
    loginContainer: {
      marginTop: normalizeLayoutSizeHeight(48),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleModal: {
      fontSize: 18,
      fontFamily: fontFamily.poppinsMedium,
    },
    privacyText: {
      color: colors.brandTertiary,
    },
  });
  return {styles, colors, fontFamily};
};

/**
 * @typedef {Object} RegisterV2Props
 * @property {Function} onChangeEmail
 * @property {string} emailValue
 * @property {Object} approvedData
 * @property {Function} onNext
 * @property {Function} onTickCheckbox
 * @property {Object} checkboxValue
 * @property {string} phoneValue
 * @property {Function} onChangeCountryCode
 * @property {Function} onChangePhoneNumber
 * @property {Function} onChangeReferralCode
 * @property {String} referralCode
 */

/**
 * @param {RegisterV2Props} props
 */

const RegisterV2 = props => {
  const {styles, colors} = useStyles();
  const [openType, setOpenType] = React.useState(null);
  const [buttonActive, setButtonActive] = React.useState(false);
  const inputRef = React.useRef();
  const {checkTncPolicyData} = useSettings();

  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );
  const loginSettings = useSelector(
    state => state.settingReducer.loginSettings,
  );

  const [emailNotValid, setEmailNotValid] = React.useState(false);
  const openLoginPage = () => {
    Actions.login();
  };

  const priority_email = 'EMAIL';

  const handleOpenType = type => setOpenType(type);

  const closeModal = () => {
    setButtonActive(false);
    setOpenType(null);
  };

  React.useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);
  React.useEffect(() => {
    if (props.emailValue && typeof props.emailValue === 'string') {
      setEmailNotValid(!emailValidation(props.emailValue));
    }
  }, [props.emailValue]);

  const onButtonActive = active => {
    setButtonActive(active);
  };

  const onChangeValue = (key, value) => {
    if (props.onTickCheckbox) {
      props.onTickCheckbox(key, value);
    }
  };

  const renderPhoneInput = () => (
    <FieldPhoneNumberInput
      type="phone"
      label="Phone Number"
      value={props.phoneValue}
      placeholder="Phone Number"
      onChangeCountryCode={props.onChangeCountryCode}
      onChange={props.onChangePhoneNumber}
      inputLabel={'Mobile Phone'}
      isMandatory
      withoutFlag={true}
    />
  );

  const renderEmailInput = () => (
    <GlobalInputText
      placeholder="Enter your email"
      label="Email"
      isMandatory
      onChangeText={props.onChangeEmail}
      isError={emailNotValid && props.emailValue.length > 0}
      errorMessage="Please enter a valid email address."
      ref={inputRef}
    />
  );

  const emailSettingOn = () => {
    return loginSettings?.loginByEmail === true;
  };

  const phoneSettingOn = () => {
    return loginSettings?.loginByMobile === true;
  };

  const checkRegisterPriority = () => {
    const registerPriority = orderSetting.find(
      setting => setting?.settingKey === 'RegisterPriority',
    );
    if (registerPriority) {
      return registerPriority;
    }
    return {};
  };

  const handleCheckDefaultLogin = () => {
    if (phoneSettingOn() && emailSettingOn()) {
      if (checkRegisterPriority()?.settingValue === priority_email) {
        return renderEmailInput();
      }
      return renderPhoneInput();
    }
    if (emailSettingOn() && !phoneSettingOn()) {
      return renderEmailInput();
    }
    if (!emailSettingOn() && phoneSettingOn()) {
      return renderPhoneInput();
    }
  };

  const handleDisableNextButton = () => {
    if (props?.checkboxValue.privacyTerm === false) {
      return true;
    }
    if (emailSettingOn() && phoneSettingOn() && props.phoneValue.length >= 6) {
      return false;
    }
    if (emailSettingOn() && props.emailValue.length > 1) {
      return false;
    }
    if (phoneSettingOn() && props.phoneValue.length >= 6) {
      return false;
    }
    return true;
  };

  return (
    <View style={styles.registerContainer}>
      <View>
        <GlobalText style={styles.registerText}>Register</GlobalText>
      </View>
      <View style={styles.startedStyle}>
        <GlobalText>Let’s get started!</GlobalText>
      </View>
      <View style={styles.inputContianer}>{handleCheckDefaultLogin()}</View>
      <View style={styles.checkBoxParent}>
        <View style={styles.checkBoxContainer}>
          <View style={styles.boxContainer}>
            <CheckBox
              style={styles.checkBoxStyle}
              lineWidth={1}
              boxType="square"
              onFillColor={colors.primary}
              onTintColor={colors.primary}
              onCheckColor={'white'}
              value={props.checkboxValue?.privacyTerm}
              onValueChange={value => onChangeValue('privacyTerm', value)}
            />
          </View>
          <GlobalText>
            I agree to all{' '}
            <GlobalText
              onPress={() => handleOpenType('terms')}
              style={styles.privacyText}>
              Terms and Conditions
            </GlobalText>{' '}
            and
            <GlobalText
              onPress={() => handleOpenType('privacy')}
              style={styles.privacyText}>
              {' '}
              Privacy Policy
            </GlobalText>
            .
          </GlobalText>
        </View>
        <View style={styles.checkBoxContainer}>
          <View style={styles.boxContainer}>
            <CheckBox
              style={styles.checkBoxStyle}
              lineWidth={1}
              boxType="square"
              onFillColor={colors.primary}
              onTintColor={colors.primary}
              onCheckColor={'white'}
              value={props.checkboxValue?.consent}
              onValueChange={newValue => onChangeValue('consent', newValue)}
            />
          </View>
          <GlobalText>
            I consent to Far East Flora and its service providers, sending me
            marketing information and materials of Far East Flora and its
            partners’ products, services and events.
          </GlobalText>
        </View>
        <View>
          <GlobalButton
            disabled={handleDisableNextButton()}
            onPress={props.onNext}
            title="Next"
          />
        </View>
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={openLoginPage}>
            <GlobalText>
              Already have an account?{' '}
              <GlobalText style={styles.privacyText}> Login</GlobalText>
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
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
    </View>
  );
};

export default RegisterV2;

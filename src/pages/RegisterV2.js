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
import Modal from 'react-native-modal';
import GlobalModal from '../components/modal/GlobalModal';
import {useSelector} from 'react-redux';
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
  });
  return {styles, colors, fontFamily};
};

/**
 * @typedef {Object} RegisterV2Props
 * @property {Function} onChangeEmail
 * @property {string} emailValue
 */

/**
 * @param {RegisterV2Props} props
 */

const RegisterV2 = props => {
  const {styles, colors} = useStyles();
  const [openType, setOpenType] = React.useState(null);
  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );
  const openLoginPage = () => {
    Actions.login();
  };
  console.log(orderSetting, 'nina');
  const handleOpenType = type => setOpenType(type);

  const closeModal = () => setOpenType(null);

  const filterTerms = () => {
    if (orderSetting && Array.isArray(orderSetting)) {
      const tnc = orderSetting.find(
        setting => setting.settingKey === 'TermCondition',
      );

      const privacy = orderSetting.find(
        setting => setting.settingKey === 'PrivacyPolicy',
      );
      return {tnc, privacy};
    }
    return {tnc: null, privacy: null};
  };

  return (
    <View style={styles.registerContainer}>
      <View>
        <GlobalText style={styles.registerText}>Register</GlobalText>
      </View>
      <View style={styles.startedStyle}>
        <GlobalText>Let’s get started!</GlobalText>
      </View>
      <View style={styles.inputContianer}>
        <GlobalInputText
          placeholder="Enter your email"
          label="Email"
          isMandatory
          onChangeText={props.onChangeEmail}
        />
      </View>
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
            />
          </View>
          <GlobalText>
            I agree to all{' '}
            <GlobalText
              onPress={() => handleOpenType('terms')}
              style={styles.clickableText}>
              Terms and Conditions
            </GlobalText>{' '}
            and
            <GlobalText
              onPress={() => handleOpenType('privacy')}
              style={styles.clickableText}>
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
            />
          </View>
          <GlobalText>
            I consent to Far East Flora and its service providers, sending me
            marketing information and materials of Far East Flora and its
            partners’ products, services and events.
          </GlobalText>
        </View>
        <View>
          <GlobalButton title="Next" />
        </View>
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={openLoginPage}>
            <GlobalText>
              Already have account?{' '}
              <GlobalText style={styles.clickableText}> Login</GlobalText>
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
      <GlobalModal
        title="Terms and Conditions"
        closeModal={closeModal}
        isVisible={openType === 'terms'}>
        <GlobalText>{filterTerms().tnc?.settingValue}</GlobalText>
      </GlobalModal>
      <GlobalModal
        title="Privacy Policy"
        closeModal={closeModal}
        isVisible={openType === 'privacy'}>
        <GlobalText>{filterTerms().privacy?.settingValue}</GlobalText>
      </GlobalModal>
    </View>
  );
};

export default RegisterV2;

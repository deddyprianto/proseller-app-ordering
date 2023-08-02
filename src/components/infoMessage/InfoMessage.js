import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Theme from '../../theme/Theme';
import CheckboxWhite from '../../assets/svg/CheckboxWhite';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';
import InfoSvg from '../../assets/svg/InfoSvg';
import GlobalText from '../globalText';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    infoContainer: {
      padding: 16,
      borderRadius: normalizeLayoutSizeWidth(16),
      height: normalizeLayoutSizeWidth(72),
    },
    successBg: {
      backgroundColor: colors.primary,
    },
    errorBg: {
      backgroundColor: colors.errorColor,
    },
    iconContainer: {
      marginRight: 8,
    },
    textStyle: {
      fontFamily: fontFamily.poppinsSemiBold,
      color: 'white',
      fontSize: 14,
    },
    actionButtonContainer: {
      borderWidth: 1,
      borderColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      height: normalizeLayoutSizeWidth(36),
      borderRadius: normalizeLayoutSizeWidth(8),
    },
    boxContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      width: '65%',
    },
    actionText: {
      fontFamily: fontFamily.poppinsMedium,
      color: 'white',
    },
  });

  return {styles, colors};
};

/**
 * @typedef {Object} InfoProps
 * @property {string} type
 * @property {string} message
 * @property {boolean} showActionButton
 * @property {string} actionBtnText
 * @property {Function} onActionBtnPress
 */

/**
 * @param {InfoProps} props
 */

const InfoMessage = props => {
  const {styles} = useStyles();

  const handleBgColor = () => {
    if (props.type === 'success') {
      return {
        bg: styles.successBg,
        icon: <CheckboxWhite />,
      };
    }
    return {
      bg: styles.errorBg,
      icon: <InfoSvg />,
    };
  };

  return (
    <View style={[styles.infoContainer, handleBgColor().bg]}>
      <View style={styles.boxContainer}>
        <View style={styles.iconContainer}>{handleBgColor().icon}</View>
        <View style={styles.textContainer}>
          <GlobalText style={styles.textStyle}>{props.message} </GlobalText>
        </View>
        {props.showActionButton ? (
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={props.onActionBtnPress}
              style={styles.actionButtonContainer}>
              <GlobalText style={styles.actionText}>
                {props.actionBtnText || 'Submit'}{' '}
              </GlobalText>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default InfoMessage;

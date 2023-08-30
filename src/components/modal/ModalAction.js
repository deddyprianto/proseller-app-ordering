import React from 'react';
import {StyleSheet, View} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalModal from './GlobalModal';
import GlobalText from '../globalText';
import GlobalButton from '../button/GlobalButton';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    titleContainer: {
      color: colors.primary,
    },
    textDesc: {
      textAlign: 'center',
      fontFamily: fontFamily.poppinsMedium,
    },
    divider: {
      height: 0.5,
      backgroundColor: colors.greyScale3,
      width: '100%',
      marginBottom: 16,
    },
    actionButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    buttonStyle: {
      width: '48%',
    },
    descContainer: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 16,
      borderTopColor: colors.greyScale3,
      borderBottomColor: colors.greyScale3,
    },
    scrollContainerStyle: {
      paddingBottom: 16,
    },
    pv16: {
      paddingVertical: 16,
    },
    r10: {
      right: 10,
    },
  });
  return {styles};
};

/**
 * @typedef {Object} ParamProps
 * @property {Function} closeModal
 * @property {Function} onCancel
 * @property {Function} onApprove
 * @property {string} title
 * @property {string} description
 * @property {import('react-native').StyleProp} scrollContainerStyle
 * @property {import('react-native').StyleProp} buttonActionStyle
 * @property {import('react-native').StyleProp} ModalContainerStyle
 * @property {boolean} hideCloseButton
 */

/**
 * @param {import('react-native-modal').ModalProps & ParamProps} props
 */

const ModalAction = props => {
  const {styles} = useStyles();
  return (
    <GlobalModal
      title={props.title}
      titleStyle={styles.titleContainer}
      closeModal={props.closeModal}
      modalContainerStyle={props.ModalContainerStyle}
      hideCloseIcon={props.hideCloseButton}
      scrollContainerStyle={[
        styles.scrollContainerStyle,
        props.scrollContainerStyle,
      ]}
      titleContainerStyle={styles.pv16}
      closeContainerStyle={styles.r10}
      {...props}>
      <View>
        <View style={styles.descContainer}>
          <GlobalText style={styles.textDesc}>{props.description}</GlobalText>
        </View>
        <View style={[styles.actionButtonContainer, props.buttonActionStyle]}>
          <View style={styles.buttonStyle}>
            <GlobalButton onPress={props.onCancel} isOutline title="Cancel" />
          </View>
          <View style={styles.buttonStyle}>
            <GlobalButton onPress={props.onApprove} title="Yes" />
          </View>
        </View>
      </View>
    </GlobalModal>
  );
};

export default ModalAction;

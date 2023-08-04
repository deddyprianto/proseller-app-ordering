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
      marginBottom: 16,
      fontFamily: fontFamily.poppinsMedium,
    },
    divider: {
      height: 1,
      backgroundColor: colors.greyScale3,
      width: '100%',
      marginBottom: 16,
    },
    actionButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonStyle: {
      width: '48%',
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
      scrollContainerStyle={props.scrollContainerStyle}
      {...props}>
      <View>
        <View style={styles.divider} />

        <GlobalText style={styles.textDesc}>{props.description}</GlobalText>
        <View style={styles.divider} />
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

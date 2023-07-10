import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';
import GlobalText from '../globalText';
import CloseSvg from '../../assets/svg/CloseSvg';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      padding: 8,
      minHeight: 200,
    },
    titleCloseContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    titleText: {
      fontSize: 18,
      fontFamily: fontFamily.poppinsMedium,
    },
    bodyContainer: {
      marginTop: 16,
    },
    closeContainer: {
      position: 'absolute',
      right: 0,
    },
    contentContainer: {
      paddingBottom: 30,
    },
  });
  return {styles, colors, fontFamily};
};

/**
 * @typedef {ModalProps} ModalProps
 */

/**
 * @typedef {Object} ParamProps
 * @property {Function} closeModal
 * @property {any} children
 * @property {string} title
 */

/**
 * @param {ModalProps & ParamProps} props
 */
const GlobalModal = props => {
  const {styles} = useStyles();
  return (
    <Modal useNativeDriver {...props}>
      <View style={styles.modalContainer}>
        <View style={styles.titleCloseContainer}>
          <View>
            <GlobalText>{props.title}</GlobalText>
          </View>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={props.closeModal}>
              <CloseSvg />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.bodyContainer}>{props.children}</View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default GlobalModal;

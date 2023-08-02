import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';
import GlobalText from '../globalText';
import CloseSvg from '../../assets/svg/CloseSvg';
import Theme from '../../theme/Theme';
import {normalizeLayoutSizeHeight} from '../../helper/Layout';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      padding: 8,
      minHeight: 200,
      maxHeight: normalizeLayoutSizeHeight(840),
      borderRadius: 8,
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
    bottomMOdal: {
      margin: 0,
      justifyContent: 'flex-end',
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
 * @property {any} stickyBottom
 * @property {Function} isCloseToBottom
 * @property {boolean} hideCloseIcon
 * @property {any} modalContainerStyle
 * @property {import('react-native').StyleProp} titleStyle
 * @property {boolean} isBottomModal
 * @property {import('react-native').StyleProp} scrollContainerStyle
 */

/**
 * @param {ModalProps & ParamProps} props
 */
const GlobalModal = props => {
  const {styles} = useStyles();
  const [, setIsReachBottom] = React.useState(false);

  const onScroll = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const paddingToBottom = 30;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      if (
        props.isCloseToBottom &&
        typeof props.isCloseToBottom === 'function'
      ) {
        props.isCloseToBottom(true);
      }
      setIsReachBottom(true);
    }
  };

  const handleStyle = () => {
    if (props.isBottomModal) {
      return [styles.bottomMOdal, props.style];
    }
    return props.style;
  };

  return (
    <Modal style={handleStyle()} useNativeDriver {...props}>
      <View style={[styles.modalContainer, props.modalContainerStyle]}>
        <View style={styles.titleCloseContainer}>
          <View>
            <GlobalText style={[styles.titleText, props.titleStyle]}>
              {props.title}
            </GlobalText>
          </View>
          {!props.hideCloseIcon ? (
            <View style={styles.closeContainer}>
              <TouchableOpacity onPress={props.closeModal}>
                <CloseSvg />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <ScrollView
          onScroll={onScroll}
          contentContainerStyle={[
            styles.contentContainer,
            props.scrollContainerStyle,
          ]}>
          <View style={styles.bodyContainer}>{props.children}</View>
        </ScrollView>
        {props.stickyBottom}
      </View>
    </Modal>
  );
};

export default GlobalModal;

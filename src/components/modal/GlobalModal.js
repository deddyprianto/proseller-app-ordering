import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import GlobalText from '../globalText';
import CloseSvg from '../../assets/svg/CloseSvg';
import Theme from '../../theme/Theme';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      padding: 8,
      minHeight: normalizeLayoutSizeWidth(200),
      borderRadius: 8,
      maxHeight: Dimensions.get('screen').height - 100,
    },
    titleCloseContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    titleText: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsSemiBold,
    },
    bodyContainer: {
      marginTop: 0,
    },
    closeContainer: {
      position: 'absolute',
      right: 8,
    },
    contentContainer: {
      paddingBottom: 30,
    },
    bottomMOdal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    titleDivider: {
      height: 1,
      width: '100%',
      backgroundColor: colors.greyScale3,
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
 * @property {import('react-native').StyleProp} titleContainerStyle
 * @property {import('react-native').StyleProp} closeContainerStyle
 * @property {boolean} enableDividerOnTitle
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
    <Modal style={handleStyle()} useNativeDriver={false} {...props}>
      <View style={[styles.modalContainer, props.modalContainerStyle]}>
        <View style={[styles.titleCloseContainer, props.titleContainerStyle]}>
          <View>
            <GlobalText style={[styles.titleText, props.titleStyle]}>
              {props.title}
            </GlobalText>
          </View>
          {!props.hideCloseIcon ? (
            <View style={[styles.closeContainer, props.closeContainerStyle]}>
              <TouchableOpacity onPress={props.closeModal}>
                <CloseSvg />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {props.enableDividerOnTitle ? (
          <View style={styles.titleDivider} />
        ) : null}
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

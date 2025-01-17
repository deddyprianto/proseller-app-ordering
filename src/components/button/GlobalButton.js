import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    touchableNext: isOutline => ({
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isOutline ? 'white' : colors.primary,
      borderColor: colors.primary,
      borderWidth: 1,
    }),
    touchableNextDisabled: isOutline => ({
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.buttonDisabled,
    }),
    textNext: isOutline => ({
      fontFamily: fontFamily.poppinsMedium,
      color: isOutline ? colors.primary : 'white',
      textAlign: 'center',
    }),
  });
  return {styles, colors, fontFamily};
};

/**
 * @typedef {import('react-native').TouchableOpacityProps} ButtonProps
 */

/**
 * @typedef {Object} ParamProps
 * @property {string} title
 * @property {string} active
 * @property {boolean} isOutline
 * @property {any} containerStyle
 * @property {any} children
 * @property {any} rightChildren
 * @property {import('react-native').StyleProp} buttonStyle
 */

/**
 * @param {ButtonProps & ParamProps} props
 */

const GlobalButton = props => {
  const {styles} = useStyles();
  return (
    <TouchableOpacity
      style={
        !props.disabled
          ? [styles.touchableNext(props.isOutline), props.buttonStyle]
          : [styles.touchableNextDisabled(props.isOutline), props.buttonStyle]
      }
      {...props}>
      {props.rightChildren ? props.rightChildren : null}
      {props.title ? (
        <GlobalText style={styles.textNext(props.isOutline)}>
          {props.title}{' '}
        </GlobalText>
      ) : null}

      {props.children}
    </TouchableOpacity>
  );
};

export default GlobalButton;

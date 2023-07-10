import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    touchableNext: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    touchableNextDisabled: {
      marginTop: 16,
      height: 40,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.buttonDisabled,
    },
    textNext: {
      fontFamily: fontFamily.poppinsMedium,
      color: 'white',
    },
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
 */

/**
 * @param {ButtonProps & ParamProps} props
 */

const GlobalButton = props => {
  const {styles} = useStyles();
  return (
    <TouchableOpacity
      disabled={!props.active}
      style={props.active ? styles.touchableNext : styles.touchableNextDisabled}
      {...props}>
      <GlobalText style={styles.textNext}>{props.title} </GlobalText>
    </TouchableOpacity>
  );
};

export default GlobalButton;

import React from 'react';
import {Text, StyleSheet} from 'react-native';

/**
 * @typedef {import('react-native').TextProps} GlobalTextProps
 */

/**
 *
 * @param {GlobalTextProps} props
 */

const styles = StyleSheet.create({
  fontStyle: {
    fontFamily: 'Poppins',
  },
});

const GlobalText = props => {
  return (
    <Text style={styles.fontStyle} allowFontScaling={false} {...props}>
      {props.children}
    </Text>
  );
};

export default GlobalText;

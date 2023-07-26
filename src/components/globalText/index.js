import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

/**
 * @typedef {import('react-native').TextProps} GlobalTextProps
 */

/**
 *
 * @param {GlobalTextProps} props
 */

const GlobalText = props => {
  const theme = Theme();
  return (
    <Text
      style={{fontFamily: theme.fontFamily.poppinsMedium}}
      allowFontScaling={false}
      {...props}>
      {props.children}
    </Text>
  );
};

export default GlobalText;

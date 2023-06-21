import React from 'react';
import {Text, TextProps} from 'react-native';

/**
 * @typedef {TextProps} GlobalTextProps
 */

/**
 *
 * @param {GlobalTextProps} props
 */

const GlobalText = props => {
  return (
    <Text allowFontScaling={false} {...props}>
      {props.children}
    </Text>
  );
};

export default GlobalText;

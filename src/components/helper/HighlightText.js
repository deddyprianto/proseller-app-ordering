import React from 'react';

import {Text} from 'react-native';

const HighlightText = ({style, highlightStyle, text, highlightText}) => {
  const handleFindAlphabet = ({value, key}) => {
    const keyFirstIndex = value.toUpperCase().indexOf(key.toUpperCase());
    const keyLastIndex = key.length + keyFirstIndex - 1;
    const valueSplit = value.split('');

    return valueSplit.map((item, index) => {
      if (keyFirstIndex <= index && index <= keyLastIndex) {
        return <Text style={highlightStyle}>{item}</Text>;
      } else {
        return <Text style={style}>{item}</Text>;
      }
    });
  };

  const results = () => {
    if (highlightText) {
      const textSplit = text.split(' ');
      const highlightTextLength = highlightText.split(' ').length;
      if (highlightTextLength > 1) {
        const result = handleFindAlphabet({value: text, key: highlightText});
        return result;
      } else {
        return textSplit.map(value => {
          if (value.toUpperCase().includes(highlightText.toUpperCase())) {
            const result = handleFindAlphabet({
              value,
              key: highlightText,
            });
            return <Text style={style}>{result} </Text>;
          } else {
            return <Text style={style}>{value} </Text>;
          }
        });
      }
    } else {
      return text;
    }
  };

  return <Text style={style}>{results()}</Text>;
};

export default HighlightText;

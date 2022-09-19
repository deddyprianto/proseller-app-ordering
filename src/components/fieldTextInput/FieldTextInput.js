import React from 'react';

import {StyleSheet, View, Text, TextInput} from 'react-native';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      paddingHorizontal: 16,
      borderColor: theme.colors.border1,
    },
    textLabel: {
      textAlign: 'left',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInput: {
      marginBottom: -3,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInputLabel: {
      marginBottom: -3,
      height: 21,
      padding: 0,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const FieldTextInput = ({
  type,
  label,
  customLabel,
  placeholder,
  value,
  onChange,
}) => {
  const styles = useStyles();
  const styleText = value ? styles.textInputLabel : styles.textInput;

  const renderLabel = () => {
    if (!label) {
      return;
    }

    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    return <Text style={styles.textLabel}>{label}</Text>;
  };

  const renderNumberInput = () => {
    return (
      <TextInput
        keyboardType={'numeric'}
        style={styleText}
        value={value}
        placeholder={placeholder}
        onChangeText={value => {
          onChange(value.replace(/[^0-9]/g, ''));
        }}
      />
    );
  };

  const renderTextInput = () => {
    return (
      <TextInput
        style={styleText}
        value={value}
        placeholder={placeholder}
        onChangeText={value => {
          onChange(value);
        }}
      />
    );
  };

  const renderInput = () => {
    switch (type) {
      case 'number':
        return renderNumberInput();

      default:
        return renderTextInput();
    }
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      {renderInput()}
    </View>
  );
};

export default FieldTextInput;

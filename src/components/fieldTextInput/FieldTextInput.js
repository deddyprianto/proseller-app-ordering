import React from 'react';

import {StyleSheet, View, Text, TextInput} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderColor: '#00000061',
  },
  textLabel: {
    width: '100%',
    textAlign: 'left',
    color: '#00000099',
    fontSize: 12,
  },
  textInput: {
    height: 17,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

const FieldTextInput = ({
  type,
  label,
  customLabel,
  placeholder,
  value,
  onChange,
}) => {
  const renderLabel = () => {
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
        style={styles.textInput}
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
        style={styles.textInput}
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

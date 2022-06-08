import React, {useEffect, useState} from 'react';
import debounce from 'lodash/debounce';

import {StyleSheet, View, Text, TextInput} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {search} from 'react-native-country-picker-modal/lib/CountryService';
const styles = StyleSheet.create({
  root: {
    height: 36,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderColor: '#00000061',
  },
  container: {
    width: '90%',
    justifyContent: 'center',
  },
  textLabel: {
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
  icon: {
    fontSize: 18,
    color: 'black',
  },
});

const FieldSearch = ({label, customLabel, placeholder, onChange, value}) => {
  const handleUpdateSearchQuery = e => {
    onChange(e);
  };

  const debounceSearchQuery = debounce(handleUpdateSearchQuery, 3000);

  const renderLabel = () => {
    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    return <Text style={styles.textLabel}>{label}</Text>;
  };

  const renderInput = () => {
    return (
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={e => {
          debounceSearchQuery(e);
        }}
      />
    );
  };

  return (
    <View style={styles.root}>
      <IconAntDesign name="search1" style={styles.icon} />
      <View style={styles.container}>
        {renderLabel()}
        {renderInput()}
      </View>
    </View>
  );
};

export default FieldSearch;

import React from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {CheckBox} from 'react-native-elements';
import colorConfig from '../../config/colorConfig';

const styles = StyleSheet.create({});

const FieldCheckBox = ({label, customLabel, checked, onPress}) => {
  const renderLabel = () => {
    if (customLabel) {
      return customLabel();
    }

    return <Text style={{marginLeft: -20}}>{label}</Text>;
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -20,
      }}>
      <CheckBox
        onPress={onPress}
        checked={checked}
        checkedColor={colorConfig.primaryColor}
      />
      {renderLabel()}
    </View>
  );
};

export default FieldCheckBox;

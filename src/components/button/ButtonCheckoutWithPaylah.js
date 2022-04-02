import React, {useState, useRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';

const ButtonCheckoutWithPaylah = () => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 0.2,
        borderRadius: 2,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorConfig.primaryColor,
      }}>
      <Text style={{fontSize: 16, color: 'white'}}>CHECK OUT WITH PAYLAH</Text>
    </TouchableOpacity>
  );
};

export default ButtonCheckoutWithPaylah;

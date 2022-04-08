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

const ButtonCheckout = () => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 0.2,
        borderRadius: 2,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 16}}>CHECK OUT</Text>
    </TouchableOpacity>
  );
};

export default ButtonCheckout;

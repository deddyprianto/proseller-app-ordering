/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Header from '../components/layout/header';
import MyDeliveryAddressList from '../components/myDeliveryAddressList';

import colorConfig from '../config/colorConfig';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
  },
  textAddNewAddressButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  footer: {
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
    backgroundColor: 'white',
  },
  touchableAddNewAddressButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    paddingVertical: 10,
  },
});

const MyDeliveryAddress = () => {
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchableAddNewAddressButton}
          onPress={() => {
            Actions.addNewAddress();
          }}>
          <Text style={styles.textAddNewAddressButton}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title="My Delivery Address" />
      <MyDeliveryAddressList />
      {renderFooter()}
    </View>
  );
};

export default MyDeliveryAddress;

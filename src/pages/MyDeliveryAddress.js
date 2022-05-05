/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import MyDeliveryAddressList from '../components/myDeliveryAddressList';

import Header from '../components/layout/header';

import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';
import DeliveryProviderSelectorModal from '../components/modal/DeliveryProviderSelectorModal';
import DeliveryDateSelectorModal from '../components/modal/DeliveryDateSelectorModal';
import {color} from 'react-native-reanimated';
import appConfig from '../config/appConfig';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
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

  const renderEmpty = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={styles.imageModal}
          source={appConfig.funtoastEmptyDeliveryAddress}
        />
        <Text style={{width: '60%', fontSize: 12, textAlign: 'center'}}>
          Uh-oh! You don’t have any saved address. Please, make a new one.
        </Text>
      </View>
    );
  };

  const renderDeliveryAddress = () => {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={{marginTop: 16}} />
          <MyDeliveryAddressList />
        </ScrollView>
      </View>
    );
  };

  const renderBody = () => {
    return renderDeliveryAddress();
  };

  return (
    <View style={styles.root}>
      <Header title="My Delivery Address" />
      {renderBody()}
      {renderFooter()}
    </View>
  );
};

export default MyDeliveryAddress;

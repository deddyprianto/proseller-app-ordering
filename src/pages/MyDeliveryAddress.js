/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';
import {useSelector} from 'react-redux';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import Header from '../components/layout/header';
import MyDeliveryAddressList from '../components/myDeliveryAddressList';

import awsConfig from '../config/awsConfig';

import Theme from '../theme';
import {isEmptyArray} from '../helper/CheckEmpty';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background2,
    },
    textAddNewAddressButton: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    footer: {
      borderTopWidth: 0.2,
      padding: 16,
      borderTopColor: theme.colors.border1,
      backgroundColor: theme.colors.background,
    },
    touchableAddNewAddressButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
    },
  });
  return styles;
};

const MyDeliveryAddress = ({fromScene}) => {
  const styles = useStyles();
  const [deliveryAddress, setDeliveryAddress] = useState([]);

  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    let deliveryAddresses = result?.deliveryAddress || [];

    if (!isEmptyArray(deliveryAddresses)) {
      const isDefault = deliveryAddresses?.find(item => item?.isDefault);
      const isDefaultIndex = deliveryAddresses?.findIndex(
        item => item?.index === isDefault?.index,
      );
      if (isDefault) {
        deliveryAddresses.splice(isDefaultIndex, 1);
        deliveryAddresses.unshift(isDefault);
      }
    }
    setDeliveryAddress(deliveryAddresses);
  }, [userDetail]);

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
      <MyDeliveryAddressList
        deliveryAddress={deliveryAddress}
        fromScene={fromScene}
      />
      {renderFooter()}
    </View>
  );
};

export default MyDeliveryAddress;

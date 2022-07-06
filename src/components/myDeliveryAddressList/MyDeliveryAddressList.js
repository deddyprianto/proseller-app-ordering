/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';

import {StyleSheet, View, FlatList, Text, Image} from 'react-native';

import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';

import {isEmptyArray} from '../../helper/CheckEmpty';

import MyDeliveryAddressItem from './components/MyDeliveryAddressListItem';

const styles = StyleSheet.create({
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAddressListItem: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  textImage: {
    width: '60%',
    fontSize: 12,
    textAlign: 'center',
  },
});

const MyDeliveryAddressList = () => {
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
    setDeliveryAddress(result?.deliveryAddress || []);
  }, [userDetail]);

  const renderMyDeliveryAddressListItem = item => {
    return (
      <View style={styles.viewAddressListItem}>
        <MyDeliveryAddressItem item={item} deliveryAddress={deliveryAddress} />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.viewImage}>
        <Image source={appConfig.funtoastEmptyDeliveryAddress} />
        <Text style={styles.textImage}>
          Uh-oh! You don’t have any saved address. Please, make a new one.
        </Text>
      </View>
    );
  };

  const renderDeliveryAddressList = () => {
    return (
      <FlatList
        data={deliveryAddress}
        renderItem={({item, index}) =>
          renderMyDeliveryAddressListItem(item, index)
        }
      />
    );
  };

  const renderMyDeliveryAddress = () => {
    if (isEmptyArray(deliveryAddress)) {
      return renderEmpty();
    } else {
      return renderDeliveryAddressList();
    }
  };

  return renderMyDeliveryAddress();
};

export default MyDeliveryAddressList;

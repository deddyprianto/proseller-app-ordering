/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';

import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Text,
  Image,
} from 'react-native';

import IconIonicons from 'react-native-vector-icons/Ionicons';

import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';

import {isEmptyArray} from '../../helper/CheckEmpty';

import MyDeliveryAddressItem from './components/MyDeliveryAddressItem';

const styles = StyleSheet.create({
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSearch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    borderRadius: 4,
  },
  textImage: {
    width: '60%',
    fontSize: 12,
    textAlign: 'center',
  },
  textSearch: {
    fontSize: 12,
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
      <View>
        <MyDeliveryAddressItem item={item} deliveryAddress={deliveryAddress} />
        <View style={{marginBottom: 16}} />
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

  const renderSearch = () => {
    return (
      <View style={styles.viewSearch}>
        <Text style={styles.textSearch}>Search</Text>
        <IconIonicons name="md-search" />
      </View>
    );
  };

  const renderDeliveryAddressList = () => {
    return (
      <ScrollView style={{paddingHorizontal: 16}}>
        <View style={{marginTop: 16}} />
        {renderSearch()}
        <View style={{marginTop: 16}} />
        <FlatList
          data={deliveryAddress}
          renderItem={({item, index}) =>
            renderMyDeliveryAddressListItem(item, index)
          }
        />
      </ScrollView>
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

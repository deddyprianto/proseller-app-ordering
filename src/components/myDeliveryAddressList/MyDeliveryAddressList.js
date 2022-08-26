/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, FlatList, Text, Image} from 'react-native';

import appConfig from '../../config/appConfig';

import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';

import MyDeliveryAddressItem from './components/MyDeliveryAddressListItem';

const useStyles = () => {
  const theme = Theme();
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
      textAlign: 'center',
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const MyDeliveryAddressList = ({deliveryAddress, fromScene}) => {
  const styles = useStyles();

  const renderMyDeliveryAddressListItem = item => {
    return (
      <View style={styles.viewAddressListItem}>
        <MyDeliveryAddressItem
          item={item}
          deliveryAddress={deliveryAddress}
          fromScene={fromScene}
        />
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
        data={deliveryAddress || []}
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

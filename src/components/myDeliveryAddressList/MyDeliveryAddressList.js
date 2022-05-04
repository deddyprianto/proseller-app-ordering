/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {StyleSheet, View, FlatList, ScrollView, Text} from 'react-native';

import IconIonicons from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';

import {isEmptyArray} from '../../helper/CheckEmpty';

import MyDeliveryAddress from './components/MyDeliveryAddressItem';

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
  textSubTotal: {
    fontSize: 12,
  },
  textSubTotalValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textDeliveryFee: {
    fontSize: 12,
  },
  textDeliveryFeeValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textGrandTotal: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  textGrandTotalValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
  textInclusiveTax: {
    color: '#B7B7B7',
    fontSize: 10,
  },
  textSeeDetails: {
    color: colorConfig.primaryColor,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textInclusiveTaxValue: {
    color: '#B7B7B7',
    fontWeight: 'bold',
    fontSize: 10,
  },
  textCheckoutButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  textMethod: {
    fontSize: 12,
    fontWeight: '500',
  },
  textMethodValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colorConfig.primaryColor,
    textAlign: 'center',
  },
  textAddButton: {
    color: colorConfig.primaryColor,
    fontSize: 12,
  },
  viewCheckoutInfoValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewCheckoutButton: {
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
    backgroundColor: 'white',
  },
  viewCheckout: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -8,
  },
  viewMethod: {
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  viewAddButton: {
    borderColor: colorConfig.primaryColor,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  touchableMethod: {
    width: 120,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
  },
  touchableCheckoutButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7B7B7',
    paddingVertical: 10,
  },
  dividerDashed: {
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
  divider: {
    borderColor: colorConfig.primaryColor,
    borderTopWidth: 0.5,
  },
});

const ProductCartList = ({...props}) => {
  const [groupEGift, setGroupEGift] = useState([]);

  useState(() => {
    const eGifts = [
      {
        id: 1,
        name: 'martin',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 2,
        name: 'test',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 3,
        name: 'anjay',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 4,
        name: 'martin',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 5,
        name: 'test',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 6,
        name: 'test',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 7,
        name: 'test',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
      {
        id: 8,
        name: 'test',
        image:
          'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
      },
    ];

    if (!isEmptyArray(eGifts)) {
      setGroupEGift(eGifts);
    }
  }, []);

  const renderProductCartItem = item => {
    return (
      <View>
        <MyDeliveryAddress item={item} />
        <View style={{marginBottom: 16}} />
      </View>
    );
  };

  return (
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 11,
          borderWidth: 1,
          borderColor: '#B7B7B7',
          borderRadius: 4,
        }}>
        <Text style={{fontSize: 12}}>Search</Text>
        <IconIonicons name="md-search" />
      </View>
      <View style={{marginTop: 16}} />
      <FlatList
        data={groupEGift}
        renderItem={({item, index}) => renderProductCartItem(item, index)}
      />
    </ScrollView>
  );
};

export default ProductCartList;

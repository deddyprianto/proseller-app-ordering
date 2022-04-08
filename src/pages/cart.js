/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, Dimensions} from 'react-native';

import {CheckBox} from 'react-native-elements';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colorConfig from '../config/colorConfig';
import EGiftCard from '../components/eGiftCard/EGiftCard';
import SearchBar from '../components/searchBar/SearchBar';
import ProductCartList from '../components/productCartList/ProductCartList';
import {SafeAreaView} from 'react-navigation';
import CartIcon from '../components/order/CartIcon';
import ButtonCheckout from '../components/button/ButtonCheckout';
import ButtonCheckoutWithPaylah from '../components/button/ButtonCheckoutWithPaylah';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({});

const Cart = ({...props}) => {
  const renderItemsTotal = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Items total:</Text>
        <Text>$6.00</Text>
      </View>
    );
  };

  const renderDiscount = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Discount</Text>
        <Text>$6.00</Text>
      </View>
    );
  };

  const renderTotal = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Total:</Text>
        <Text style={{fontWeight: 'bold'}}>$6.00</Text>
      </View>
    );
  };

  const renderCheckout = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: WIDTH,
          height: HEIGHT * 0.27,
          backgroundColor: 'white',
          borderTopWidth: 0.2,
          borderTopColor: 'grey',
          padding: 10,
        }}>
        {renderItemsTotal()}
        {renderDiscount()}
        {renderTotal()}
        <View style={{marginVertical: 5}} />
        <ButtonCheckoutWithPaylah />
        <View style={{marginVertical: 5}} />
        <ButtonCheckout />
      </View>
    );
  };

  return (
    <View style={{height: HEIGHT}}>
      <View
        style={{
          backgroundColor: colorConfig.primaryColor,
          height: HEIGHT * 0.03,
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>Cart</Text>
      </View>
      <View style={{height: HEIGHT * 0.7}}>
        <ProductCartList />
      </View>
      {renderCheckout()}
    </View>
  );
};

export default Cart;

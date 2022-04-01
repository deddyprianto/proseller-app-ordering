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
import ProductList from '../components/productList/ProductList';
import {SafeAreaView} from 'react-navigation';
import CartIcon from '../components/order/CartIcon';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  viewHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    color: 'black',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
  text1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text2: {
    color: 'black',
    fontSize: 14,
  },
  text3: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  textRequired: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
  input: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
  },
  inputEmpty: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
    borderColor: 'red',
  },
  viewLocation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: colorConfig.primaryColor,
    height: 35,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
  },
  viewOr: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOr: {
    color: 'black',
    fontSize: 20,
  },
});

const OrderHere = ({...props}) => {
  return (
    // <ScrollView style={styles.container}>
    <SafeAreaView style={styles.container}>
      <View style={styles.viewHeader}>
        <Text style={styles.textTitle}>What would you like to eat</Text>
        <CartIcon
          // outletID={item.id}
          dataBasket={props.dataBasket}
          // refreshQuantityProducts={refreshQuantityProducts}
        />
      </View>
      <SearchBar />

      <View style={styles.viewLocation}>
        <IconMaterialIcons
          name="location-on"
          style={{fontSize: 20, color: colorConfig.primaryColor}}
        />
        <Text style={styles.text2}>Jewel Fun Toast </Text>
      </View>

      <ProductList />
    </SafeAreaView>
    // </ScrollView>
  );
};

export default OrderHere;

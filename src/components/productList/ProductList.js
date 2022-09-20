/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import Product from './components/ProductItem';

import {isEmptyArray} from '../../helper/CheckEmpty';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: 16,
      minHeight: 50,
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 70,
    },
  });
  return styles;
};

const ProductList = ({products, basket}) => {
  const styles = useStyles();

  const renderProducts = () => {
    if (!isEmptyArray(products)) {
      const categoryProducts = products?.map(item => {
        return <Product product={item.product} basket={basket} />;
      });

      return <View style={styles.viewGroupProduct}>{categoryProducts}</View>;
    }
  };

  return <ScrollView style={styles.root}>{renderProducts()}</ScrollView>;
};

export default ProductList;

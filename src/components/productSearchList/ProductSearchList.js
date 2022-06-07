/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import ProductSearchListItem from './components/ProductSearchListItem';

import {isEmptyArray} from '../../helper/CheckEmpty';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  viewGroupProduct: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});

const ProductSearchList = ({products, basket}) => {
  const renderProducts = () => {
    if (!isEmptyArray(products)) {
      const result = products.map((item, index) => {
        return (
          <ProductSearchListItem
            key={index}
            product={item.product}
            basket={basket}
          />
        );
      });
      return result;
    }
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.viewGroupProduct}>{renderProducts()}</View>
    </ScrollView>
  );
};

export default ProductSearchList;

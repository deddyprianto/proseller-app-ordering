/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {useSelector} from 'react-redux';

import {View, FlatList, StyleSheet} from 'react-native';

import ProductCartItem from './components/ProductCartItem';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
  });
  return styles;
};

const ProductCartList = ({orderDetail, disabled}) => {
  const styles = useStyles();
  const currentBasket = useSelector(
    state => state.orderReducer?.dataBasket?.product,
  );
  const items = disabled ? orderDetail?.details : currentBasket?.details;

  const renderProductCartItem = item => {
    return (
      <View style={styles.root}>
        <ProductCartItem item={item} disabled={disabled} />
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={({item, index}) => renderProductCartItem(item, index)}
    />
  );
};

export default ProductCartList;

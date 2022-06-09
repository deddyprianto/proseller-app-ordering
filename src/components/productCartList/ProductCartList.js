/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {useSelector} from 'react-redux';

import {View, FlatList} from 'react-native';

import ProductCartItem from './components/ProductCartItem';

const ProductCartList = ({orderDetail, disabled}) => {
  const currentBasket = useSelector(
    state => state.orderReducer?.dataBasket?.product,
  );
  const items = disabled ? orderDetail?.details : currentBasket?.details;

  const renderProductCartItem = item => {
    return (
      <View>
        <ProductCartItem item={item} disabled={disabled} />
        <View style={{marginBottom: 16}} />
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

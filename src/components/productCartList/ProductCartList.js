/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {View, FlatList} from 'react-native';

import {isEmptyArray} from '../../helper/CheckEmpty';
import ProductCartItem from './components/ProductCartItem';

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
        <ProductCartItem item={item} />
        <View style={{marginBottom: 16}} />
      </View>
    );
  };

  return (
    <FlatList
      data={groupEGift}
      renderItem={({item, index}) => renderProductCartItem(item, index)}
    />
  );
};

export default ProductCartList;

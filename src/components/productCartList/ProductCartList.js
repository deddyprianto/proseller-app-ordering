/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';
import ProductCart from './components/ProductCart';
import ButtonViewBasket from '../../components/order/ButtonViewBasket';
import {SafeAreaView} from 'react-navigation';
import ButtonCheckout from '../button/ButtonCheckout';

const styles = StyleSheet.create({
  viewGroupProduct: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

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

  const renderProductCartItem = (item, index) => {
    return (
      <View>
        <ProductCart item={item} />
        <View
          style={{
            height: 0.5,
            backgroundColor: 'black',
            marginBottom: 1,
            marginHorizontal: 10,
          }}
        />
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

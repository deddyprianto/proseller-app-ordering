/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef} from 'react';

import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';
import Product from './components/Product';
import ButtonViewBasket from '../../components/order/ButtonViewBasket';
import {SafeAreaView} from 'react-navigation';

const styles = StyleSheet.create({
  viewGroupProduct: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});

const ProductList = ({...props}) => {
  const categoryRef = useRef();
  const productRef = useRef();
  const [groupEGift, setGroupEGift] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});

  useState(() => {
    const eGifts = [
      {
        id: 1,
        category: 'Local Delight',
        products: [
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
        ],
      },
      {
        id: 2,
        category: 'Fun Toast',
        products: [
          {
            id: 1,
            name: 'martin',
            image:
              'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
          },
        ],
      },
      {
        id: 3,
        category: 'Fun Meal',
        products: [
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
        ],
      },

      {
        id: 4,
        category: 'Drinks',
        products: [
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
        ],
      },

      {
        id: 5,
        category: 'coba',
        products: [
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
        ],
      },
    ];

    if (!isEmptyArray(eGifts)) {
      setGroupEGift(eGifts);
      setSelectedCategory(eGifts[0]);
    }
  }, []);

  const renderCategorySelected = category => {
    if (category.id === selectedCategory.id) {
      return (
        <View style={{height: 1, backgroundColor: colorConfig.primaryColor}} />
      );
    }
  };

  const renderCategoryTabsItem = (items, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedCategory(items);
          productRef.current.scrollToIndex({animated: true, index: index});
        }}>
        <View style={{paddingRight: 10}}>
          <Text style={{width: 100, textAlign: 'center'}}>
            {items?.category}
          </Text>
          {renderCategorySelected(items)}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <FlatList
        ref={categoryRef}
        data={groupEGift}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => renderCategoryTabsItem(item, index)}
      />
    );
  };

  const handleScrollProducts = value => {
    setSelectedCategory(value.item);
    categoryRef.current.scrollToIndex({animation: true, index: value.index});
  };

  const onViewableItemsChanged = ({viewableItems}) => {
    if (!isEmptyArray(viewableItems)) {
      let index = viewableItems.length - 1;

      if (viewableItems.length === 3) {
        index = viewableItems.length - 2;
      }

      handleScrollProducts(viewableItems[index]);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const renderProductItem = (items, index) => {
    return (
      <View key={index}>
        <Text style={{fontWeight: 'bold'}}>{items?.category}</Text>
        <View style={styles.viewGroupProduct}>
          {items?.products?.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Actions.productDetail({item});
                }}>
                <Product item={item} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderProducts = () => {
    return (
      <FlatList
        ref={productRef}
        style={{height: 475}}
        data={groupEGift}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => renderProductItem(item, index)}
      />
    );
  };

  return (
    <SafeAreaView>
      {renderCategoryTabs()}
      <View style={{marginTop: 10}} />
      {renderProducts()}
      <ButtonViewBasket />
    </SafeAreaView>
  );
};

export default ProductList;

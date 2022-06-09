/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';

import Product from './components/Product';

import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';

const styles = StyleSheet.create({
  textProductName: {
    fontWeight: 'bold',
  },
  textCategoryName: {
    width: 70,
    fontSize: 12,
    textAlign: 'center',
    color: '#B7B7B7',
  },
  textCategoryNameSelected: {
    width: 70,
    fontSize: 12,
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
  viewGroupProduct: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  touchableCategoryItem: {
    width: 100,
    height: 10,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  touchableCategoryItemSelected: {
    width: 100,
    height: 10,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: colorConfig.primaryColor,
    borderBottomWidth: 1,
  },
});

const ProductList = ({products, basket}) => {
  const categoryRef = useRef();
  const productRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState({});

  useEffect(() => {
    if (!isEmptyArray(products)) {
      setSelectedCategory(products[0]);
      categoryRef.current.scrollToIndex({animation: true, index: 0});
      productRef.current.scrollToIndex({animated: true, index: 0});
    }
  }, [products, basket]);

  const renderCategoryTabsItem = (item, index) => {
    const isSelected = item.id === selectedCategory.id;

    const styleText = isSelected
      ? styles.textCategoryNameSelected
      : styles.textCategoryName;

    const styleTouchable = isSelected
      ? styles.touchableCategoryItemSelected
      : styles.touchableCategoryItem;

    return (
      <TouchableOpacity
        style={styleTouchable}
        onPress={() => {
          setSelectedCategory(item);
          productRef.current.scrollToIndex({animated: true, index: index});
        }}>
        <Text style={styleText} numberOfLines={1}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <FlatList
        ref={categoryRef}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => renderCategoryTabsItem(item, index)}
      />
    );
  };

  const handleScrollProducts = value => {
    if (value?.item) {
      setSelectedCategory(value.item);
      categoryRef.current.scrollToIndex({animation: true, index: value.index});
    }
  };

  const onViewableItemsChanged = ({viewableItems}) => {
    if (!isEmptyArray(viewableItems)) {
      if (viewableItems[0].index === 0) {
        return handleScrollProducts(viewableItems[0]);
      }

      if (viewableItems.length === 1) {
        return handleScrollProducts(viewableItems[0]);
      } else {
        return handleScrollProducts(viewableItems[1]);
      }
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const renderProductItem = (category, index) => {
    const categoryProducts = category?.items?.map(item => {
      return <Product product={item.product} basket={basket} />;
    });

    return (
      <View key={index}>
        <Text style={styles.textProductName}>{category?.name}</Text>
        <View style={styles.viewGroupProduct}>{categoryProducts}</View>
      </View>
    );
  };

  const renderProducts = () => {
    return (
      <FlatList
        ref={productRef}
        data={products}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => renderProductItem(item, index)}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderCategoryTabs()}
      <View style={{marginTop: 10}} />
      {renderProducts()}
    </View>
  );
};

export default ProductList;

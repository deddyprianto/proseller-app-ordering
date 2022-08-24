/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {isEmptyArray} from '../../helper/CheckEmpty';

import ProductSubCategoryItem from './components/ProductSubCategoryItem';

const useStyles = () => {
  const styles = StyleSheet.create({
    viewCategoryTabs: {
      marginBottom: 20,
    },
  });
  return styles;
};

const ProductSubCategoryList = ({
  subCategories,
  selectedSubCategory,
  onChange,
}) => {
  const styles = useStyles();
  const subCategoryRef = useRef();

  useEffect(() => {
    if (!isEmptyArray(subCategories)) {
      subCategoryRef.current.scrollToIndex({animation: true, index: 0});
    }
  }, [subCategories]);

  const renderSubCategory = ({item, index}) => {
    const isFirstIndex = index === 0;
    const isLastIndex = subCategories.length - 1 === index;

    return (
      <ProductSubCategoryItem
        subCategory={item}
        selected={selectedSubCategory}
        isFirstIndex={isFirstIndex}
        isLastIndex={isLastIndex}
        onPress={() => {
          onChange(item);
        }}
      />
    );
  };

  const renderSubCategories = () => {
    return (
      <FlatList
        ref={subCategoryRef}
        style={styles.viewCategoryTabs}
        data={subCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => renderSubCategory({item, index})}
      />
    );
  };

  return <View>{renderSubCategories()}</View>;
};

export default ProductSubCategoryList;

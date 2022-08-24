/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';

import ProductSearchListItem from './components/ProductSearchItem';

import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 60,
    },
    textSearch: {
      marginTop: 16,
      marginBottom: 8,
      marginHorizontal: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const ProductSearchList = ({products, basket, searchQuery}) => {
  const styles = useStyles();

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

  const renderSearchText = () => {
    if (searchQuery) {
      return (
        <Text style={styles.textSearch}>Search result for “{searchQuery}”</Text>
      );
    }
  };

  const renderBody = () => {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.viewGroupProduct}>{renderProducts()}</View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.root}>
      {renderSearchText()}
      {renderBody()}
    </View>
  );
};

export default ProductSearchList;

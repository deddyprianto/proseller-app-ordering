/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions} from 'react-native';

import ProductSearchListItem from '../productList/components/ProductItem';

import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';
import appConfig from '../../config/appConfig';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../helper/Layout';
import AlertSvg from '../../assets/svg/AlertSvg';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 0,
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 60,
      paddingHorizontal: 16,
    },
    textSearch: {
      marginTop: 16,
      marginBottom: 8,
      marginHorizontal: 16,
      color: theme.colors.greyScale5,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEmpty: {
      marginTop: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
      textAlign: 'center',
    },
    viewEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: normalizeLayoutSizeHeight(241),
    },
    iconEmpty: {
      width: 100,
      height: 100,
      tintColor: theme.colors.textTertiary,
    },
    textEmptyContainer: {
      width: normalizeLayoutSizeWidth(363),
    },
  });
  return styles;
};

const ProductSearchList = ({products, basket, searchQuery, isLoading}) => {
  const styles = useStyles();

  const renderProducts = () => {
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
  };

  const renderSearchText = () => {
    if (searchQuery) {
      return (
        <Text style={styles.textSearch}>Search result for “{searchQuery}”</Text>
      );
    }
  };

  const renderBody = () => {
    if (isEmptyArray(products) && !isLoading) {
      return (
        <View style={styles.viewEmpty}>
          <View>
            <AlertSvg />
          </View>
          <View style={styles.textEmptyContainer}>
            <Text style={styles.textEmpty}>
              Item can’t be found. Please try another keyword.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.viewGroupProduct}>{renderProducts()}</View>
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.root}>
      {renderSearchText()}
      {renderBody()}
    </View>
  );
};

export default ProductSearchList;

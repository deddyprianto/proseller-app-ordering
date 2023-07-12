/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

import Product from './components/ProductItem';

import {isEmptyArray} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: 16,
      minHeight: 50,
    },
    viewProductsEmpty: {
      marginBottom: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 70,
    },
    textProductsEmpty1: {
      marginTop: 16,
      fontSize: theme.fontSize[16],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textProductsEmpty2: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: theme.fontSize[14],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    imageEmptyProduct: {
      width: 246,
      height: 246,
    },
  });
  return styles;
};

const ProductList = ({products, basket}) => {
  const styles = useStyles();

  const renderProductListEmpty = () => {
    return (
      <View style={styles.viewProductsEmpty}>
        <Image
          source={appConfig.imageEmptyProduct}
          style={styles.imageEmptyProduct}
        />
        <Text style={styles.textProductsEmpty1}>Empty Product</Text>
        <Text style={styles.textProductsEmpty2}>
          Oops! We don't have any products on this section right now. Stay tuned
          for updates!
        </Text>
      </View>
    );
  };
  const renderProducts = () => {
    if (!isEmptyArray(products)) {
      const categoryProducts = products?.map(item => {
        return <Product product={item.product} basket={basket} />;
      });

      return <View style={styles.viewGroupProduct}>{categoryProducts}</View>;
    } else {
      return renderProductListEmpty();
    }
  };

  return <View style={styles.root}>{renderProducts()}</View>;
};

export default ProductList;

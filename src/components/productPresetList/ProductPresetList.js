/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Product from '../productList/components/ProductItem';

import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    textProductName: {
      fontWeight: 'bold',
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textCategoryName: {
      width: 70,
      textAlign: 'center',
      color: theme.colors.text2,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCategoryNameSelected: {
      width: 70,
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewCategoryTabs: {
      marginBottom: 20,
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 60,
    },
    touchableCategoryItem: {
      flex: 1,
      width: 100,
      height: 'auto',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 15,
    },
    touchableCategoryItemSelected: {
      flex: 1,
      width: 100,
      height: 'auto',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
    },
  });
  return styles;
};

const ProductPresetList = ({products, basket}) => {
  const styles = useStyles();
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
        style={styles.viewCategoryTabs}
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
      if (Platform.OS === 'android' && viewableItems[0].index === 0) {
        return handleScrollProducts(viewableItems[0]);
      }

      if (viewableItems.length === 1) {
        return handleScrollProducts(viewableItems[0]);
      } else {
        return handleScrollProducts(viewableItems[1]);
      }
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 10,
    minimumViewTime: Platform.OS === 'android' ? 0 : 200,
  };

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

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
        initialNumToRender={products?.length}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => renderProductItem(item, index)}
      />
    );
  };

  if (isEmptyArray(products)) {
    return null;
  }

  return (
    <View style={styles.root}>
      {renderCategoryTabs()}
      {renderProducts()}
    </View>
  );
};

export default ProductPresetList;

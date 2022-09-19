/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef} from 'react';

import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';

import {isEmptyArray} from '../../helper/CheckEmpty';
import EStoreItem from './components/EStoreItem';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    textCategoryName: {
      textAlign: 'center',
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCategoryNameSelected: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewGroupEStore: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginBottom: 40,
    },
    viewGroupProduct: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    touchableCategoryItem: {
      flex: 1,
      marginHorizontal: 8,
      marginBottom: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchableCategoryItemSelected: {
      flex: 1,
      marginHorizontal: 8,
      marginBottom: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
    },
  });
  return styles;
};

const EStoreList = ({products, basket}) => {
  const styles = useStyles();
  const categoryRef = useRef();
  const productRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState({});

  useState(() => {
    if (!isEmptyArray(products)) {
      setSelectedCategory(products[0]);
    }
  }, [products]);

  const renderCategoryTabsItem = (item, index) => {
    const selected = item.id === selectedCategory.id;
    const styleWrap = selected
      ? styles.touchableCategoryItemSelected
      : styles.touchableCategoryItem;

    const styleText = selected
      ? styles.textCategoryNameSelected
      : styles.textCategoryName;

    return (
      <TouchableOpacity
        style={styleWrap}
        onPress={() => {
          setSelectedCategory(item);
          productRef.current.scrollToIndex({animated: true, index: index});
        }}>
        <Text style={styleText}>{item?.name}</Text>
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

  const handleScrollEStores = value => {
    setSelectedCategory(value.item);
    categoryRef.current.scrollToIndex({animation: true, index: value.index});
  };

  const onViewableItemsChanged = ({viewableItems}) => {
    if (!isEmptyArray(viewableItems)) {
      if (viewableItems.length === 1) {
        return handleScrollEStores(viewableItems[0]);
      } else {
        return handleScrollEStores(viewableItems[1]);
      }
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const renderEStoreItem = (category, index) => {
    const categoryProducts = category?.items?.map(item => {
      return <EStoreItem item={item.product} basket={basket} />;
    });

    return <View style={styles.viewGroupEStore}>{categoryProducts}</View>;
  };

  const renderEStores = () => {
    return (
      <FlatList
        ref={productRef}
        data={products}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => renderEStoreItem(item, index)}
      />
    );
  };

  return (
    <View style={styles.root}>
      {renderCategoryTabs()}
      {renderEStores()}
    </View>
  );
};

export default EStoreList;

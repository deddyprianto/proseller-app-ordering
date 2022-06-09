/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';
import EStoreItem from './components/EStoreItem';
import {getProductByOutlet} from '../../actions/product.action';

const styles = StyleSheet.create({
  textCategoryName: {
    width: 70,
    textAlign: 'center',
  },
  viewGroupEStore: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  viewGroupProduct: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  touchableCategoryItem: {
    width: 100,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dividerCategorySelected: {
    width: '100%',
    height: 1,
    backgroundColor: colorConfig.primaryColor,
  },
});

const HEIGHT = Dimensions.get('window').height;

const EStoreList = () => {
  const dispatch = useDispatch();
  const categoryRef = useRef();
  const productRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState({});

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const products = useSelector(
    state => state.productReducer?.productsOutlet?.products,
  );

  useState(() => {
    const loadData = async () => {
      await dispatch(getProductByOutlet(defaultOutlet.id));
      setSelectedCategory(products[0]);
    };

    loadData();
  }, []);

  const renderDivider = category => {
    if (category.id === selectedCategory.id) {
      return <View style={styles.dividerCategorySelected} />;
    }
  };

  const renderCategoryTabsItem = (items, index) => {
    return (
      <TouchableOpacity
        style={styles.touchableCategoryItem}
        onPress={() => {
          setSelectedCategory(items);
          productRef.current.scrollToIndex({animated: true, index: index});
        }}>
        <Text style={styles.textCategoryName} numberOfLines={1}>
          {items?.name}
        </Text>
        {renderDivider(items)}
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
      return <EStoreItem item={item.product} />;
    });

    return <View style={styles.viewGroupEStore}>{categoryProducts}</View>;
  };

  const renderEStores = () => {
    return (
      <FlatList
        ref={productRef}
        style={{height: HEIGHT * 0.8}}
        data={products}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => renderEStoreItem(item, index)}
      />
    );
  };

  return (
    <View style={{paddingHorizontal: 10}}>
      {renderCategoryTabs()}
      <View style={{marginTop: 10}} />
      {renderEStores()}
    </View>
  );
};

export default EStoreList;

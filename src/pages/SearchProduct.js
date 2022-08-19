/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {ScrollView} from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';

import Header from '../components/layout/header';
import FieldSearch from '../components/fieldSearch';
import ProductList from '../components/productList';
import LoadingScreen from '../components/loadingScreen';
import ProductSearchList from '../components/productSearchList';
import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';

import {
  getProductByOutlet,
  getProductBySearch,
  getProductCategories,
} from '../actions/product.action';
import {getBasket} from '../actions/order.action';

import {isEmptyArray} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import appConfig from '../config/appConfig';

import Theme from '../theme';
import FieldTextInput from '../components/fieldTextInput';
import ProductCategoryList from '../components/productCategoryList';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    header: {
      height: 140,
    },
    body: {
      flex: 1,
      marginTop: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    footer: {
      elevation: 5,
      position: 'absolute',
      bottom: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    textBody: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    textButtonCart: {
      fontWeight: 'bold',
      fontSize: 11,
      color: 'white',
    },
    viewTextAndSearch: {
      paddingHorizontal: 16,
      width: '100%',
    },
    viewBodyText: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 16,
    },
    viewProductList: {
      paddingHorizontal: 16,
      flex: 1,
    },
    viewButtonCart: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      padding: 14,
      justifyContent: 'space-between',
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    viewIconAndTextCart: {
      display: 'flex',
      flexDirection: 'row',
    },
    icon: {
      width: 18,
      height: 18,
      marginRight: 7,
      color: theme.colors.text4,
    },
  });
  return styles;
};

const OrderHere = () => {
  const theme = Theme();
  const styles = useStyles();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderingTypeModal, setOpenOrderingTypeModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [productsSearch, setProductsSearch] = useState([]);

  const categories = useSelector(
    state => state.productReducer.productCategories,
  );

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const orderingMode = useSelector(
    state => state.orderReducer?.dataOrderingMode?.orderingMode,
  );
  const products = useSelector(
    state => state.productReducer?.productsOutlet?.products,
  );

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await dispatch(getProductByOutlet(defaultOutlet.id));
    await dispatch(getProductCategories({outletId: defaultOutlet.id}));
    await dispatch(getBasket());
    setRefresh(false);
  }, [dispatch, defaultOutlet]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const response = await dispatch(
        getProductBySearch({
          outletId: defaultOutlet.sortKey,
          search: searchQuery,
        }),
      );

      setIsLoading(false);
      setProductsSearch(response);
    };
    loadData();
  }, [dispatch, searchQuery, defaultOutlet]);

  const handleLoading = () => {
    if (isLoading && searchQuery) {
      return true;
    } else {
      return false;
    }
  };

  const renderText = () => {
    return (
      <View style={styles.viewBodyText}>
        <Text style={styles.textBody}>What would you like to eat?</Text>
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <FieldSearch
        label="Search"
        value={searchQuery}
        placeholder="Search..."
        onChange={value => {
          setSearchQuery(value);
        }}
      />
    );
  };

  const renderProducts = () => {
    if (searchQuery) {
      return <ProductSearchList basket={basket} products={productsSearch} />;
    } else {
      return <ProductList basket={basket} products={products} />;
    }
  };

  const renderButtonCart = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <TouchableOpacity
          style={styles.viewButtonCart}
          onPress={() => {
            Actions.cart();
          }}>
          <View style={styles.viewIconAndTextCart}>
            <Image source={appConfig.iconCart} style={styles.icon} />
            <Text style={styles.textButtonCart}>
              {basket?.details?.length} Items in Cart
            </Text>
          </View>
          <Text style={styles.textButtonCart}>
            {CurrencyFormatter(basket?.totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderHeaderTitle = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.store();
        }}>
        <Text>{defaultOutlet?.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHeaderSearch = () => {
    return (
      <View
        style={{
          width: '100%',
          elevation: 3,
          paddingHorizontal: 16,
          paddingVertical: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}>
        <FieldSearch
          placeholder="Try to search “toast”"
          value={searchQuery}
          onChange={value => {
            setSearchQuery(value);
          }}
        />
        <Text
          onPress={() => {}}
          style={{
            marginLeft: 16,
            color: theme.colors.buttonActive,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Cancel
        </Text>
      </View>
    );
  };

  const renderRecentSearch = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.greyScale4,
        }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[16],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Recent Search
        </Text>
        <Text
          onPress={() => {}}
          style={{
            color: theme.colors.buttonActive,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Clear Recent
        </Text>
      </View>
    );
  };
  const renderSearchByCategory = () => {
    return (
      <View>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: theme.colors.greyScale4,
          }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.fontSize[16],
              fontFamily: theme.fontFamily.poppinsMedium,
            }}>
            Search by Category
          </Text>
        </View>
        <ProductCategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCLick={item => {
            setSelectedCategory(item);
          }}
          itemSize={'small'}
          //   isIndicator
          //   isScroll
          //   isMoreCategoryButton
          //   horizontal
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <LoadingScreen loading={handleLoading()} />
      {renderHeaderSearch()}
      <ScrollView>
        {renderRecentSearch()}
        {renderSearchByCategory()}
        {/* <View style={styles.header}>
        <ScrollView
          contentContainerStyle={styles.header}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          <Header customTitle={renderHeaderTitle()} scanner />
          <View style={styles.viewTextAndSearch}>
            {renderText()}
            {renderSearch()}
          </View>
        </ScrollView>
      </View> */}

        {/* <View style={styles.body}>{renderProducts()}</View> */}
      </ScrollView>
      <View style={styles.footer}>{renderButtonCart()}</View>
    </View>
  );
};

export default OrderHere;

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
  SafeAreaView,
} from 'react-native';

import Header from '../components/layout/header';
import FieldSearch from '../components/fieldSearch';
import LoadingScreen from '../components/loadingScreen';
import ProductSearchList from '../components/productSearchList';
import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';

import {
  getProductByOutlet,
  getProductBySearch,
} from '../actions/product.action';
import {getBasket} from '../actions/order.action';

import {isEmptyArray} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import appConfig from '../config/appConfig';

import Theme from '../theme';
import ProductPresetList from '../components/productPresetList/ProductPresetList';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    body: {
      flex: 1,
      paddingHorizontal: 16,
    },
    footer: {
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
    textHeaderTitle: {
      paddingTop: 2,
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewHeaderTitle: {
      flex: 1,
      minHeight: 36,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 16,
      borderRadius: 50,
      backgroundColor: theme.colors.accent,
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
    iconArrowDown: {
      marginLeft: 4,
      width: 16,
      height: 12,
      tintColor: theme.colors.textQuaternary,
    },
  });
  return styles;
};

const OrderHere = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [searchTextInput, setSearchTextInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productsSearch, setProductsSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const orderingMode = useSelector(
    state => state.orderReducer?.dataOrderingMode?.orderingMode,
  );
  const products = useSelector(state => state.productReducer.productsOutlet);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setIsLoading(true);
    await dispatch(getProductByOutlet(defaultOutlet.id));
    await dispatch(getBasket());
    setRefresh(false);
    setIsLoading(false);
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

  const handleSearchProduct = async value => {
    setSearchTextInput('');
    setSearchQuery(value);
  };

  const handleLoading = () => {
    if (isLoading && searchQuery) {
      return true;
    } else {
      return false;
    }
  };

  const renderHeaderTitle = () => {
    return (
      <TouchableOpacity
        style={styles.viewHeaderTitle}
        onPress={() => {
          Actions.store();
        }}>
        <Text numberOfLines={1} style={styles.textHeaderTitle}>
          {defaultOutlet?.name}
        </Text>
        <Image style={styles.iconArrowDown} source={appConfig.iconArrowDown} />
      </TouchableOpacity>
    );
  };

  const renderText = () => {
    return (
      <View style={styles.viewBodyText}>
        <Text style={styles.textBody}>What would you like to eat?</Text>
      </View>
    );
  };

  const renderSearch = () => {
    const replacePlaceholder =
      searchQuery && `search result for "${searchQuery}"`;
    return (
      <FieldSearch
        value={searchTextInput}
        onChange={value => {
          setSearchTextInput(value);
        }}
        placeholder="Try to search “toast”"
        replacePlaceholder={replacePlaceholder}
        onSubmit={value => {
          handleSearchProduct(value);
        }}
      />
    );
  };

  const renderProducts = () => {
    if (searchQuery) {
      return <ProductSearchList basket={basket} products={productsSearch} />;
    } else {
      return <ProductPresetList basket={basket} products={products} />;
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

  const renderHeader = () => {
    return (
      <View>
        <ScrollView
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          <Header customTitle={renderHeaderTitle()} />
          <View style={styles.viewTextAndSearch}>
            {renderText()}
            {renderSearch()}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderBody = () => {
    return <View style={styles.body}>{renderProducts()}</View>;
  };

  const renderFooter = () => {
    return <View style={styles.footer}>{renderButtonCart()}</View>;
  };

  const renderModal = () => {
    return (
      <OrderingTypeSelectorModal
        value={basket?.orderingMode || orderingMode}
        open={!basket?.orderingMode && !orderingMode}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={handleLoading()} />
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
      {renderModal()}
    </SafeAreaView>
  );
};

export default OrderHere;

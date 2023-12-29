/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import Header from '../components/layout/header';
import FieldSearch from '../components/fieldSearch';
import LoadingScreen from '../components/loadingScreen';
import ProductSearchList from '../components/productSearchList';

import {
  getProductByOutlet,
  getProductBySearch,
} from '../actions/product.action';
import {getBasket} from '../actions/order.action';

import Theme from '../theme';
import ProductPresetList from '../components/productPresetList/ProductPresetList';
import {Body} from '../components/layout';
import useSettings from '../hooks/settings/useSettings';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';
import {navigate} from '../utils/navigation.utils';

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
    textHeader: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
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
    textCancel: {
      marginLeft: 10,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
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
    viewSearch: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
  const ref = useRef();
  const styles = useStyles();
  const dispatch = useDispatch();

  const [searchTextInput, setSearchTextInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productsSearch, setProductsSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isSearchOnFocus, setIsSearchOnFocus] = useState(false);
  const {useCartVersion} = useSettings();
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const products = useSelector(
    state => state.productReducer.productsOutlet.data,
  );

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
    setSearchQuery(value);
  };

  const handleLoading = () => {
    if (isLoading && searchQuery) {
      return true;
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    ref.current.blur();
    setSearchTextInput('');
    setSearchQuery('');
    setIsSearchOnFocus(false);
    handleSearchProduct('');
  };

  const renderText = () => {
    return (
      <View style={styles.viewBodyText}>
        <Text style={styles.textBody}>What would you like to eat?</Text>
      </View>
    );
  };

  const renderSearchCancel = () => {
    if (isSearchOnFocus) {
      return (
        <Text
          onPress={() => {
            handleCancel();
          }}
          style={styles.textCancel}>
          Cancel
        </Text>
      );
    }
  };

  const renderSearchField = () => {
    const replacePlaceholder =
      searchQuery && `search result for "${searchQuery}"`;

    return (
      <FieldSearch
        customRef={ref}
        value={searchTextInput}
        onChange={value => {
          setSearchTextInput(value);
        }}
        placeholder="Try to search “toast”"
        replacePlaceholder={replacePlaceholder}
        onSubmit={value => {
          handleSearchProduct(value);
        }}
        onRemove={() => {
          setSearchTextInput('');
        }}
        onFocus={() => {
          setIsSearchOnFocus(true);
        }}
        onBlur={() => {
          if (!searchTextInput) {
            setIsSearchOnFocus(false);
          }
        }}
      />
    );
  };

  const renderSearch = () => {
    return (
      <View style={styles.viewSearch}>
        {renderSearchField()}
        {renderSearchCancel()}
      </View>
    );
  };

  const renderProducts = () => {
    if (searchQuery) {
      return <ProductSearchList basket={basket} products={productsSearch} />;
    } else {
      return <ProductPresetList basket={basket} products={products} />;
    }
  };

  const renderHeaderTitle = () => {
    return (
      <TouchableOpacity
        disabled
        onPress={() => {
          navigate('store');
        }}>
        <Text style={styles.textHeader}>{defaultOutlet?.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
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
    return <ButtonCartFloating />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={handleLoading()} />
      <Body>
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </Body>
    </SafeAreaView>
  );
};

export default OrderHere;

import React, {useCallback, useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import appConfig from '../config/appConfig';

import {getProductEStoreByOutlet} from '../actions/product.action';
import {getBasket} from '../actions/order.action'

import EStoreList from '../components/eStoreList';
import {Header} from '../components/layout';

import {isEmptyArray} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import Theme from '../theme';
import useSettings from '../hooks/settings/useSettings';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    footer: {
      position: 'absolute',
      bottom: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    icon: {
      width: 18,
      height: 18,
      marginRight: 7,
      color: theme.colors.text4,
    },
    textTitle: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDescription: {
      marginVertical: 16,
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textButtonCart: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    viewTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      paddingVertical: 8,
      paddingHorizontal: 32,
      backgroundColor: '#C0EADE',
    },
    viewIconAndTextCart: {
      display: 'flex',
      flexDirection: 'row',
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
  });

  return styles;
};

const EStore = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const {useCartVersion} = useSettings();
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const products = useSelector(
    state => state.productReducer?.productsEStoreOutlet?.products,
  );

  const loadData = useCallback(async () => {
    await dispatch(getProductEStoreByOutlet(defaultOutlet.id));
    await dispatch(getBasket());
  }, [dispatch, defaultOutlet]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefresh(true);
    await loadData();
    setRefresh(false);
  };

  const renderTextEStore = () => {
    return (
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>E - Store</Text>
      </View>
    );
  };

  const renderTextDescription = () => {
    return (
      <Text style={styles.textDescription}>
        Get Fun Toast merchandises here
      </Text>
    );
  };

  const renderButtonCart = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <TouchableOpacity
          style={styles.viewButtonCart}
          onPress={useCartVersion}>
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header customTitle={renderTextEStore()} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              handleRefresh();
            }}
          />
        }>
        {renderTextDescription()}
        <EStoreList products={products} basket={basket} />
        <View style={styles.footer}>{renderButtonCart()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EStore;

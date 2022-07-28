import React, {useCallback, useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';

import appConfig from '../config/appConfig';

import {getBasket, getProductEStoreByOutlet} from '../actions/product.action';

import EStoreList from '../components/eStoreList';

import {isEmptyArray} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import Theme from '../theme';

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
      marginBottom: 16,
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
      marginVertical: 16,
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

  return (
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
      {renderTextEStore()}
      {renderTextDescription()}
      <EStoreList products={products} basket={basket} />
      <View style={styles.footer}>{renderButtonCart()}</View>
    </ScrollView>
  );
};

export default EStore;

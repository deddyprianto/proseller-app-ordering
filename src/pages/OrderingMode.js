import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import {dataStores} from '../actions/stores.action';
import {Body, Header} from '../components/layout';
import Theme from '../theme/Theme';
import OrderingModeList from '../components/orderingModeList/OrderingModeList';
import {getAllowedOrder} from '../actions/setting.action';
import appConfig from '../config/appConfig';
import {changeOrderingMode, getTimeslot} from '../actions/order.action';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';
import {navigate} from '../utils/navigation.utils';
const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
    },
    body: {
      flex: 1,
    },
    bottom: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    viewButton: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    viewButtonDisabled: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
    text: {
      margin: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const OrderingMode = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [orderingTypes, setOrderingTypes] = useState([]);
  const [estimatedWaitingTimes, setEstimatedWaitingTimes] = useState({});

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const orderSetting = useSelector(
    state => state.settingReducer?.allowedOrder?.settingValue,
  );

  const orderingModeSelected = useSelector(
    state => state.orderReducer.dataOrderingMode.orderingMode,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllowedOrder());
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      const orderingModesField = [
        {
          key: 'STOREPICKUP',
          isEnabledFieldName: 'enableStorePickUp',
          displayName: defaultOutlet.storePickUpName || 'Store Pick Up',
          image: appConfig.iconOrderingModeStorePickUp,
        },
        {
          key: 'DELIVERY',
          isEnabledFieldName: 'enableDelivery',
          displayName: defaultOutlet.deliveryName || 'Delivery',
          image: appConfig.iconOrderingModeDelivery,
        },
        {
          key: 'TAKEAWAY',
          isEnabledFieldName: 'enableTakeAway',
          displayName: defaultOutlet.takeAwayName || 'Take Away',
          image: appConfig.iconOrderingModeTakeAway,
        },
        {
          key: 'DINEIN',
          isEnabledFieldName: 'enableDineIn',
          displayName: defaultOutlet.dineInName || 'Dine In',
          image: appConfig.iconOrderingModeStorePickUp,
        },
        {
          key: 'STORECHECKOUT',
          isEnabledFieldName: 'enableStoreCheckOut',
          displayName: defaultOutlet.storeCheckOutName || 'Store Checkout',
          image: appConfig.iconOrderingModeStorePickUp,
        },
      ];

      const orderingModesFieldFiltered = orderingModesField.filter(mode => {
        if (
          defaultOutlet[mode.isEnabledFieldName] &&
          orderSetting?.includes(mode.key)
        ) {
          return mode;
        }
      });

      setEstimatedWaitingTimes(defaultOutlet?.estimatedWaitingTime || {});
      setOrderingTypes(orderingModesFieldFiltered);

      if (orderingModeSelected) {
        await dispatch({
          type: 'DATA_ORDERING_MODE',
          orderingMode: orderingModeSelected,
        });
      }
    };
    loadData();
  }, [defaultOutlet, orderSetting, dispatch, orderingModeSelected]);

  const handleSaveClicked = async () => {
    setIsLoading(true);
    const date = moment().format('YYYY-MM-DD');
    const clientTimezone = Math.abs(new Date().getTimezoneOffset());
    dispatch(
      getTimeslot(
        defaultOutlet?.id,
        date,
        clientTimezone,
        orderingModeSelected,
      ),
    );
    await dispatch(
      changeOrderingMode({
        orderingMode: orderingModeSelected,
      }),
    );
    await dispatch({
      type: 'DATA_PRODUCTS_OUTLET',
      products: [],
    });
    navigate('orderHere');
    setIsLoading(false);
  };

  const renderBottom = () => {
    const isDisabled = !orderingModeSelected;
    const stylesButton = isDisabled
      ? styles.viewButtonDisabled
      : styles.viewButton;
    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          disabled={isDisabled}
          style={stylesButton}
          onPress={() => {
            handleSaveClicked();
          }}>
          <Text style={styles.textButton}>Start Order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header title="Choose Ordering Mode" />
      <Body style={styles.body}>
        <Text style={styles.text}>What is your preferred ordering mode</Text>
        <OrderingModeList
          orderingMode={orderingTypes}
          estimatedWaitingTime={estimatedWaitingTimes}
        />
        {renderBottom()}
      </Body>
    </SafeAreaView>
  );
};

export default OrderingMode;

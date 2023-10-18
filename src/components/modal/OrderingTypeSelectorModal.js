/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';

import appConfig from '../../config/appConfig';
import {
  changeOrderingMode,
  updateOrderingMode,
} from '../../actions/order.action';

import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import Theme from '../../theme';
import LoadingScreen from '../loadingScreen';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {getAllowedOrder} from '../../actions/setting.action';
import {getOutletById} from '../../actions/stores.action';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      borderRadius: 8,
    },
    header: {
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      marginVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    footer: {
      padding: 10,
    },
    textName: {
      textAlign: 'center',
      marginLeft: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    textCurrency: {
      fontSize: 8,
      color: theme.colors.textTertiary,
    },
    textPriceSelected: {
      fontSize: 12,
      color: theme.colors.textQuaternary,
    },
    textCurrencySelected: {
      fontSize: 8,
      color: theme.colors.textQuaternary,
    },
    textPriceDisabled: {
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    textCurrencyDisabled: {
      fontSize: 8,
      color: theme.colors.textTertiary,
    },
    textSave: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    textDeliveryTermsAndConditions: {
      marginTop: 16,
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDeliveryTermsAndConditionsBold: {
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textChooseOrderingType: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    touchableItem: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.textQuaternary,
    },
    touchableItemSelected: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.textQuaternary,
      backgroundColor: theme.colors.accent,
    },
    touchableItemBody: {
      display: 'flex',
      flexDirection: 'row',
    },
    touchableItemFooter: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 16,
    },
    touchableSave: {
      paddingVertical: 10,
      backgroundColor: theme.colors.textQuaternary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    touchableClose: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    viewTextNameAndPrice: {
      display: 'flex',
      flexDirection: 'row',
    },
    circle: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      backgroundColor: theme.colors.greyScale4,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
    image: {
      tintColor: theme.colors.textQuaternary,
    },
    imageClose: {
      height: 22,
      width: 22,
    },
  });
  return styles;
};

const OrderingTypeSelectorModal = ({
  open,
  handleClose,
  handleSaveCustom,
  value,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({});
  const [orderingTypes, setOrderingTypes] = useState([]);
  const [estimatedWaitingTimes, setEstimatedWaitingTimes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const outlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const orderSetting = useSelector(
    state => state.settingReducer?.allowedOrder?.settingValue,
  );

  //root cause of bug
  // useEffect(() => {
  //   if (open) {
  //     dispatch(getAllowedOrder(dispatch));
  //     dispatch(getOutletById(outlet.id));
  //   }
  // }, [dispatch, open, outlet.id]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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

      if (value) {
        setSelected({key: value});
      }

      if (orderingModesFieldFiltered.length === 1) {
        await dispatch(
          changeOrderingMode({
            orderingMode: orderingModesFieldFiltered[0]?.key,
          }),
        );
      }

      setIsLoading(false);
    };
    loadData();
  }, [defaultOutlet, value, orderSetting, open]);

  const handleSaveClicked = async () => {
    setIsLoading(true);
    if (selected?.key === 'DELIVERY') {
      dispatch(updateOrderingMode(selected?.key));
    } else {
      await dispatch(changeOrderingMode({orderingMode: selected?.key}));
    }
    if (handleSaveCustom) {
      handleSaveCustom();
    }
    setIsLoading(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textChooseOrderingType}>Choose Ordering Type</Text>
        <TouchableOpacity style={styles.touchableClose} onPress={handleClose}>
          <Image source={appConfig.iconClose} style={styles.imageClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEstimatedWaitingTime = mode => {
    if (!isEmptyObject(estimatedWaitingTimes)) {
      const estimatedWaitingTime = estimatedWaitingTimes[mode];
      return estimatedWaitingTime;
    } else {
      return '';
    }
  };

  const renderOrderingTypeItemFooter = item => {
    const minAmount = defaultOutlet.orderValidation?.delivery?.minAmount;
    const minAmountCurrency = CurrencyFormatter(minAmount);

    if (item.key === 'DELIVERY' && minAmount) {
      return (
        <View style={styles.touchableItemFooter}>
          <View style={styles.divider} />

          <Text style={styles.textDeliveryTermsAndConditions}>
            Minimum amount for delivery{' '}
            <Text style={styles.textDeliveryTermsAndConditionsBold}>
              {minAmountCurrency}
            </Text>
          </Text>
        </View>
      );
    }
  };

  const renderOrderingTypeItem = item => {
    const active = selected?.key === item?.key;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <View style={styles.touchableItemBody}>
          <Image source={item?.image} style={styles.image} />
          <Text style={styles.textName}>
            {item?.displayName} {renderEstimatedWaitingTime(item?.key)}
          </Text>
        </View>

        {renderOrderingTypeItemFooter(item)}
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    const result = orderingTypes.map(type => {
      return renderOrderingTypeItem(type);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderFooter = () => {
    const disabled = isEmptyObject(selected) || isEmptyArray(orderingTypes);
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchableSave}
          disabled={disabled}
          onPress={() => {
            handleSaveClicked();
          }}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal transparent visible={open}>
      <Provider>
        <Portal>
          <Dialog visible={open} style={styles.root} dismissable={false}>
            <LoadingScreen loading={isLoading} />
            {renderHeader()}
            <View style={styles.divider} />
            {renderBody()}
            <View style={styles.divider} />
            {renderFooter()}
          </Dialog>
        </Portal>
      </Provider>
    </Modal>
  );
};

export default OrderingTypeSelectorModal;

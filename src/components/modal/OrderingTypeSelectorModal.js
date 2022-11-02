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
import {changeOrderingMode} from '../../actions/order.action';

import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import Theme from '../../theme';
import LoadingScreen from '../loadingScreen';

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
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    footer: {
      paddingHorizontal: 35,
    },
    textName: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    textNameSelected: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 12,
      color: theme.colors.textQuaternary,
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
    textSave: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    textChooseOrderingType: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    touchableItem: {
      width: 81,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 10,
      margin: 6,
      borderColor: theme.colors.greyScale2,
    },
    touchableItemSelected: {
      width: 81,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 10,
      margin: 6,
      borderColor: theme.colors.textQuaternary,
    },
    touchableSave: {
      paddingVertical: 10,
      backgroundColor: theme.colors.textQuaternary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
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
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale3,
    },
    imageSelected: {
      tintColor: theme.colors.textQuaternary,
    },
    image: {
      tintColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const OrderingTypeSelectorModal = ({open, handleClose, value}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({});
  const [orderingTypes, setOrderingTypes] = useState([]);
  const [estimatedWaitingTimes, setEstimatedWaitingTimes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  useEffect(() => {
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
      if (defaultOutlet[mode.isEnabledFieldName]) {
        return mode;
      }
    });

    setEstimatedWaitingTimes(defaultOutlet?.estimatedWaitingTime || {});
    setOrderingTypes(orderingModesFieldFiltered);
    const currentOrderingMode = value || '';
    setSelected({key: currentOrderingMode});
  }, [defaultOutlet, value]);

  const handleSave = async () => {
    setIsLoading(true);
    await dispatch(changeOrderingMode({orderingMode: selected?.key}));
    setIsLoading(false);
    if (handleClose) {
      handleClose();
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textChooseOrderingType}>Choose Ordering Type</Text>
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

  const renderOrderingTypeItem = item => {
    const active = selected?.key === item?.key;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;
    const styleName = active ? styles.textNameSelected : styles.textName;
    const styleImage = active ? styles.imageSelected : styles.image;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <View style={styles.circle}>
          <Image source={item?.image} style={styleImage} />
        </View>
        <Text style={styleName}>
          {item?.displayName} {renderEstimatedWaitingTime(item?.key)}
        </Text>
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
            handleSave();
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
    <Modal transparent visible={open} onDismiss={handleClose}>
      <Provider>
        <Portal>
          <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
            <LoadingScreen loading={isLoading} />
            {renderHeader()}
            <View style={styles.divider} />
            <View style={{marginTop: 20}} />
            {renderBody()}
            <View style={{marginTop: 16}} />
            {renderFooter()}
            <View style={{marginTop: 16}} />
          </Dialog>
        </Portal>
      </Provider>
    </Modal>
  );
};

export default OrderingTypeSelectorModal;

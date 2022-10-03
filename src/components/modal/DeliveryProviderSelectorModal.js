/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import {getDeliveryProviderAndFee} from '../../actions/order.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {changeOrderingMode} from '../../actions/order.action';
import Theme from '../../theme';
import LoadingScreen from '../loadingScreen';

const useStyles = () => {
  const theme = Theme();
  const styles = {
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
      fontSize: 12,
      color: '#B7B7B7',
    },
    textPrice: {
      fontSize: 12,
      color: '#B7B7B7',
    },
    textCurrency: {
      fontSize: 8,
      color: '#B7B7B7',
    },
    textNameSelected: {
      fontSize: 12,
      color: colorConfig.primaryColor,
    },
    textPriceSelected: {
      fontSize: 12,
      color: colorConfig.primaryColor,
    },
    textCurrencySelected: {
      fontSize: 8,
      color: colorConfig.primaryColor,
    },
    textSave: {
      color: 'white',
      fontSize: 12,
    },
    textChooseDeliveryProvider: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    touchableItem: {
      width: 81,
      height: 83,
      borderWidth: 1,
      borderColor: '#B7B7B7',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      margin: 6,
    },
    touchableItemSelected: {
      width: 81,
      height: 83,
      borderWidth: 1,
      borderColor: colorConfig.primaryColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      margin: 6,
    },
    touchableSave: {
      paddingVertical: 10,
      backgroundColor: colorConfig.primaryColor,
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
      backgroundColor: '#F9F9F9',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    divider: {
      borderTopWidth: 1,
      borderTopColor: '#D6D6D6',
    },
  };
  return styles;
};

const DeliveryProviderSelectorModal = ({open, handleClose, value}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState({});
  const [deliveryProviders, setDeliveryProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  useEffect(() => {
    const loadData = async () => {
      const userDecrypt = CryptoJS.AES.decrypt(
        userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

      const deliveryAddressDefault = user?.deliveryAddress.find(
        address => address.isDefault,
      );

      const deliveryAddress = user?.selectedAddress || deliveryAddressDefault;
      const cartId = basket?.cartID;
      const outletId = basket?.outlet?.id;

      const payload = {
        deliveryAddress,
        outletId,
        cartID: cartId,
      };

      const result = await dispatch(getDeliveryProviderAndFee(payload));

      if (result?.data) {
        setDeliveryProviders(result?.data?.dataProvider);
      }
      const currentProvider = value || {};
      setSelected(currentProvider);
    };

    loadData();
  }, [userDetail]);

  const HandleSave = async () => {
    setIsLoading(true);
    await dispatch(
      changeOrderingMode({
        orderingMode: basket?.orderingMode,
        provider: selected,
      }),
    );
    setIsLoading(false);
    handleClose();
  };

  const deliveryProviderItem = item => {
    const active = selected?.id === item?.id;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;
    const styleName = active ? styles.textNameSelected : styles.textName;
    const stylePrice = active ? styles.textPriceSelected : styles.textPrice;
    const styleCurrency = active ? styles.textPriceSelected : styles.textPrice;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <View style={styles.circle}>
          <View style={styles.viewTextNameAndPrice}>
            <Text style={stylePrice}>{item?.deliveryFee}</Text>
            <Text style={styleCurrency}>SGD</Text>
          </View>
        </View>
        <View style={{marginTop: 8}} />
        <Text numberOfLines={1} style={styleName}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textChooseDeliveryProvider}>
          Choose Delivery Provider
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    const result = deliveryProviders.map(test => {
      return deliveryProviderItem(test);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchableSave}
          onPress={() => {
            HandleSave();
          }}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
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
  );
};

export default DeliveryProviderSelectorModal;

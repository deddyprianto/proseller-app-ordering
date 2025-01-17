/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';

import {Dialog, Portal, Provider} from 'react-native-paper';
import {
  resetSelectedCustomFiled,
  updateProvider,
} from '../../actions/order.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {changeOrderingMode} from '../../actions/order.action';
import Theme from '../../theme';
import LoadingScreen from '../loadingScreen';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import appConfig from '../../config/appConfig';
import {isEmptyObject} from '../../helper/CheckEmpty';
import usePayment from '../../hooks/payment/usePayment';
import useDate from '../../hooks/formatDate/useDate';
import additionalSetting from '../../config/additionalSettings';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      maxHeight: (HEIGHT * 70) / 100,
      borderRadius: 8,
    },
    header: {
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    footer: {
      padding: 10,
    },
    textName: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPrice: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textNameDisabled: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceDisabled: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textNameSelected: {
      flex: 1,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceSelected: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textSave: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textChooseDeliveryProvider: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDeliveryError: {
      marginTop: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDeliveryTermsAndConditions: {
      marginTop: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDeliveryTermsAndConditionsBold: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    viewTextNameAndPrice: {
      display: 'flex',
      flexDirection: 'row',
    },
    touchableItemBody: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    touchableItemBodyImageAndText: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    touchableItemFooter: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 16,
    },
    touchableItem: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.brandPrimary,
    },
    touchableItemSelected: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.brandPrimary,
      backgroundColor: theme.colors.accent,
    },
    touchableItemDisabled: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.greyScale2,
    },
    touchableSave: {
      paddingVertical: 10,
      backgroundColor: theme.colors.buttonActive,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    touchableSaveDisabled: {
      paddingVertical: 10,
      backgroundColor: theme.colors.buttonDisabled,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    touchableClose: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    divider: {
      height: 1,
      backgroundColor: '#D6D6D6',
    },
    image: {
      marginRight: 8,
      height: 18,
      width: 18,
      tintColor: theme.colors.brandPrimary,
    },
    imageDisabled: {
      marginRight: 8,
      height: 18,
      width: 18,
      tintColor: theme.colors.greyScale2,
    },
    imageClose: {
      height: 22,
      width: 22,
    },
  });
  return styles;
};

const DeliveryProviderSelectorModal = ({open, handleClose, value}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({});
  const [deliveryProviders, setDeliveryProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    getDeliveryProviderFee,
    autoSelectDeliveryType,
    isLoading: isLoadingAutoSelect,
  } = usePayment();

  const {convertOrderActionDate} = useDate();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );
  const orderingDate = useSelector(
    state =>
      state.orderReducer?.orderingDateTime?.orderingDateTimeSelected?.date,
  );
  const loadData = async () => {
    setIsLoading(true);
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
    let dateConvert = convertOrderActionDate(orderingDate);
    const result = await getDeliveryProviderFee(dateConvert, payload, true);
    if (result?.data) {
      setDeliveryProviders(result?.data?.dataProvider);
    }

    const currentProvider = !isEmptyObject(value) ? value : {};
    setSelected(currentProvider);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const handleSave = async () => {
    setIsLoading(true);
    await dispatch(resetSelectedCustomFiled());
    if (!selected?.actionRequired) {
      await dispatch(
        changeOrderingMode({
          orderingMode: basket?.orderingMode,
          provider: selected,
        }),
      );
    } else {
      const customField = selected?.customFields?.[0];
      if (customField?.options?.length === 1) {
        //eksekusi
        autoSelectDeliveryType(selected, orderingDate);
      }
      await dispatch(updateProvider(selected));
    }

    setIsLoading(false);
    handleClose();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textChooseDeliveryProvider}>
          Choose Delivery Provider
        </Text>
        <TouchableOpacity style={styles.touchableClose} onPress={handleClose}>
          <Image source={appConfig.iconClose} style={styles.imageClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryProviderItemFooter = item => {
    if (item?.minPurchaseForFreeDelivery) {
      const minPurchaseForFreeDelivery =
        item?.minPurchaseForFreeDelivery &&
        CurrencyFormatter(Number(item?.minPurchaseForFreeDelivery));

      const maxFreeDeliveryAmount =
        item?.maxFreeDeliveryAmount &&
        CurrencyFormatter(Number(item?.maxFreeDeliveryAmount));

      return (
        <View style={styles.touchableItemFooter}>
          <View style={styles.divider} />

          <Text style={styles.textDeliveryTermsAndConditions}>
            Spend{' '}
            <Text style={styles.textDeliveryTermsAndConditionsBold}>
              {minPurchaseForFreeDelivery}
            </Text>{' '}
            or more and receive an{' '}
            <Text style={styles.textDeliveryTermsAndConditionsBold}>
              {maxFreeDeliveryAmount}
            </Text>{' '}
            delivery fee discount!
          </Text>
        </View>
      );
    }
  };

  const renderDeliveryProviderItemFooterForFree = item => {
    if (item?.minPurchaseForFreeDelivery) {
      const minPurchaseForFreeDelivery = CurrencyFormatter(
        Number(item?.minPurchaseForFreeDelivery),
      );

      return (
        <View style={styles.touchableItemFooter}>
          <View style={styles.divider} />

          <Text style={styles.textDeliveryTermsAndConditions}>
            Spend{' '}
            <Text style={styles.textDeliveryTermsAndConditionsBold}>
              {minPurchaseForFreeDelivery}
            </Text>{' '}
            and receive{' '}
            <Text style={styles.textDeliveryTermsAndConditionsBold}>
              FREE DELIVERY!
            </Text>
          </Text>
        </View>
      );
    }
  };
  const renderDeliveryProviderItemBody = item => {
    return (
      <View style={styles.touchableItemBody}>
        <View style={styles.touchableItemBodyImageAndText}>
          <Image source={appConfig.iconDeliveryProvider} style={styles.image} />
          <Text style={styles.textName} numberOfLines={1}>
            {item?.name}
          </Text>
        </View>
        {item?.deliveryFee > 0 ? (
          <Text style={styles.textPrice}>
            {CurrencyFormatter(item?.deliveryFee)}
          </Text>
        ) : (
          <Text style={styles.textPrice}>-</Text>
        )}
      </View>
    );
  };

  const renderDeliveryProviderItem = item => {
    const maxFreeDeliveryAmount = Number(item.maxFreeDeliveryAmount);

    const active = selected?.id === item?.id;

    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;

    const footer = maxFreeDeliveryAmount
      ? renderDeliveryProviderItemFooter(item)
      : renderDeliveryProviderItemFooterForFree(item);

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        {renderDeliveryProviderItemBody(item)}
        {renderDeliveryProviderItemDisabledFooter(item, true)}

        {footer}
      </TouchableOpacity>
    );
  };
  const renderDeliveryProviderItemDisabledFooter = item => {
    if (item.deliveryProviderError?.message) {
      return (
        <View style={styles.touchableItemFooter}>
          <View style={styles.divider} />
          <Text style={styles.textDeliveryError}>
            {item.deliveryProviderError?.message}
          </Text>
        </View>
      );
    }
  };

  const renderDeliveryProviderItemDisabledBody = item => {
    return (
      <View style={styles.touchableItemBody}>
        <View style={styles.touchableItemBodyImageAndText}>
          <Image
            source={appConfig.iconDeliveryProvider}
            style={styles.imageDisabled}
          />
          <Text style={styles.textNameDisabled} numberOfLines={1}>
            {item?.name}
          </Text>
        </View>
        <Text style={styles.textPriceDisabled}>
          {CurrencyFormatter(item?.grossAmount)}
        </Text>
      </View>
    );
  };

  const renderDeliveryProviderItemDisabled = item => {
    return (
      <TouchableOpacity
        disabled
        style={styles.touchableItemDisabled}
        onPress={() => {
          setSelected(item);
        }}>
        {renderDeliveryProviderItemDisabledBody(item)}
        {renderDeliveryProviderItemDisabledFooter(item)}
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    const result = deliveryProviders.map(item => {
      if (item.deliveryProviderError.status && !item.actionRequired) {
        return renderDeliveryProviderItemDisabled(item);
      } else {
        return renderDeliveryProviderItem(item);
      }
    });

    return (
      <ScrollView contentContainerStyle={styles.body}>{result}</ScrollView>
    );
  };

  const renderFooter = () => {
    const isDisabled = isEmptyObject(selected);
    const stylesButton = isDisabled
      ? styles.touchableSaveDisabled
      : styles.touchableSave;

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={isDisabled}
          style={stylesButton}
          onPress={() => {
            handleSave();
          }}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      {additionalSetting()?.isAutoSelectDeliveryProviderType && (
        <LoadingScreen loading={isLoadingAutoSelect} />
      )}
      <Modal transparent visible={open} onDismiss={handleClose}>
        <Provider>
          <Portal>
            <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
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
    </>
  );
};

export default DeliveryProviderSelectorModal;

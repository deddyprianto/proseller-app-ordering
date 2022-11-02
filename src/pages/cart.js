/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';
import moment from 'moment';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import appConfig from '../config/appConfig';
import awsConfig from '../config/awsConfig';

import ProductCartList from '../components/productCartList/ProductCartList';
import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';
import DeliveryProviderSelectorModal from '../components/modal/DeliveryProviderSelectorModal';
import DateSelectorModal from '../components/modal/DateSelectorModal';
import Header from '../components/layout/header';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import currencyFormatter from '../helper/CurrencyFormatter';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import {showSnackbar} from '../actions/setting.action';
import {changeOrderingMode, getTimeSlot} from '../actions/order.action';
import Theme from '../theme';
import LoadingScreen from '../components/loadingScreen';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    textDetail: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDetailValue: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textGrandTotal: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textGrandTotalValue: {
      paddingTop: 4,
      marginRight: 4,
      color: theme.colors.primary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailGrandTotal: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDetailGrandTotalValue: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textCheckoutButton: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMethod: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMethodValue: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddButton: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailHeader: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDeliveryAddressBody: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOrderingTypeBody: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewDetailValueItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    viewDetailGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    viewCheckoutButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      padding: 16,
      borderTopColor: theme.colors.greyScale4,
    },
    viewFooter: {
      backgroundColor: 'white',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      marginTop: -8,
    },
    viewMethod: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 1,
    },
    viewMethodOrderingType: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 1,
    },
    viewMethodDeliveryAddress: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 1,
    },
    viewOrderingTypeHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    viewOrderingTypeBody: {
      flex: 1,
      borderTopWidth: 1,
      marginTop: 16,
      paddingTop: 16,
      borderColor: theme.colors.border,
    },
    viewDeliveryAddressHeader: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    viewDeliveryAddressBody: {
      flex: 1,
      borderTopWidth: 1,
      marginTop: 16,
      paddingTop: 16,
      borderColor: theme.colors.border,
    },
    viewAddButton: {
      margin: 16,
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: theme.colors.primary,
    },
    viewGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewDetailValue: {
      paddingHorizontal: 16,
    },
    viewDetailHeader: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    touchableMethod: {
      width: 120,
      borderRadius: 8,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    touchableCheckoutButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 26,
      backgroundColor: theme.colors.primary,
    },
    touchableCheckoutButtonDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 26,
      backgroundColor: theme.colors.buttonDisabled,
    },
    touchableIconClose: {
      position: 'absolute',
      right: 20,
    },
    divider: {
      height: 1,
      flex: 1,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.border,
    },
    iconArrowUp: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      tintColor: theme.colors.primary,
    },
    iconClose: {
      width: 16,
      height: 16,
    },
  });
  return styles;
};

const Cart = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [seeDetail, setSeeDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderingTypeModal, setOpenOrderingTypeModal] = useState(false);
  const [openDeliveryDateModal, setOpenDeliveryDateModal] = useState(false);
  const [openDeliveryProviderModal, setOpenDeliveryProviderModal] = useState(
    false,
  );

  const [deliveryAddress, setDeliveryAddress] = useState({});

  const outlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const orderingDateTimeSelected = useSelector(
    state => state.orderReducer?.orderingDateTime?.orderingDateTimeSelected,
  );
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  useEffect(() => {
    const loadData = async () => {
      const clientTimezone = Math.abs(new Date().getTimezoneOffset());
      const date = moment().format('YYYY-MM-DD');

      const timeSlot = await dispatch(
        getTimeSlot({
          outletId: outlet.id,
          date,
          clientTimezone,
          orderingMode: basket.orderingMode,
        }),
      );

      setAvailableTimes(timeSlot);
    };
    loadData();
  }, [dispatch, basket, outlet]);

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );

    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));
    const deliveryAddressDefault = result?.deliveryAddress?.find(
      address => address.isDefault,
    );
    const address = !isEmptyObject(result?.selectedAddress)
      ? result?.selectedAddress
      : deliveryAddressDefault;

    setDeliveryAddress(address);
  }, [userDetail]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const orderingModesField = [
        {
          key: 'STOREPICKUP',
          isEnabledFieldName: 'enableStorePickUp',
          displayName: outlet.storePickUpName || 'Store Pick Up',
        },
        {
          key: 'DELIVERY',
          isEnabledFieldName: 'enableDelivery',
          displayName: outlet.deliveryName || 'Delivery',
        },
        {
          key: 'TAKEAWAY',
          isEnabledFieldName: 'enableTakeAway',
          displayName: outlet.takeAwayName || 'Take Away',
        },
        {
          key: 'DINEIN',
          isEnabledFieldName: 'enableDineIn',
          displayName: outlet.dineInName || 'Dine In',
        },
        {
          key: 'STORECHECKOUT',
          isEnabledFieldName: 'enableStoreCheckOut',
          displayName: outlet.storeCheckOutName || 'Store Checkout',
        },
      ];

      const orderingModesFieldFiltered = orderingModesField.filter(mode => {
        if (outlet[mode.isEnabledFieldName]) {
          return mode;
        }
      });

      if (orderingModesFieldFiltered?.length === 1 && !basket?.orderingMode) {
        await dispatch(
          changeOrderingMode({
            orderingMode: orderingModesFieldFiltered[0]?.key,
          }),
        );
      }

      setIsLoading(false);
    };

    loadData();
  }, [outlet, basket, dispatch]);

  const handleOpenOrderingTypeModal = () => {
    setOpenOrderingTypeModal(true);
    setSeeDetail(false);
  };
  const handleCloseOrderingTypeModal = () => {
    setOpenOrderingTypeModal(false);
  };

  const handleOpenDeliveryDateModal = () => {
    setOpenDeliveryDateModal(true);
    setSeeDetail(false);
  };
  const handleCloseDeliveryDateModal = () => {
    setOpenDeliveryDateModal(false);
  };

  const handleOpenDeliveryProviderModal = () => {
    setOpenDeliveryProviderModal(true);
    setSeeDetail(false);
  };
  const handleCloseDeliveryProviderModal = () => {
    setOpenDeliveryProviderModal(false);
  };

  const handleOpenDetail = () => {
    setSeeDetail(true);
    setOpenOrderingTypeModal(false);
    setOpenDeliveryDateModal(false);
    setOpenDeliveryProviderModal(false);
  };

  const handleCloseDetail = () => {
    setSeeDetail(false);
  };

  const renderPaymentGrandTotal = () => {
    if (basket?.totalNettAmount) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleOpenDetail();
          }}>
          <Text style={styles.textGrandTotal}>Grand Total</Text>
          <View style={styles.viewGrandTotal}>
            <Text style={styles.textGrandTotalValue}>
              {currencyFormatter(basket?.totalNettAmount)}
            </Text>

            <Image source={appConfig.iconArrowUp} style={styles.iconArrowUp} />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const handleDisabledPaymentButton = value => {
    const isActiveDelivery = isEmptyArray(availableTimes)
      ? !!deliveryAddress && !!basket?.provider
      : !!deliveryAddress && !!basket?.provider && !!orderingDateTimeSelected;

    const isActivePickUp = isEmptyArray(availableTimes)
      ? !orderingDateTimeSelected
      : !!orderingDateTimeSelected;

    const isActiveTakeAway = isEmptyArray(availableTimes)
      ? !orderingDateTimeSelected
      : !!orderingDateTimeSelected;

    switch (value) {
      case 'DELIVERY':
        if (isActiveDelivery) {
          return false;
        } else {
          return true;
        }

      case 'STOREPICKUP':
        if (isActivePickUp) {
          return false;
        } else {
          return true;
        }

      case 'DINEIN':
        return false;

      case 'STORECHECKOUT':
        return false;

      case 'TAKEAWAY':
        if (isActiveTakeAway) {
          return false;
        } else {
          return true;
        }

      default:
        return true;
    }
  };

  const handleIsPassValidationOrder = async value => {
    try {
      let store = value;
      const orderType = basket?.orderingMode;
      if (!store.orderValidation) {
        return true;
      } else {
        if (orderType === 'TAKEAWAY') {
          store.orderValidation[orderType] = store.orderValidation.takeAway;
        } else if (orderType === 'DINEIN') {
          store.orderValidation[orderType] = store.orderValidation.dineIn;
        } else if (orderType === 'DELIVERY') {
          store.orderValidation[orderType] = store.orderValidation.delivery;
        }

        const {dataBasket} = this.props;
        let totalQty = 0;
        let totalAmount = 0;

        await dataBasket?.details?.map(item => {
          totalQty += item.quantity;
          totalAmount += item.grossAmount;
        });

        if (!store.orderValidation[orderType]) {
          return true;
        }

        const maxAmount = store?.orderValidation[orderType]?.maxAmount || 0;
        const minAmount = store?.orderValidation[orderType]?.minAmount || 0;
        const maxQty = store?.orderValidation[orderType]?.maxQty || 0;
        const minQty = store?.orderValidation[orderType]?.minQty || 0;

        if (maxAmount > 0) {
          if (totalAmount > maxAmount) {
            Alert.alert(
              'Sorry',
              `Maximum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(maxAmount),
            );
            return false;
          }
        }

        if (minAmount > 0) {
          if (totalAmount < minAmount) {
            Alert.alert(
              'Sorry',
              `Minimum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(minAmount),
            );
            return false;
          }
        }

        if (maxQty > 0) {
          if (totalQty > maxQty) {
            Alert.alert(
              'Sorry',
              `Maximum order quantity for ${orderType.toLowerCase()} is ` +
                maxQty,
            );
            return false;
          }
        }

        if (minQty > 0) {
          if (totalQty < minQty) {
            Alert.alert(
              'Sorry',
              `Minimum order quantity for ${orderType.toLowerCase()} is ` +
                minQty,
            );
            return false;
          }
        }
        return true;
      }
    } catch (e) {}
  };

  const handleClickButtonPayment = async () => {
    try {
      if (outlet?.orderingStatus === 'UNAVAILABLE') {
        let message = 'Ordering is not available now.';
        if (outlet?.offlineMessage) {
          message = outlet?.offlineMessage;
        }
        Alert.alert('Sorry', message);
        return;
      }

      if (!handleIsPassValidationOrder(outlet)) {
        return;
      }

      let details = [];
      // create dataPay item
      let data = {};

      basket?.details?.map((item, index) => {
        data.quantity = item.quantity;
        data.unitPrice = item.unitPrice;
        data.nettAmount = item.nettAmount;
        data.grossAmount = item.grossAmount;
        data.product = item.product;

        // if data have modifiers, then add
        if (!isEmptyArray(item.modifiers)) {
          data.modifiers = item.modifiers;
        }

        // details;
        details.push(data);
        // make data empty before push again
        data = {};
      });

      const pembayaran = {
        payment: basket?.totalNettAmount,
        totalNettAmount: basket?.totalNettAmount,
        totalGrossAmount: basket?.totalGrossAmount,
        totalDiscountAmount: basket?.totalDiscountAmount,
        totalSurchargeAmount: basket?.totalSurchargeAmount,
        exclusiveTax: basket?.exclusiveTax,
        inclusiveTax: basket?.inclusiveTax,
        storeName: basket?.outlet.name,
        details: details,
        storeId: basket?.outlet.id,
        orderingMode: basket?.orderingMode,
      };

      if (!basket?.orderingMode) {
        RBSheet.open();
        return;
      }

      pembayaran.orderingMode = basket.orderingMode;
      pembayaran.cartID = basket.cartID;

      const url = '/cart/submitAndPay';

      // for delivery order
      if (basket?.orderingMode === 'DELIVERY') {
        pembayaran.deliveryAddress = deliveryAddress;
        pembayaran.deliveryProvider = basket?.provider;
      }

      try {
        pembayaran.cartDetails = basket;
      } catch (e) {}

      try {
        if (
          basket?.orderingMode === 'DELIVERY' ||
          basket?.orderingMode === 'TAKEAWAY' ||
          basket?.orderingMode === 'STOREPICKUP'
        ) {
          if (!orderingDateTimeSelected?.date) {
            pembayaran.orderActionDate = moment().format('YYYY-MM-DD');
          } else {
            pembayaran.orderActionDate = orderingDateTimeSelected?.date;
          }

          if (!orderingDateTimeSelected?.time) {
            const hour = new Date().getHours() + 1;
            pembayaran.orderActionTime = `${hour}:00`;
          } else {
            pembayaran.orderActionTime = orderingDateTimeSelected?.time.substr(
              0,
              5,
            );
          }

          if (!orderingDateTimeSelected?.time) {
            pembayaran.orderActionTimeSlot = null;
          } else {
            pembayaran.orderActionTimeSlot = orderingDateTimeSelected?.time;
          }
        }
      } catch (e) {}

      Actions.settleOrder({
        pembayaran: pembayaran,
        url: url,
        outlet: outlet,
      });
    } catch (e) {
      await dispatch(showSnackbar({message: 'Please try again'}));
    }
  };

  const renderOrderingTypeHeader = orderingTypeValue => {
    return (
      <View style={styles.viewOrderingTypeHeader}>
        <Text style={styles.textMethod}>Ordering Type</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            handleOpenOrderingTypeModal();
          }}>
          <Text style={styles.textMethodValue}>{orderingTypeValue}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderOrderingTypeBody = orderingTypeValue => {
    if (orderingTypeValue === 'TAKEAWAY' && outlet?.address) {
      return (
        <View style={styles.viewOrderingTypeBody}>
          <Text style={styles.textOrderingTypeBody}>
            Outlet Address for Pick Up
          </Text>
          <Text style={styles.textOrderingTypeBody}>{outlet?.address}</Text>
        </View>
      );
    }
  };

  const renderOrderingType = () => {
    console.log('GILA', basket);
    const orderingType =
      typeof basket?.orderingMode === 'string' && basket?.orderingMode;

    const orderingTypeValue = orderingType || 'Choose Type';

    return (
      <View style={styles.viewMethodOrderingType}>
        {renderOrderingTypeHeader(orderingTypeValue)}
        {renderOrderingTypeBody(orderingTypeValue)}
      </View>
    );
  };

  const renderAddressHeader = deliveryAddressValue => {
    return (
      <View style={styles.viewDeliveryAddressHeader}>
        <Text style={styles.textMethod}>Delivery Address</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            Actions.myDeliveryAddress();
          }}>
          <Text style={styles.textMethodValue}>{deliveryAddressValue}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddressBody = item => {
    if (!isEmptyObject(deliveryAddress)) {
      return (
        <>
          <View style={styles.dividerValue} />
          <Text style={styles.textDeliveryAddressBody}>
            {item?.recipient?.name} - {item?.recipient?.phoneNumber}
          </Text>
          <Text style={styles.textDeliveryAddressBody}>{item?.streetName}</Text>
        </>
      );
    }
  };

  const renderAddress = () => {
    if (basket?.orderingMode === 'DELIVERY') {
      const deliveryAddressValue =
        deliveryAddress?.tagAddress || 'Choose Address';

      return (
        <View style={styles.viewMethodDeliveryAddress}>
          {renderAddressHeader(deliveryAddressValue)}
          {renderAddressBody(deliveryAddress)}
        </View>
      );
    }
  };

  const renderProvider = () => {
    if (basket?.orderingMode === 'DELIVERY') {
      const disabled = isEmptyObject(deliveryAddress);
      const deliveryProviderValue = basket?.provider?.name || 'Choose Provider';

      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Provider</Text>
          <TouchableOpacity
            style={styles.touchableMethod}
            disabled={disabled}
            onPress={() => {
              handleOpenDeliveryProviderModal();
            }}>
            <Text style={styles.textMethodValue}>{deliveryProviderValue}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderDateText = () => {
    if (orderingDateTimeSelected) {
      const date = moment(orderingDateTimeSelected?.date).format('DD/MM/YY');
      return (
        <View>
          <Text style={styles.textMethodValue}>{date}</Text>
          <Text style={styles.textMethodValue}>
            at {orderingDateTimeSelected?.time}
          </Text>
        </View>
      );
    } else {
      return <Text style={styles.textMethodValue}>Choose Date</Text>;
    }
  };

  const handleDateText = key => {
    switch (key) {
      case 'DELIVERY':
        return 'Delivery Date';
      case 'STOREPICKUP':
        return 'Pick Up Date';
      case 'TAKEAWAY':
        return 'Take Away Date';
      default:
        return 'Ordering Type Date';
    }
  };

  const renderDate = () => {
    const available = !isEmptyArray(availableTimes);
    const isDelivery = available && basket?.orderingMode === 'DELIVERY';
    const isPickUp = available && basket?.orderingMode === 'STOREPICKUP';
    const isTakeAway = available && basket?.orderingMode === 'TAKEAWAY';

    if (isDelivery || isPickUp || isTakeAway) {
      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>
            {handleDateText(basket?.orderingMode)}
          </Text>
          <TouchableOpacity
            style={styles.touchableMethod}
            onPress={() => {
              handleOpenDeliveryDateModal();
            }}>
            {renderDateText()}
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderAddButton = () => {
    return (
      <TouchableOpacity
        style={styles.viewAddButton}
        onPress={() => {
          Actions.pop();
        }}>
        <Text style={styles.textAddButton}>+ ADD ITEM</Text>
      </TouchableOpacity>
    );
  };

  const renderDetailTotal = () => {
    const {totalGrossAmount, totalDiscountAmount} = basket;
    const subTotalAfterDiscount = totalGrossAmount - totalDiscountAmount;
    const subTotal = totalDiscountAmount
      ? subTotalAfterDiscount
      : totalGrossAmount;

    return (
      <View style={styles.viewDetailValueItem}>
        <Text style={styles.textDetail}>Total</Text>
        <Text style={styles.textDetailValue}>
          {currencyFormatter(subTotal)}
        </Text>
      </View>
    );
  };

  const renderDetailServiceCharge = () => {
    const {totalSurchargeAmount} = basket;
    if (totalSurchargeAmount) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Service Charge</Text>
          <Text style={styles.textDetailValue}>
            {currencyFormatter(totalSurchargeAmount)}
          </Text>
        </View>
      );
    }
  };

  const renderDetailTax = () => {
    const {exclusiveTax} = basket;
    if (exclusiveTax) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Tax</Text>
          <Text style={styles.textDetailValue}>
            {currencyFormatter(exclusiveTax)}
          </Text>
        </View>
      );
    }
  };

  const renderDetailDeliveryCost = () => {
    const {provider} = basket;
    if (provider) {
      const cost = provider.deliveryFee || 'Free';
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Delivery Cost</Text>
          <Text style={styles.textDetailValue}>{currencyFormatter(cost)}</Text>
        </View>
      );
    }
  };

  const renderDetailGrandTotal = () => {
    if (basket?.totalNettAmount) {
      return (
        <TouchableOpacity
          style={styles.viewDetailGrandTotal}
          onPress={() => {
            handleCloseDetail();
          }}>
          <Text style={styles.textDetailGrandTotal}>Grand Total</Text>
          <Text style={styles.textDetailGrandTotalValue}>
            {currencyFormatter(basket?.totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderDetailHeader = () => {
    return (
      <View style={styles.viewDetailHeader}>
        <Text style={styles.textDetailHeader}>Total Details</Text>
        <TouchableOpacity
          style={styles.touchableIconClose}
          onPress={() => {
            handleCloseDetail();
          }}>
          <Image source={appConfig.iconClose} style={styles.iconClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDetail = () => {
    return (
      <View>
        {renderDetailHeader()}
        <View style={styles.viewDetailValue}>
          {renderDetailTotal()}
          {renderDetailDeliveryCost()}
          {renderDetailServiceCharge()}
          {renderDetailTax()}
          {renderDetailGrandTotal()}
        </View>
      </View>
    );
  };

  const renderPaymentButton = () => {
    const disabled = handleDisabledPaymentButton(basket?.orderingMode);
    const styleDisabled = disabled
      ? styles.touchableCheckoutButtonDisabled
      : styles.touchableCheckoutButton;

    return (
      <TouchableOpacity
        style={styleDisabled}
        disabled={disabled}
        onPress={() => {
          handleClickButtonPayment();
        }}>
        <Text style={styles.textCheckoutButton}>Continue to Payment</Text>
      </TouchableOpacity>
    );
  };

  const renderPayment = () => {
    return (
      <View style={styles.viewCheckoutButton}>
        {renderPaymentGrandTotal()}
        {renderPaymentButton()}
      </View>
    );
  };

  const renderFooter = () => {
    const result = seeDetail ? renderDetail() : renderPayment();

    return <View style={styles.viewFooter}>{result}</View>;
  };

  const renderModal = () => {
    return (
      <>
        <DeliveryProviderSelectorModal
          value={basket?.provider}
          open={openDeliveryProviderModal}
          handleClose={() => {
            handleCloseDeliveryProviderModal();
          }}
        />
        <DateSelectorModal
          orderingMode={basket?.orderingMode}
          value={orderingDateTimeSelected}
          open={openDeliveryDateModal}
          handleClose={() => {
            handleCloseDeliveryDateModal();
          }}
        />
        <OrderingTypeSelectorModal
          value={basket?.orderingMode}
          open={openOrderingTypeModal}
          handleClose={() => {
            handleCloseOrderingTypeModal();
          }}
        />
      </>
    );
  };

  if (isEmptyArray(basket?.details)) {
    Actions.pop();
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Cart" />
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
        <ScrollView>
          {renderAddButton()}
          <ProductCartList />
          <View style={styles.divider} />
          {renderOrderingType()}
          {renderAddress()}
          {renderProvider()}
          {renderDate()}
        </ScrollView>
        {renderModal()}
      </View>
      {renderFooter()}
    </SafeAreaView>
  );
};

export default Cart;

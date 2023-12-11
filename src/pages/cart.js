/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from 'react-native';
import {ProgressBar} from 'react-native-paper';

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

import {showSnackbar} from '../actions/setting.action';
import {
  changeOrderingMode,
  getDeliveryProviderAndFee,
  getTimeSlot,
  resetGrandTotal,
  resetOrdeingDateTime,
  resetProvider,
  resetSelectedCustomFiled,
  sendNotes,
} from '../actions/order.action';

import Theme from '../theme';

import LoadingScreen from '../components/loadingScreen';
import OrderingModeOfflineModal from '../components/modal/OrderingModeOfflineModal';
import {getCompanyInfo, getOutletById} from '../actions/stores.action';
import ModalError from '../components/modal/ErrorModal';
import useErrorMessage from '../hooks/message/useErrorMessage';
import {Body} from '../components/layout';
import OrderDetailCart from '../components/cart/OrderDetailCart';
import GlobalText from '../components/globalText';
import additionalSetting from '../config/additionalSettings';
import OutletCard from '../components/productCartList/OutletCard';
import GrandTotalFloating from '../components/order/GrandTotalFloating';
import CheckOutletStatus from '../helper/CheckOutletStatus';
import CustomFieldContainer from '../components/customFieldProfider/CustomFieldProfider';
import useCalculation from '../hooks/calculation/useCalculation';
import useValidation from '../hooks/validation/useValidation';
import GlobalInputText from '../components/globalInputText';
import {normalizeLayoutSizeWidth} from '../helper/Layout';
import {reportSentry} from '../helper/Sentry';

const WIDTH = Dimensions.get('window').width;

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
    progressBar: {
      flex: 1,
      maxWidth: '100%',
      width: WIDTH,
      height: 4,
      marginTop: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.greyScale3,
    },
    primaryColor: {
      color: theme.colors.brandPrimary,
    },
    textLoadBarTitle: {
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLoadBarTitleError: {
      textAlign: 'center',
      color: theme.colors.semanticError,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLoadBarTermsAndConditions: {
      marginTop: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetail: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDetailTax: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailValueTax: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDetailValueDeliveryFee: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDetailValueDeliveryFeeLineTrough: {
      marginRight: 4,
      textDecorationLine: 'line-through',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
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
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailGrandTotalValue: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textCheckoutButton: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMethod: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMethodValue: {
      textAlign: 'center',
      flex: 1,
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMethodValue1: {
      textAlign: 'right',
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textAddButton: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDetailHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
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
      paddingVertical: 8,
    },
    viewDetailValueItemTax: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewDetailValueItemDeliveryFee: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewDetailGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
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
    viewBackgroundTransparent: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: theme.colors.backgroundTransparent1,
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
      paddingBottom: 16,
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
    viewDetailDivider: {
      height: 1,
      width: '100%',
      backgroundColor: theme.colors.greyScale3,
      marginVertical: 8,
    },
    viewProgressBar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    productCartContainer: {
      marginTop: 16,
    },
    stepText: {
      color: theme.colors.brandTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    granTotal: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    priceAll: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      color: theme.colors.primary,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale4,
      padding: 16,
    },
    footerChild: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    threedotContainer: {
      marginLeft: 'auto',
    },
    detailDotContainer: {
      marginLeft: 8,
    },
    notes: {
      marginHorizontal: 16,
    },
    iosTextArea: {
      height: normalizeLayoutSizeWidth(150),
      width: '100%',
    },
    customLabelStyle: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    noMt: {
      marginTop: 0,
    },
    flex: {
      flex: 1,
    },
    selected: isSelected => ({
      backgroundColor: isSelected ? theme.colors.primary : 'white',
    }),
    textSelected: isSelected => ({
      color: isSelected ? 'white' : theme.colors.primary,
    }),
  });
  return {styles, color: theme.colors};
};

const Cart = props => {
  const {styles, color} = useStyles();
  const dispatch = useDispatch();
  const {navigation, isScanGo} = props;
  const [subTotal, setSubTotal] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    description: '',
  });
  const [seeDetail, setSeeDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderingTypeModal, setOpenOrderingTypeModal] = useState(false);
  const [openDeliveryDateModal, setOpenDeliveryDateModal] = useState(false);
  const [openDeliveryProviderModal, setOpenDeliveryProviderModal] = useState(
    false,
  );
  const [notes, setNotes] = React.useState('');
  const {checkCustomField} = useValidation();
  const [
    openOrderingModeOfflineModal,
    setOpenOrderingModeOfflineModal,
  ] = useState(false);
  const {outletUnavailable, outletClosed} = useErrorMessage();
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availablePreorderDate, setAvailablePreorderDate] = useState(null);
  const [availableSelection, saveAvailableSelection] = React.useState([]);
  const [itemSelection, setItemSelection] = React.useState('staff');
  const [loadingTimeSlot, setLoadingTimeSlot] = React.useState(false);
  const outlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const {calculatePriceAferDiscount} = useCalculation();
  const isIos = Platform.OS === 'ios';
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const orderingDateTimeSelected = useSelector(
    state => state.orderReducer?.orderingDateTime?.orderingDateTimeSelected,
  );
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  useEffect(() => {
    dispatch(resetProvider());
    dispatch(resetSelectedCustomFiled());
    dispatch(resetGrandTotal(calculatePriceAferDiscount()));
    return () => {
      dispatch(resetOrdeingDateTime());
      dispatch(resetProvider());
    };
  }, []);

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

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getCompanyInfo());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingTimeSlot(true);
      const clientTimezone = Math.abs(new Date().getTimezoneOffset());
      let date = moment().format('YYYY-MM-DD');
      if (availablePreorderDate) {
        date = moment(availablePreorderDate).format('YYYY-MM-DD');
      }

      const timeSlot = await dispatch(
        getTimeSlot({
          outletId: outlet.id,
          date,
          clientTimezone,
          orderingMode: basket.orderingMode,
        }),
      );
      setAvailableTimes(timeSlot);
      setLoadingTimeSlot(false);
    };
    loadData();
  }, [dispatch, basket, outlet, availablePreorderDate]);

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
      const orderingModesFieldFiltered = orderingModesField.filter(mode => {
        if (outlet[mode.isEnabledFieldName]) {
          return mode;
        }
      });

      if (
        orderingModesFieldFiltered?.length === 1 &&
        !basket?.orderingMode &&
        !basket?.isStoreCheckoutCart
      ) {
        await dispatch(
          changeOrderingMode({
            orderingMode: orderingModesFieldFiltered[0]?.key,
          }),
        );
      }
    };

    loadData();
  }, [outlet, basket, orderingModesField, dispatch]);

  useEffect(() => {
    if (basket?.isStoreCheckoutCart) {
      const findStoreCheckout = orderingModesField.find(
        data => data.key === 'STORECHECKOUT',
      );
      if (findStoreCheckout) {
        dispatch(
          changeOrderingMode({
            orderingMode: findStoreCheckout.key,
          }),
        );
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const totalGrossAmount = basket?.totalGrossAmount;
    const totalDiscountAmount = basket?.totalDiscountAmount;
    const subTotalAfterDiscount = totalGrossAmount - totalDiscountAmount;
    const result = totalDiscountAmount
      ? subTotalAfterDiscount
      : totalGrossAmount;
    setSubTotal(result);

    setIsLoading(false);
  }, [basket]);

  useEffect(() => {
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

      const address = user?.selectedAddress || deliveryAddressDefault;
      const cartId = basket?.cartID;
      const outletId = basket?.outlet?.id;

      const payload = {
        deliveryAddress: address,
        outletId,
        cartID: cartId,
      };

      const result = await dispatch(getDeliveryProviderAndFee(payload));

      if (result?.data) {
        const providerId = basket.provider.id;

        const currentProvider = result?.data?.dataProvider.find(
          row => row.id === providerId,
        );
        await handleResetProvider(currentProvider);
      }

      setIsLoading(false);
    };

    if (basket?.provider?.id) {
      loadData();
    }
  }, [subTotal]);

  const outletsSkipOperationalHours = ['STOREPICKUP', 'TAKEAWAY', 'DELIVERY'];

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
  const handleOpenOrderingModeOfflineModal = async () => {
    setOpenOrderingModeOfflineModal(true);
  };
  const handleCloseOrderingModeOfflineModal = () => {
    setOpenOrderingModeOfflineModal(false);
  };

  const handleResetProvider = async item => {
    const orderingType =
      typeof basket?.orderingMode === 'string' && basket?.orderingMode;

    const isItem = !isEmptyObject(item);

    await dispatch(
      changeOrderingMode({
        orderingMode: orderingType,
        provider: isItem ? item : {},
      }),
    );
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
    const minAmount = outlet.orderValidation?.delivery?.minAmount;

    const isActiveDeliveryMinAmount = !minAmount ? true : subTotal >= minAmount;

    const isBasketProvider = !isEmptyObject(basket?.provider);

    const isActiveDeliveryTime = isEmptyArray(availableTimes)
      ? !!deliveryAddress && isBasketProvider
      : !!deliveryAddress &&
        isBasketProvider &&
        !!orderingDateTimeSelected?.date;

    const isActivePickUp = isEmptyArray(availableTimes)
      ? orderingDateTimeSelected?.date
      : !!orderingDateTimeSelected?.date;

    const isActiveTakeAway = isEmptyArray(availableTimes)
      ? orderingDateTimeSelected?.date
      : !!orderingDateTimeSelected?.date;

    switch (value) {
      case 'DELIVERY':
        if (isActiveDeliveryMinAmount && isActiveDeliveryTime) {
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
                currencyFormatter(maxAmount),
            );
            return false;
          }
        }

        if (minAmount > 0) {
          if (totalAmount < minAmount) {
            Alert.alert(
              'Sorry',
              `Minimum order amount for ${orderType.toLowerCase()} is ` +
                currencyFormatter(minAmount),
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
  const toggleErrorModal = async (title, description) => {
    await setErrorMessage({title: title, description: description});
    setIsOffline(prevState => !prevState);
  };

  const onPressOkError = () => {
    navigation.navigate('outlets');
    toggleErrorModal('', '');
  };

  const handleCheckOperationalHours = currentOutlet => {
    if (CheckOutletStatus(currentOutlet) === 'UNAVAILABLE') {
      let {title, message} = outletUnavailable(currentOutlet);
      if (currentOutlet?.offlineMessage) {
        message = currentOutlet?.offlineMessage;
      }
      // setIsOffline(true);
      toggleErrorModal(title, message);
      // Alert.alert('The outlet is offline', message);
      return;
    }
    if (CheckOutletStatus(currentOutlet) === 'CLOSED') {
      let {title, message} = outletClosed(currentOutlet);
      toggleErrorModal(title, message);
      return;
    }
  };

  const handleClickButtonPayment = async () => {
    setIsLoading(true);
    try {
      const currentOutlet = await dispatch(getOutletById(outlet.id));
      await dispatch(sendNotes(notes));

      const orderingModeAvailable = orderingModesField.filter(mode => {
        if (currentOutlet[mode.isEnabledFieldName]) {
          return mode;
        }
      });

      const availableCheck = orderingModeAvailable.find(
        row => row.key === basket?.orderingMode,
      );

      const outletsOperationalHours = outletsSkipOperationalHours.find(
        mode => mode === basket?.orderingMode,
      );

      const isUnavailable =
        CheckOutletStatus(currentOutlet) === 'UNAVAILABLE' &&
        !outletsOperationalHours;

      const isClosed =
        CheckOutletStatus(currentOutlet) === 'CLOSED' &&
        !outletsOperationalHours;

      if (!availableCheck) {
        return handleOpenOrderingModeOfflineModal();
      }

      if (isUnavailable || isClosed) {
        return handleCheckOperationalHours(currentOutlet);
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

      let pembayaran = {
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
      if (itemSelection === 'own') {
        pembayaran = {...pembayaran, isSelfSelection: true};
      } else {
        pembayaran = {...pembayaran, isSelfSelection: false};
      }
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

      let findMinimumDate = pembayaran?.orderActionDate;
      if (availableTimes && Array.isArray(availableTimes)) {
        findMinimumDate = availableTimes?.find(
          data =>
            data?.date ===
            moment(pembayaran?.orderActionDate).format('YYYY-MM-DD'),
        );
        findMinimumDate = findMinimumDate?.latestSelfSelectionDate;
      }

      await Actions.settleOrder({
        pembayaran: pembayaran,
        url: url,
        outlet: outlet,
        step: 3,
        latestSelfSelectionDate: findMinimumDate,
      });
      setIsLoading(false);
    } catch (e) {
      reportSentry('submitAndPay', outlet, e);
      await dispatch(showSnackbar({message: 'Please try again'}));
      setIsLoading(false);
    }
  };

  const renderLoadBar = ({
    error,
    text,
    termsAndConditions,
    value,
    minAmountCurrency,
  }) => {
    const styleTitle = error
      ? styles.textLoadBarTitleError
      : styles.textLoadBarTitle;
    return (
      <View style={styles.viewMethodOrderingType}>
        <Text style={[styleTitle, styles.primaryColor]}>
          {text}
          <Text style={styles.primaryColor}> {minAmountCurrency} </Text>{' '}
        </Text>
        <Text style={styles.textLoadBarTermsAndConditions}>
          {termsAndConditions}
        </Text>
        <View style={styles.viewProgressBar}>
          <ProgressBar
            progress={value}
            color={styles.primaryColor.color}
            style={styles.progressBar}
          />
        </View>
      </View>
    );
  };

  const renderOutlet = () => {
    if (outlet) {
      if (availableSelection.length > 0 && itemSelection === 'own') {
        return <OutletCard outlet={outlet} />;
      }
      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Selected Outlet</Text>
          <Text style={styles.textMethodValue1}>{outlet?.name}</Text>
        </View>
      );
    }
  };
  const renderOrderingTypeHeaderText = (text, orderingMode) => {
    console.log({text, orderingMode}, 'nehi');
    if (awsConfig.COMPANY_TYPE === 'Retail') {
      return (
        <TouchableOpacity
          disabled={basket?.isStoreCheckoutCart}
          style={[styles.touchableMethod, styles.selected(orderingMode)]}
          onPress={handleOpenOrderingTypeModal}>
          <Text
            style={[styles.textMethodValue, styles.textSelected(orderingMode)]}>
            {text.length > 12 ? text.substring(0.12) + '...' : text}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return <Text style={styles.textMethodValue1}>{text}</Text>;
    }
  };

  const renderOrderingTypeHeader = (orderingTypeValue, orderingMode) => {
    return (
      <View style={styles.viewOrderingTypeHeader}>
        <Text style={styles.textMethod}>Ordering Type</Text>
        {renderOrderingTypeHeaderText(orderingTypeValue, orderingMode)}
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
    const orderingType =
      typeof basket?.orderingMode === 'string' && basket?.orderingMode;

    const orderingMode = orderingModesField.find(
      mode => mode.key === orderingType,
    );

    const orderingTypeValue = orderingMode?.displayName || 'Choose Type';

    return (
      <View style={styles.viewMethodOrderingType}>
        {renderOrderingTypeHeader(orderingTypeValue, orderingMode)}
        {renderOrderingTypeBody(orderingTypeValue)}
      </View>
    );
  };

  const renderAddressHeader = (deliveryAddressValue, myDeliveryAddress) => {
    return (
      <View style={styles.viewDeliveryAddressHeader}>
        <Text style={styles.textMethod}>Delivery Address</Text>
        <TouchableOpacity
          style={[styles.touchableMethod, styles.selected(myDeliveryAddress)]}
          onPress={() => {
            Actions.myDeliveryAddress({
              handleResetProvider: () => {
                handleResetProvider();
              },
            });
          }}>
          <Text
            style={[
              styles.textMethodValue,
              styles.textSelected(myDeliveryAddress),
            ]}>
            {deliveryAddressValue}
          </Text>
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
          <Text style={styles.textDeliveryAddressBody}>#{item?.unitNo}</Text>
          <Text style={styles.textDeliveryAddressBody}>
            SG {item?.postalCode}
          </Text>
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
          {renderAddressHeader(
            deliveryAddressValue,
            deliveryAddress?.tagAddress,
          )}
          {renderAddressBody(deliveryAddress)}
        </View>
      );
    }
  };

  const renderProvider = () => {
    const isSelectedDate = orderingDateTimeSelected?.date;
    if (basket?.orderingMode === 'DELIVERY' && isSelectedDate) {
      const disabled = isEmptyObject(deliveryAddress);
      const deliveryProviderValue = basket?.provider?.name || 'Choose Provider';

      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Provider</Text>
          <TouchableOpacity
            style={[
              styles.touchableMethod,
              styles.selected(basket?.provider?.name),
            ]}
            disabled={disabled}
            onPress={() => {
              handleOpenDeliveryProviderModal();
            }}>
            <Text
              style={[
                styles.textMethodValue,
                styles.textSelected(basket?.provider?.name),
              ]}>
              {deliveryProviderValue}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderDateText = () => {
    if (orderingDateTimeSelected?.date) {
      const date = moment(orderingDateTimeSelected?.date).format('DD/MM/YY');
      return (
        <View>
          <Text
            style={[
              styles.textMethodValue,
              styles.textSelected(orderingDateTimeSelected?.date),
            ]}>
            {date}
          </Text>
          <Text
            style={[
              styles.textMethodValue,
              styles.textSelected(orderingDateTimeSelected?.date),
            ]}>
            at {orderingDateTimeSelected?.time}
          </Text>
        </View>
      );
    } else {
      return <Text style={styles.textMethodValue}>Choose Date</Text>;
    }
  };

  const renderDate = () => {
    const available = !isEmptyArray(availableTimes);
    const isDelivery = available && basket?.orderingMode === 'DELIVERY';
    const isPickUp = available && basket?.orderingMode === 'STOREPICKUP';
    const isTakeAway = available && basket?.orderingMode === 'TAKEAWAY';

    if (isDelivery || isPickUp || isTakeAway) {
      return (
        <View style={[styles.viewMethod, ,]}>
          <Text style={styles.textMethod}>Date & Time</Text>
          <TouchableOpacity
            style={[
              styles.touchableMethod,
              styles.selected(orderingDateTimeSelected?.date),
            ]}
            onPress={() => {
              handleOpenDeliveryDateModal();
            }}>
            {loadingTimeSlot ? (
              <ActivityIndicator size={'small'} color={color.primary} />
            ) : (
              renderDateText()
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderDetailTotal = () => {
    return (
      <View style={styles.viewDetailValueItem}>
        <Text style={styles.textDetail}>Total</Text>
        <Text style={styles.textDetailValue}>
          {currencyFormatter(basket?.totalGrossAmount)}
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

  const renderDetailItemDiscount = () => {
    const totalMembershipDiscountAmount =
      basket?.totalMembershipDiscountAmount || 0;
    const totalDiscountAmount = basket?.totalDiscountAmount || 0;
    const totalItemDiscount =
      totalDiscountAmount - totalMembershipDiscountAmount;
    if (totalItemDiscount) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Item Discount</Text>
          <Text style={styles.textDetailValue}>
            ({currencyFormatter(totalItemDiscount)})
          </Text>
        </View>
      );
    }
  };

  const renderDetailMembershipDiscount = () => {
    const {totalMembershipDiscountAmount} = basket;
    if (totalMembershipDiscountAmount) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Membership Discount</Text>
          <Text style={styles.textDetailValue}>
            ({currencyFormatter(totalMembershipDiscountAmount)})
          </Text>
        </View>
      );
    }
  };

  const renderDetailTax = () => {
    const exclusiveTax = basket?.exclusiveTax;
    const inclusiveTax = basket?.inclusiveTax;

    const value = inclusiveTax || exclusiveTax;

    const text = inclusiveTax ? 'Incl. Tax' : 'Excl. Tax';

    if (value) {
      return (
        <View style={styles.viewDetailValueItemTax}>
          <Text style={styles.textDetailTax}>{text}</Text>
          <Text style={styles.textDetailValueTax}>
            {currencyFormatter(value)}
          </Text>
        </View>
      );
    }
  };

  const renderDetailDivider = value => {
    if (value) {
      return <View style={styles.viewDetailDivider} />;
    }
  };

  const renderDetailDeliveryCost = () => {
    if (!isEmptyObject(basket?.provider)) {
      const minAmount = Number(basket?.provider?.minPurchaseForFreeDelivery);
      const deliveryFee = Number(basket?.provider?.deliveryFee);
      const deliveryGrossAmount = Number(basket?.provider?.grossAmount);

      const isDiscount = minAmount ? subTotal >= minAmount : false;

      const costDefaultCurrency = isDiscount
        ? currencyFormatter(deliveryGrossAmount)
        : null;

      const costCurrency = deliveryFee
        ? currencyFormatter(deliveryFee)
        : 'Free';

      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Delivery Fee</Text>
          <View style={styles.viewDetailValueItemDeliveryFee}>
            <Text style={styles.textDetailValueDeliveryFeeLineTrough}>
              {costDefaultCurrency}
            </Text>
            <Text style={styles.textDetailValueDeliveryFee}>
              {costCurrency}
            </Text>
          </View>
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

  const renderDetailBody = () => {
    const isSurcharge = basket?.totalSurchargeAmount;
    const isDelivery = !isEmptyObject(basket?.provider);
    return (
      <View style={styles.viewDetailValue}>
        {renderDetailTotal()}
        {renderDetailItemDiscount()}
        {renderDetailMembershipDiscount()}
        {renderDetailDivider(isSurcharge || isDelivery)}
        {renderDetailDeliveryCost()}
        {renderDetailServiceCharge()}
        {renderDetailDivider(basket?.totalNettAmount)}
        {renderDetailGrandTotal()}
        {renderDetailTax()}
      </View>
    );
  };

  const renderDetail = () => {
    return (
      <View>
        {renderDetailHeader()}
        {renderDetailBody()}
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

  const newFooter = () => {
    const disabled =
      handleDisabledPaymentButton(basket?.orderingMode) || checkCustomField();
    if (additionalSetting().cartVersion === 'basic') {
      return renderFooter();
    }
    return (
      <GrandTotalFloating
        onPressBtn={handleClickButtonPayment}
        btnText={'Checkout'}
        disabledBtn={disabled}
        hideAmountPaid={true}
      />
    );
  };

  const renderFooter = () => {
    const result = seeDetail ? renderDetail() : renderPayment();

    return <View style={styles.viewFooter}>{result}</View>;
  };

  const renderModal = () => {
    const orderingType =
      typeof basket?.orderingMode === 'string' && basket?.orderingMode;

    const orderingMode = orderingModesField.find(
      mode => mode.key === orderingType,
    );

    const orderingTypeValue = orderingMode?.displayName;
    const dateValue = !isEmptyArray(availableTimes)
      ? {date: availableTimes[0]?.date}
      : orderingDateTimeSelected;
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
          value={dateValue}
          preOrderDate={availablePreorderDate}
          open={openDeliveryDateModal}
          handleClose={() => {
            handleCloseDeliveryDateModal();
          }}
        />
        <OrderingTypeSelectorModal
          value={basket?.orderingMode}
          open={openOrderingTypeModal}
          handleSaveCustom={() => {
            handleCloseOrderingTypeModal();
          }}
          handleClose={() => {
            handleCloseOrderingTypeModal();
          }}
        />
        <OrderingModeOfflineModal
          value={orderingTypeValue}
          open={openOrderingModeOfflineModal}
          handleClose={() => {
            handleCloseOrderingModeOfflineModal();
          }}
        />
      </>
    );
  };

  const renderOrderValidation = () => {
    const minAmount = outlet.orderValidation?.delivery?.minAmount;
    const minAmountCustomMessage =
      outlet.orderValidation?.delivery?.minAmountCustomMessage;

    if (subTotal < minAmount && basket?.orderingMode === 'DELIVERY') {
      const lessAmountCurrency = currencyFormatter(minAmount - subTotal);
      const minAmountCurrency = currencyFormatter(minAmount);

      const message = `${minAmountCustomMessage} (minimum amount ${minAmountCurrency})`;

      const termsAndConditions = `Add ${lessAmountCurrency} more to use delivery`;

      const value = subTotal < minAmount ? subTotal / minAmount : 1;
      return renderLoadBar({
        error: true,
        text: message,
        termsAndConditions: termsAndConditions,
        value,
      });
    }
  };

  const renderDeliveryProviderTermsAndConditions = () => {
    const minAmount = Number(basket?.provider?.minPurchaseForFreeDelivery);
    if (minAmount) {
      const lessAmountCurrency =
        subTotal < minAmount
          ? currencyFormatter(minAmount - subTotal)
          : currencyFormatter(0);

      const minAmountCurrency = currencyFormatter(minAmount);
      const lessAmount = minAmount - subTotal;
      const message =
        'Enjoy delivery fee discount when your order amount is more than';

      let termsAndConditions = `Add ${lessAmountCurrency} to get delivery fee discounts`;
      if (lessAmount < 1) {
        termsAndConditions = 'Congratulations! You get delivery fee discounts!';
      }

      const value = subTotal <= minAmount ? subTotal / minAmount : 1;

      return renderLoadBar({
        text: message,
        termsAndConditions: termsAndConditions,
        value,
        minAmountCurrency,
      });
    }
  };

  if (isEmptyArray(basket?.details)) {
    Actions.pop();
  }

  const setAvailablePreOrder = date => {
    setAvailablePreorderDate(date);
  };

  const setAvailableSelection = data => {
    saveAvailableSelection(data);
  };

  const handleItemSelection = status => {
    setItemSelection(status);
  };

  const renderStep = () => {
    if (props.step) {
      return (
        <View>
          <GlobalText style={styles.stepText}>
            Step {props.step} of 4
          </GlobalText>
        </View>
      );
    }
    return null;
  };

  const renderCustomField = () => {
    return <CustomFieldContainer />;
  };

  const onChangeNotes = value => {
    setNotes(value);
  };

  const renderNotes = () => {
    if (
      basket?.orderingMode === 'STOREPICKUP' ||
      basket?.orderingMode === 'DELIVERY'
    ) {
      return (
        <View style={styles.notes}>
          <GlobalInputText
            showNumberLengthText={true}
            placeholder="Example: please use less plastic"
            label="Remarks (Optional)"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
            maxLength={140}
            onChangeText={onChangeNotes}
            customInputStyle={styles.iosTextArea}
            customLabelStyle={styles.customLabelStyle}
            inputParentContainerCustom={styles.noMt}
            value={notes}
          />
        </View>
      );
    }
    return null;
  };

  const renderBackgroundDark = () => {
    if (seeDetail) {
      return <View style={styles.viewBackgroundTransparent} />;
    }
  };
  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
        <Body>
          <Header
            customRightIcon={renderStep}
            title={props.step ? 'Order Details' : 'Cart'}
          />
          <KeyboardAvoidingView
            enabled={isIos}
            keyboardVerticalOffset={120}
            behavior="position"
            style={styles.flex}>
            <ScrollView>
              <ProductCartList
                setAvailaleForSelection={setAvailableSelection}
                setAvailablePreorderDate={setAvailablePreOrder}
                step={props.step}
              />
              {availableSelection.length > 0 ? (
                <OrderDetailCart
                  itemSelection={itemSelection}
                  setSelectSelection={handleItemSelection}
                />
              ) : null}
              {renderOrderValidation()}
              {renderDeliveryProviderTermsAndConditions()}
              {renderOutlet()}
              {renderOrderingType()}
              {renderAddress()}
              {renderDate()}
              {renderProvider()}
              {renderCustomField()}
              {renderNotes()}
            </ScrollView>
          </KeyboardAvoidingView>
        </Body>
        {renderBackgroundDark()}
        {renderModal()}
      </View>
      {newFooter()}

      <ModalError
        title={errorMessage.title}
        description={errorMessage.description}
        onClose={() => toggleErrorModal('', '')}
        isOpen={isOffline}
        onOk={onPressOkError}
        titleButtonOk="Change Outlet"
        titleButtonClose="Cancel"
      />
    </SafeAreaView>
  );
};

export default Cart;

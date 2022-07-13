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
} from 'react-native';

import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import RBSheet from 'react-native-raw-bottom-sheet';

import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProductCartList from '../components/productCartList/ProductCartList';

import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';
import DeliveryProviderSelectorModal from '../components/modal/DeliveryProviderSelectorModal';
import DeliveryDateSelectorModal from '../components/modal/DeliveryDateSelectorModal';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import currencyFormatter from '../helper/CurrencyFormatter';
import Header from '../components/layout/header';
import {Alert} from 'react-native';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {showSnackbar} from '../actions/setting.action';
import {getTimeSlot} from '../actions/order.action';
import Theme from '../theme';
const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#F9F9F9',
      justifyContent: 'space-between',
    },
    container: {
      flex: 1,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    textDetail: {
      fontSize: 12,
    },
    textDetailValue: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    textGrandTotal: {
      fontSize: 12,
    },
    textGrandTotalValue: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    textDetailGrandTotal: {
      fontSize: 14,
    },
    textDetailGrandTotalValue: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    textSeeDetails: {
      color: colorConfig.primaryColor,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    textCheckoutButton: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white',
    },
    textMethod: {
      fontSize: 12,
      fontWeight: '500',
    },
    textMethodValue: {
      fontSize: 12,
      fontWeight: '500',
      color: colorConfig.primaryColor,
      textAlign: 'center',
    },
    textAddButton: {
      color: colorConfig.primaryColor,
      fontSize: 12,
    },
    textDeliveryAddressBody: {
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
      borderColor: '#D6D6D6',
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
      borderTopWidth: 0.2,
      borderTopColor: 'grey',
      padding: 16,
    },
    viewFooter: {
      backgroundColor: 'white',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      marginTop: -8,
    },
    viewMethod: {
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 1,
    },
    viewMethodDeliveryAddress: {
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      elevation: 1,
    },
    viewAddButton: {
      borderColor: colorConfig.primaryColor,
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    viewGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewDetailValue: {
      paddingHorizontal: 16,
    },
    touchableMethod: {
      width: 120,
      borderRadius: 8,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colorConfig.primaryColor,
    },
    touchableCheckoutButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorConfig.primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 26,
    },
    touchableCheckoutButtonDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B7B7B7',
      paddingVertical: 10,
      paddingHorizontal: 26,
    },
    dividerDashed: {
      textAlign: 'center',
      color: colorConfig.primaryColor,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#D6D6D6',
    },
    dividerValue: {
      height: 1,
      width: '100%',
      marginVertical: 16,
      backgroundColor: theme.colors.border,
    },
    iconArrowUp: {
      fontSize: 20,
      color: '#B7B7B7',
    },
  });
  return styles;
};

const Cart = () => {
  const styles = useStyles();
  const theme = Theme();
  const dispatch = useDispatch();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [seeDetail, setSeeDetail] = useState(false);
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
    setDeliveryAddress(result.selectedAddress);
  }, [userDetail]);

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
    const {totalNettAmount} = basket;

    if (totalNettAmount) {
      return (
        <TouchableOpacity
          style={styles.viewDetailGrandTotal}
          onPress={() => {
            handleCloseDetail();
          }}>
          <Text style={styles.textDetailGrandTotal}>Grand Total</Text>
          <Text style={styles.textDetailGrandTotalValue}>
            {currencyFormatter(totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderDetailHeader = () => {
    return (
      <View
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderColor: '#D6D6D6',
        }}>
        <Text style={{fontSize: 12}}>Total Details</Text>
        <IconMaterialIcons
          onPress={() => {
            handleCloseDetail();
          }}
          name="close"
          style={{position: 'absolute', right: 20, fontSize: 16}}
        />
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

  const renderPaymentGrandTotal = () => {
    const {totalNettAmount} = basket;
    if (totalNettAmount) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleOpenDetail();
          }}>
          <Text style={styles.textGrandTotal}>Grand Total</Text>
          <View style={styles.viewGrandTotal}>
            <Text style={styles.textGrandTotalValue}>
              {currencyFormatter(totalNettAmount)}
            </Text>
            <IconMaterialIcons
              name="keyboard-arrow-up"
              style={styles.iconArrowUp}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const handleDisabledPaymentButton = value => {
    switch (value) {
      case 'DELIVERY':
        if (
          isEmptyArray(availableTimes) &&
          deliveryAddress &&
          basket?.provider
        ) {
          return false;
        } else if (
          deliveryAddress &&
          basket?.provider &&
          orderingDateTimeSelected
        ) {
          return false;
        }
        return true;
      case 'PICKUP':
        return false;
      case 'DINEIN':
        return false;
      case 'TAKEAWAY':
        return false;

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

      // set url to pay
      let url;

      if (!basket?.orderingMode) {
        RBSheet.open();
        return;
      }

      if (
        basket?.orderingMode === 'TAKEAWAY' ||
        basket?.orderingMode === 'DELIVERY'
      ) {
        pembayaran.orderingMode = basket.orderingMode;
        pembayaran.cartID = basket.cartID;
        url = '/cart/submitAndPay';
      } else {
        url = '/cart/customer/settle';
      }

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
          basket?.orderingMode === 'PICKUP'
        ) {
          if (!orderingDateTimeSelected?.date) {
            pembayaran.orderActionDate = moment().format('yyyy-MM-dd');
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
          // Actions.settleOrder({pembayaran: pembayaran, url: '/cart/settle'});
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

  const renderOrderingType = () => {
    const orderingType =
      typeof basket?.orderingMode === 'string' && basket?.orderingMode;

    const orderingTypeValue = orderingType || 'Choose Type';

    return (
      <View style={styles.viewMethod}>
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

  const renderDeliveryAddressHeader = deliveryAddressValue => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
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

  const renderDeliveryAddressBody = item => {
    if (!isEmptyObject(deliveryAddress)) {
      return (
        <>
          <View style={styles.dividerValue} />
          <Text style={styles.textDeliveryAddressBody}>
            {item?.recipient?.name} - {item?.recipient?.phoneNumber}
          </Text>
          <Text style={styles.textDeliveryAddressBody}>{item.streetName}</Text>
        </>
      );
    }
  };

  const renderDeliveryAddress = () => {
    if (basket?.orderingMode === 'DELIVERY') {
      const deliveryAddressValue =
        deliveryAddress?.tagAddress || 'Choose Address';

      return (
        <View style={styles.viewMethodDeliveryAddress}>
          {renderDeliveryAddressHeader(deliveryAddressValue)}
          {renderDeliveryAddressBody(deliveryAddress)}
        </View>
      );
    }
  };

  const renderDeliveryProvider = () => {
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

  const renderDeliveryDateText = () => {
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

  const renderDeliveryDate = () => {
    const available = !isEmptyArray(availableTimes);
    const isDelivery = available && basket?.orderingMode === 'DELIVERY';
    const isPickUp = available && basket?.orderingMode === 'PICKUP';

    if (isDelivery || isPickUp) {
      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Date</Text>
          <TouchableOpacity
            style={styles.touchableMethod}
            onPress={() => {
              handleOpenDeliveryDateModal();
            }}>
            {renderDeliveryDateText()}
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
        <DeliveryDateSelectorModal
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

  const renderBody = () => {
    if (!isEmptyObject(basket)) {
      return (
        <>
          <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
              <View style={{marginTop: 16}} />
              {renderAddButton()}
              <View style={{marginTop: 16}} />
              <ProductCartList />
              <View style={styles.divider} />
              {renderOrderingType()}
              {renderDeliveryAddress()}
              {renderDeliveryProvider()}
              {renderDeliveryDate()}
              <View style={{marginTop: 16}} />
            </ScrollView>
            {renderModal()}
          </View>
          {renderFooter()}
        </>
      );
    }
  };

  if (isEmptyArray(basket?.details)) {
    Actions.pop();
  }

  return (
    <View style={styles.root}>
      <Header title="Cart" />
      {renderBody()}
    </View>
  );
};

export default Cart;

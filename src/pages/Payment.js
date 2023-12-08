/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import currencyFormatter from '../helper/CurrencyFormatter';
import Header from '../components/layout/header';
import Theme from '../theme';
import moment from 'moment';
import {Body} from '../components/layout';
import appConfig from '../config/appConfig';

import {getPendingOrderById} from '../actions/order.action';
import {useDispatch, useSelector} from 'react-redux';
import {permissionDownloadFile} from '../helper/Download';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'space-between',
    },

    container: {
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

    textTitle: {
      marginTop: 24,
      marginBottom: 8,
      marginHorizontal: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textReference: {
      marginTop: 3,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textOrderDetail: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textOrderDetailValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },

    textPaymentDetail: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textPaymentDetailValue: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textOrderDetailGrandTotal: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textOrderDetailGrandTotalValue: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },

    textButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textSaveQR: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textStatus: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textStatusValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },

    textWaitingPayment: {
      marginTop: 3,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textWaitingPaymentValue: {
      marginTop: 3,
      marginHorizontal: 10,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQueueNumber1: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textQueueNumber2: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    viewQR: {
      alignItems: 'center',
      marginTop: 24,
    },
    viewQueueNumber: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },

    viewOrderDetailItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 16,
    },

    viewOrderDetailGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale3,
    },

    viewOrderDetails: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      padding: 12,
      marginHorizontal: 16,
      borderRadius: 8,
      backgroundColor: 'white',
    },

    viewPaymentDetailItem: {
      marginVertical: 6,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    viewPaymentDetails: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginBottom: 24,
      borderRadius: 8,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    viewStatus: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      padding: 12,
      marginTop: 24,
      marginHorizontal: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    viewSaveQR: {
      padding: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: theme.colors.buttonActive,
    },

    viewReferenceNo: {
      padding: 8,
      marginHorizontal: 16,
      marginBottom: 24,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.greyScale4,
    },

    viewButton: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },

    viewWaitingPayment: {
      marginVertical: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    viewOrderDetailDateAndTime: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    viewImageAndText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#D6D6D6',
    },

    bullet: {
      width: 6,
      height: 6,
      borderRadius: 100,
      marginHorizontal: 8,
      backgroundColor: theme.colors.textPrimary,
    },

    iconTime: {
      width: 20,
      height: 20,
      tintColor: theme.colors.textQuaternary,
    },

    iconPayment: {
      width: 20,
      height: 20,
      marginRight: 8,
      tintColor: theme.colors.textPrimary,
    },

    imageQR: {
      width: 256,
      height: 256,
    },
  });
  return styles;
};

const Payment = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [refresh, setRefresh] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  const order = useSelector(
    state => state.orderReducer.dataCartSingle.cartSingle,
  );

  const isPendingPayment = order?.status === 'PENDING_PAYMENT';

  useEffect(() => {
    const then = moment(order.action.expiry).format('MM/DD/YYYY HH:mm:ss');

    const result = setInterval(() => {
      const now = moment().format('MM/DD/YYYY HH:mm:ss');
      const ms = moment(then).diff(moment(now));

      const duration = moment.duration(ms);
      const second = duration.seconds();
      const minute = duration.minutes();
      const hour = duration.hours();

      setSeconds(second);
      setMinutes(minute);
      setHours(hour);

      if (second <= 0 && minute <= 0 && hour <= 0) {
        setSeconds(0);
        setMinutes(0);
        setHours(0);
        clearInterval(result);
      }
    }, 1);
  }, [order]);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await dispatch(getPendingOrderById(order?.id));
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleDownloadQrCode = async qr => {
    permissionDownloadFile(qr, `qrcode${order?.id}`, 'image/png', {
      title: 'QR Code Saved Successfully',
      description:
        'You can finalize the payment by uploading the QR Code to the payment platform.',
    });
  };

  const renderQR = () => {
    const qr = order?.action?.url;

    if (qr && isPendingPayment) {
      return (
        <View style={styles.viewQR}>
          <Image source={{uri: qr}} style={styles.imageQR} />
        </View>
      );
    }
  };

  const renderWaitingTime = () => {
    if (isPendingPayment) {
      const secondMoment = moment(seconds, 'second').format('ss');
      const minuteMoment = moment(minutes, 'minute').format('mm');
      const hourMoment = moment(hours, 'hour').format('HH');
      return (
        <View style={styles.viewWaitingPayment}>
          <Text style={styles.textWaitingPayment}>Waiting for payment</Text>
          <Text style={styles.textWaitingPaymentValue}>
            {hourMoment}:{minuteMoment}:{secondMoment}
          </Text>
          <Image source={appConfig.iconTime} style={styles.iconTime} />
        </View>
      );
    }
  };

  const renderSaveQR = () => {
    const qr = order?.action?.url;
    if (isPendingPayment) {
      return (
        <TouchableOpacity
          style={styles.viewSaveQR}
          onPress={() => {
            handleDownloadQrCode(qr);
          }}>
          <Text style={styles.textSaveQR}>SAVE QR CODE TO GALLERY</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderStatusValue = key => {
    switch (key) {
      case 'PENDING_PAYMENT':
        return 'AWAITING PAYMENT ';
      case 'SUBMITTED':
        return 'SUBMITTED';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'PROCESSING':
        return 'PROCESSING';
      case 'READY_FOR_COLLECTION':
        return 'READY';
      case 'READY_FOR_DELIVERY':
        return 'READY';
      case 'ON_THE_WAY':
        return 'ON THE WAY';
      case 'REFUNDED':
        return 'REFUNDED';
      case 'CANCELED':
        return 'CANCELED';
      case 'COMPLETE':
        return 'COMPLETE';
      default:
        return '-';
    }
  };

  const renderStatus = () => {
    return (
      <View style={styles.viewStatus}>
        <Text style={styles.textStatus}>Order Status</Text>
        <Text style={styles.textStatusValue}>
          {renderStatusValue(order.status)}
        </Text>
      </View>
    );
  };

  const renderOrderDetailDateAndTime = () => {
    const {modifiedOn} = order;

    const date = moment(modifiedOn).format('DD MM YYYY');
    const time = moment(modifiedOn).format('HH.mm');
    return (
      <View style={styles.viewOrderDetailItem}>
        <Text style={styles.textOrderDetail}>Order Date & Time</Text>
        <View style={styles.viewOrderDetailDateAndTime}>
          <Text style={styles.textOrderDetailValue}>{date}</Text>
          <View style={styles.bullet} />
          <Text style={styles.textOrderDetailValue}>{time}</Text>
        </View>
      </View>
    );
  };

  const renderOrderDetailTotal = () => {
    const {totalGrossAmount, totalDiscountAmount} = order;
    const subTotalAfterDiscount = totalGrossAmount - totalDiscountAmount;
    const subTotal = totalDiscountAmount
      ? subTotalAfterDiscount
      : totalGrossAmount;

    return (
      <View style={styles.viewOrderDetailItem}>
        <Text style={styles.textOrderDetail}>Subtotal</Text>
        <Text style={styles.textOrderDetailValue}>
          {currencyFormatter(subTotal)}
        </Text>
      </View>
    );
  };

  const renderOrderDetailServiceCharge = () => {
    const {totalSurchargeAmount} = order;
    if (totalSurchargeAmount) {
      return (
        <View style={styles.viewOrderDetailItem}>
          <Text style={styles.textOrderDetail}>Service Charge</Text>
          <Text style={styles.textOrderDetailValue}>
            {currencyFormatter(totalSurchargeAmount)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderDetailExcludeTax = () => {
    const {exclusiveTax} = order;
    if (exclusiveTax) {
      return (
        <View style={styles.viewOrderDetailItem}>
          <Text style={styles.textOrderDetail}>Excl. Tax</Text>
          <Text style={styles.textOrderDetailValue}>
            {currencyFormatter(exclusiveTax)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderDetailIncludeTax = () => {
    const {inclusiveTax} = order;
    if (inclusiveTax) {
      return (
        <View style={styles.viewOrderDetailItem}>
          <Text style={styles.textOrderDetail}>Incl. Tax</Text>
          <Text style={styles.textOrderDetailValue}>
            {currencyFormatter(inclusiveTax)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderDetailDeliveryCost = () => {
    const {provider} = order;
    if (provider) {
      const cost = provider.deliveryFee || 'Free';
      return (
        <View style={styles.viewOrderDetailItem}>
          <Text style={styles.textOrderDetail}>Delivery Fee</Text>
          <Text style={styles.textOrderDetailValue}>
            {currencyFormatter(cost)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderDetailGrandTotal = () => {
    const {totalNettAmount} = order;

    if (totalNettAmount) {
      return (
        <View style={styles.viewOrderDetailGrandTotal}>
          <Text style={styles.textOrderDetailGrandTotal}>Grand Total</Text>
          <Text style={styles.textOrderDetailGrandTotalValue}>
            {currencyFormatter(totalNettAmount)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderDetails = () => {
    return (
      <View style={styles.viewOrderDetails}>
        {renderOrderDetailDateAndTime()}
        {renderOrderDetailTotal()}
        {renderOrderDetailDeliveryCost()}
        {renderOrderDetailServiceCharge()}
        {renderOrderDetailIncludeTax()}
        {renderOrderDetailExcludeTax()}
        {renderOrderDetailGrandTotal()}
      </View>
    );
  };

  const renderPaymentDetailText = key => {
    switch (key) {
      case 'FOMO_PAY':
        return 'Paynow';
      case 'voucher':
        return 'Voucher';
      case 'promocode':
        return 'Voucher';
      case 'point':
        return 'Point';
      case 'Store Value Card':
        return 'Store Value Card';
      default:
        return '-';
    }
  };

  const renderPaymentDetailImage = key => {
    switch (key) {
      case 'FOMO_PAY':
        return appConfig.iconPayment;
      case 'voucher':
        return appConfig.iconVoucher;
      case 'promocode':
        return appConfig.iconVoucher;
      case 'point':
        return appConfig.iconPoint;
      case 'Store Value Card':
        return 'Store Value Card';
      default:
        return null;
    }
  };

  const renderPaymentDetailItem = row => {
    return (
      <View style={styles.viewPaymentDetailItem}>
        <View style={styles.viewImageAndText}>
          <Image
            source={renderPaymentDetailImage(row?.paymentType)}
            style={styles.iconPayment}
          />
          <Text style={styles.textPaymentDetail}>
            {renderPaymentDetailText(row?.paymentType)}
          </Text>
        </View>
        <Text style={styles.textPaymentDetailValue}>
          {currencyFormatter(row?.paymentAmount)}
        </Text>
      </View>
    );
  };

  const renderQueueNumber = () => {
    const isShowQueue =
      order?.queueNo &&
      order?.orderingMode !== 'STORECHECKOUT' &&
      order?.outlet?.outletType !== 'Retail';

    if (isShowQueue) {
      return (
        <View style={styles.viewQueueNumber}>
          <Text style={styles.textQueueNumber1}>Queue No.</Text>
          <Text style={styles.textQueueNumber2}>{order?.queueNo}</Text>
        </View>
      );
    }
  };

  const renderPaymentDetails = () => {
    const result = order?.payments.map(row => {
      return renderPaymentDetailItem(row);
    });

    return <View style={styles.viewPaymentDetails}>{result}</View>;
  };

  const renderTextTitle = text => {
    return <Text style={styles.textTitle}>{text}</Text>;
  };

  const renderReferenceNo = () => {
    return (
      <View style={styles.viewReferenceNo}>
        <Text style={styles.textReference}>Reference No.</Text>
        <Text style={styles.textReference}>{order?.referenceNo}</Text>
      </View>
    );
  };

  const renderBody = () => {
    if (!isEmptyObject(order)) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          <View style={styles.divider} />
          {renderQR()}
          {renderWaitingTime()}
          {renderSaveQR()}
          {renderQueueNumber()}
          {renderStatus()}
          {renderTextTitle('Order Details')}
          {renderOrderDetails()}
          {renderTextTitle('Payment Details')}
          {renderPaymentDetails()}
          {renderReferenceNo()}
        </ScrollView>
      );
    }
  };

  const renderBottom = () => {
    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            Actions.popTo('pageIndex');
            Actions.pendingOrderDetail({order});
          }}>
          <Text style={styles.textButton}>See Order Detail</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isEmptyArray(order?.details)) {
    Actions.pop();
  }

  return (
    <SafeAreaView style={styles.root}>
      <Body>
        <Header
          title={order.action.name}
          onBackBtn={() => {
            Actions.popTo('pageIndex');
          }}
        />
        {renderBody()}
        {renderBottom()}
      </Body>
    </SafeAreaView>
  );
};

export default Payment;

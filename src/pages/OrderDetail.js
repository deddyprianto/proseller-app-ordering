/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {SafeAreaView, View, StyleSheet, Image, ScrollView} from 'react-native';
import GlobalText from '../components/globalText';
import {Body, Header} from '../components/layout';
import Theme from '../theme/Theme';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../helper/Layout';
import GlobalButton from '../components/button/GlobalButton';
import moment from 'moment';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import PointSvg from '../assets/svg/PointSvg';
import VoucherSvg from '../assets/svg/VoucherSvg';
import CardSvg from '../assets/svg/CardSvg';
import MapMarkerSvg from '../assets/svg/MapMarkerSvg';
import TruckSvg from '../assets/svg/TruckSvg';
import CalendarSvg from '../assets/svg/CalendareSvg';
import CalendarBold from '../assets/svg/CalendarBoldSvg';
import NotesSvg from '../assets/svg/NotesSvg';
import useCountdownHooks from '../hooks/time/countdown';
import TimerSvg from '../assets/svg/TimerSvg';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    containerCountdown: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    watingPaymentText: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: fontFamily.poppinsMedium,
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrImage: {
      width: normalizeLayoutSizeHeight(256),
      height: normalizeLayoutSizeHeight(256),
    },
    btnContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnMainContainer: {
      width: normalizeLayoutSizeWidth(256),
    },
    orderStatusContainer: {
      padding: 12,
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },
    columnCard: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    mainScrollContainer: {
      paddingHorizontal: 17,
    },
    oredrDetailText: {
      fontFamily: fontFamily.poppinsMedium,
      fontSize: 16,
    },
    orderDetailWrapCOntainer: {
      marginTop: 24,
    },
    listOrderDetailContainer: {
      marginTop: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.greyScale2,
      marginVertical: 16,
    },
    gandTotalContainer: {
      marginTop: 0,
    },
    grandTotalText: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsMedium,
    },
    paymentDetailsCard: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentDetailCardText: {
      marginLeft: 8,
    },
    shadowBox: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      backgroundColor: 'white',
      borderRadius: 8,
      elevation: 1,
    },
    boxMain: {
      marginTop: 8,
    },
    boldFont: {
      fontFamily: fontFamily.poppinsBold,
    },
    priceText: {
      color: colors.primary,
      fontSize: 24,
    },
    scrollContainer: {
      paddingBottom: 30,
    },
    deliveryText: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsBold,
      color: colors.primary,
    },
    columnText: {
      marginTop: 4,
    },
    waitingPaymentBox: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    waitingPaymentStyle: {
      color: 'white',
      fontSize: 14,
      fontFamily: fontFamily.poppinsMedium,
    },
    clockIcon: {
      marginLeft: 10,
    },
  });
  return {styles};
};

const OrderDetail = ({data}) => {
  const {styles} = useStyles();
  const {time, timerId, countdownStart} = useCountdownHooks();

  const onFinish = () => {
    console.log('finish');
  };
  console.log({time}, 'jaka');
  React.useEffect(() => {
    countdownStart(onFinish, data?.action?.expiry);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Body>
      <View style={styles.waitingPaymentBox}>
        <GlobalText style={styles.waitingPaymentStyle}>
          Waiting for payment {time.hours}:{time.minutes}:{time.seconds}
        </GlobalText>
        <View style={styles.clockIcon}>
          <TimerSvg />
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} source={{uri: data?.action?.url}} />
        </View>
        <View style={styles.btnContainer}>
          <View style={styles.btnMainContainer}>
            <GlobalButton isOutline title="SAVE QR CODE TO GALLERY" />
          </View>
        </View>
        <View />
        <View style={styles.mainScrollContainer}>
          <View
            style={[
              styles.orderStatusContainer,
              styles.shadowBox,
              styles.boxMain,
            ]}>
            <GlobalText>Order Status</GlobalText>
          </View>
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Order Details
            </GlobalText>
          </View>
          <View style={[styles.shadowBox, styles.boxMain]}>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText>Order Date & Time</GlobalText>
                </View>
                <View>
                  <GlobalText style={styles.boldFont}>
                    {moment(data?.transactionDate).format('DD MMM YYYY')}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText>Subtotal</GlobalText>
                </View>
                <View>
                  <GlobalText style={styles.boldFont}>
                    {CurrencyFormatter(data?.totalGrossAmount)}
                  </GlobalText>
                </View>
              </View>
            </View>
            {data?.deliveryFee ? (
              <View style={styles.listOrderDetailContainer}>
                <View style={styles.orderStatusContainer}>
                  <View>
                    <GlobalText>Delivery Fee</GlobalText>
                  </View>
                  <View>
                    <GlobalText style={styles.boldFont}>
                      {CurrencyFormatter(data?.deliveryFee)}
                    </GlobalText>
                  </View>
                </View>
              </View>
            ) : null}
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText>Incl. Tax</GlobalText>
                </View>
                <View>
                  <GlobalText style={styles.boldFont}>
                    {data?.inclusiveTax > 0
                      ? CurrencyFormatter(data?.inclusiveTax)
                      : CurrencyFormatter(data?.exclusiveTax)}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View
              style={[
                styles.listOrderDetailContainer,
                styles.gandTotalContainer,
              ]}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText style={styles.grandTotalText}>
                    Grand Total
                  </GlobalText>
                </View>
                <View>
                  <GlobalText style={[styles.boldFont, styles.priceText]}>
                    {CurrencyFormatter(data?.totalNettAmount)}
                  </GlobalText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Payment Details
            </GlobalText>
          </View>
          <View style={[styles.shadowBox, styles.boxMain]}>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View style={styles.paymentDetailsCard}>
                  <PointSvg />
                  <GlobalText style={styles.paymentDetailCardText}>
                    Point
                  </GlobalText>
                </View>
                <View>
                  <GlobalText>
                    {moment(data?.transactionDate).format('DD MMM YYYY')}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View style={styles.paymentDetailsCard}>
                  <VoucherSvg />
                  <GlobalText style={styles.paymentDetailCardText}>
                    Voucher
                  </GlobalText>
                </View>
                <View>
                  <GlobalText>
                    {CurrencyFormatter(data?.totalGrossAmount)}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View style={styles.paymentDetailsCard}>
                  <CardSvg />
                  <GlobalText style={styles.paymentDetailCardText}>
                    Paynow
                  </GlobalText>
                </View>
                <View>
                  <GlobalText>
                    {data?.inclusiveTax > 0
                      ? CurrencyFormatter(data?.inclusiveTax)
                      : CurrencyFormatter(data?.exclusiveTax)}
                  </GlobalText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Ordering Details
            </GlobalText>
          </View>
          <View style={[styles.boxMain, styles.shadowBox]}>
            <View style={styles.orderStatusContainer}>
              <GlobalText style={styles.deliveryText}>Delivery</GlobalText>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={[styles.orderStatusContainer, styles.columnCard]}>
                <View style={styles.paymentDetailsCard}>
                  <MapMarkerSvg />
                  <GlobalText
                    style={[styles.paymentDetailCardText, styles.boldFont]}>
                    Delivery to
                  </GlobalText>
                </View>
                <View style={styles.columnText}>
                  <GlobalText>
                    {moment(data?.transactionDate).format('DD MMM YYYY')}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={[styles.orderStatusContainer, styles.columnCard]}>
                <View style={styles.paymentDetailsCard}>
                  <TruckSvg />
                  <GlobalText
                    style={[styles.paymentDetailCardText, styles.boldFont]}>
                    Deliver by
                  </GlobalText>
                </View>
                <View style={styles.columnText}>
                  <GlobalText>
                    {CurrencyFormatter(data?.totalGrossAmount)}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={[styles.orderStatusContainer, styles.columnCard]}>
                <View style={styles.paymentDetailsCard}>
                  <CalendarBold />
                  <GlobalText
                    style={[styles.paymentDetailCardText, styles.boldFont]}>
                    Date
                  </GlobalText>
                </View>
                <View style={styles.columnText}>
                  <GlobalText>
                    {data?.inclusiveTax > 0
                      ? CurrencyFormatter(data?.inclusiveTax)
                      : CurrencyFormatter(data?.exclusiveTax)}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={styles.listOrderDetailContainer}>
              <View style={[styles.orderStatusContainer, styles.columnCard]}>
                <View style={styles.paymentDetailsCard}>
                  <NotesSvg />
                  <GlobalText
                    style={[styles.paymentDetailCardText, styles.boldFont]}>
                    Notes
                  </GlobalText>
                </View>
                <View style={styles.columnText}>
                  <GlobalText>
                    {data?.inclusiveTax > 0
                      ? CurrencyFormatter(data?.inclusiveTax)
                      : CurrencyFormatter(data?.exclusiveTax)}
                  </GlobalText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>Item Details</GlobalText>
          </View>
        </View>
      </ScrollView>
    </Body>
  );
};

export default React.memo(OrderDetail);

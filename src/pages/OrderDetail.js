/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import GlobalText from '../components/globalText';
import {Body} from '../components/layout';
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
import CalendarBold from '../assets/svg/CalendarBoldSvg';
import NotesSvg from '../assets/svg/NotesSvg';
import useCountdownHooks from '../hooks/time/countdown';
import TimerSvg from '../assets/svg/TimerSvg';
import {permissionDownloadFile} from '../helper/Download';
import {handlePaymentStatus} from '../helper/PaymentStatus';
import DotSvg from '../assets/svg/DotSvg';
import NotesProduct from '../assets/svg/NotesProductSvg';
import ArrowBottom from '../assets/svg/ArrowBottom';

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
      marginBottom: 12,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    listOrderDetailContainer: {
      // marginTop: 12,
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
      flex: 1,
      width: '100%',
    },
    paymentDetailCardText: {
      marginLeft: 8,
    },
    shadowBox: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: colors.greyScale2,
      elevation: 2,
      paddingVertical: 6,
      marginBottom: 24,
      borderRadius: 8,
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
    },

    boxMain: {
      marginTop: 8,
      width: '100%',
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
      width: '100%',
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
    scrollContainerMain: {
      paddingBottom: 150,
    },
    quantityContainer: {
      height: 22,
      width: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    primaryColor: {
      color: colors.primary,
    },
    mediumFont: {
      fontFamily: fontFamily.poppinsMedium,
    },
    referenceNoContainer: {
      padding: 8,
      backgroundColor: colors.greyScale4,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    referenceNoText: {
      fontFamily: fontFamily.poppinsMedium,
      fontSize: 12,
      color: colors.greyScale2,
    },
    listModifier: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dotModifier: {
      marginRight: 8,
    },
    priceMain: {
      marginLeft: 'auto',
      fontSize: 16,
      fontFamily: fontFamily.poppinsMedium,
      color: colors.primary,
    },
    modifierText: {
      color: colors.greyScale2,
      fontFamily: fontFamily.poppinsMedium,
    },
    notesProductContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notesIcon: {
      marginRight: 8,
    },
    noteText: {
      color: colors.greyScale2,
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    moreItemText: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsMedium,
    },
  });
  return {styles, colors};
};

const OrderDetail = ({data}) => {
  const {styles, colors} = useStyles();
  const {time, timerId, countdownStart} = useCountdownHooks();
  const [showQrCode, setShowQrCode] = React.useState(true);
  const [showAllOrder, setShowAllOrder] = React.useState(false);
  const staustPending = 'PENDING_PAYMENT';
  const onFinish = () => {
    setShowQrCode(false);
  };

  const toggleOrder = () => setShowAllOrder(prevState => !prevState);

  const downloadQrCode = async () => {
    permissionDownloadFile(data?.action?.url, 'qrcode', 'image/png', false, {
      title: 'Imaged Saved',
      description: 'Successfully saved image to your gallery',
    });
  };
  const calculatePaymentAmount = () => {
    const mappingAmount =
      data?.payments?.map(product => product.paymentAmount) || [];
    const sumAll = mappingAmount.reduce((a, b) => a + b);
    return CurrencyFormatter(sumAll);
  };

  const renderItemDetails = ({item, index}) => {
    if (!showAllOrder && index > 0) return null;
    return (
      <View key={index} style={[styles.shadowBox, styles.boxMain]}>
        <View style={styles.listOrderDetailContainer}>
          <View style={[styles.orderStatusContainer, styles.columnCard]}>
            <View style={styles.paymentDetailsCard}>
              <View style={styles.quantityContainer}>
                <GlobalText style={styles.waitingPaymentStyle}>
                  {item?.quantity}x
                </GlobalText>
              </View>
              <GlobalText
                style={[styles.paymentDetailCardText, styles.boldFont]}>
                {item?.product?.name}{' '}
                <GlobalText style={styles.primaryColor}>
                  + {item?.retailPrice}{' '}
                </GlobalText>
              </GlobalText>
              <GlobalText />
              <GlobalText style={styles.priceMain}>
                {CurrencyFormatter(item?.nettAmount)}
              </GlobalText>
            </View>
            <View style={styles.columnText}>
              {item?.modifiers?.map(data => (
                <>
                  {data?.modifier?.details?.map((modify, index) => (
                    <View key={index} style={styles.listModifier}>
                      <View style={styles.dotModifier}>
                        <DotSvg color={colors.greyScale2} />
                      </View>
                      <View>
                        <GlobalText style={styles.modifierText}>
                          <GlobalText style={styles.primaryColor}>
                            {modify?.quantity}x{' '}
                          </GlobalText>
                          {modify?.name}{' '}
                          <GlobalText style={styles.primaryColor}>
                            + {modify?.price}{' '}
                          </GlobalText>{' '}
                        </GlobalText>
                      </View>
                    </View>
                  ))}
                </>
              ))}
              {handleRemarkProduct(item)}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleRemarkProduct = item => {
    if (item.remark) {
      return (
        <>
          <View style={styles.divider} />

          <View style={styles.notesProductContainer}>
            <View style={styles.notesIcon}>
              <NotesProduct />
            </View>
            <GlobalText style={styles.noteText}>{item.remark} </GlobalText>
          </View>
        </>
      );
    }
    return null;
  };

  const renderPaymentDetail = ({item, index}) => (
    <View style={[styles.shadowBox, styles.boxMain]}>
      {item?.paymentType === 'point' ? (
        <View style={styles.listOrderDetailContainer}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <PointSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                Point
              </GlobalText>
            </View>
            <View>
              <GlobalText style={styles.primaryColor}>
                {calculatePaymentAmount()}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
      {item?.paymentType === 'voucher' ? (
        <View style={styles.listOrderDetailContainer}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <VoucherSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                Voucher
              </GlobalText>
            </View>
            <View>
              <GlobalText style={styles.primaryColor}>
                {calculatePaymentAmount()}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
      {item?.paymentType === 'FOMO_PAY' ? (
        <View style={styles.listOrderDetailContainer}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <CardSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                {item.paymentName}
              </GlobalText>
            </View>
            <View>
              <GlobalText style={styles.primaryColor}>
                {calculatePaymentAmount()}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );

  const renderAddress = () => {
    if (data?.orderingMode === 'DELIVERY') {
      return (
        <View style={[styles.boxMain, styles.shadowBox]}>
          <View style={styles.orderStatusContainer}>
            <GlobalText style={styles.deliveryText}>
              {data?.orderingMode}{' '}
            </GlobalText>
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
                  {data?.deliveryAddress?.recipient?.name} |{' '}
                  {data?.deliveryAddress?.recipient?.phoneNumber}
                </GlobalText>
                <GlobalText>
                  {data?.deliveryAddress?.streetName}{' '}
                  {data?.deliveryAddress?.unitNo}
                  {data?.deliveryAddress?.postalCode}
                </GlobalText>
              </View>
            </View>
          </View>
          <View style={styles.listOrderDetailContainer}>
            <View style={[styles.orderStatusContainer, styles.columnCard]}>
              <View style={styles.paymentDetailsCard}>
                <MapMarkerSvg />
                <GlobalText
                  style={[styles.paymentDetailCardText, styles.boldFont]}>
                  Deliver by
                </GlobalText>
              </View>
              <View style={styles.columnText}>
                <GlobalText>
                  {data?.deliveryProviderName} -{' '}
                  {CurrencyFormatter(data?.deliveryFee)}
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
                  {data?.orderActionDate} {data?.orderActionTimeSlot}
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
                <GlobalText>{data?.remark}</GlobalText>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.boxMain, styles.shadowBox]}>
        <View style={styles.orderStatusContainer}>
          <GlobalText style={styles.deliveryText}>
            {data?.orderingMode}{' '}
          </GlobalText>
        </View>
        <View style={styles.listOrderDetailContainer}>
          <View style={[styles.orderStatusContainer, styles.columnCard]}>
            <View style={styles.paymentDetailsCard}>
              <MapMarkerSvg />
              <GlobalText
                style={[styles.paymentDetailCardText, styles.boldFont]}>
                From Outlet
              </GlobalText>
            </View>
            <View style={styles.columnText}>
              <GlobalText>{data?.outlet?.name}</GlobalText>
              <GlobalText>
                {data?.outlet?.location} {data?.outlet?.location?.postalCode}
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
                Date & Time
              </GlobalText>
            </View>
            <View style={styles.columnText}>
              <GlobalText>
                {data?.orderActionDate} {data?.orderActionTimeSlot}
              </GlobalText>
            </View>
          </View>
        </View>
        {data.remark ? (
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
                <GlobalText>{data?.remark}</GlobalText>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const handleItemText = () => {
    if (data?.details?.length > 1) {
      return ' Items';
    }
    return 'Item';
  };

  React.useEffect(() => {
    countdownStart(onFinish, data?.action?.expiry);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
    <Body>
      {data?.status === staustPending && showQrCode ? (
        <View style={styles.waitingPaymentBox}>
          <GlobalText style={styles.waitingPaymentStyle}>
            Waiting for payment {time.hours}:{time.minutes}:{time.seconds}
          </GlobalText>
          <View style={styles.clockIcon}>
            <TimerSvg />
          </View>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContainerMain}
        style={styles.scrollContainer}>
        {data?.status === staustPending && showQrCode ? (
          <>
            <View style={styles.qrContainer}>
              <Image style={styles.qrImage} source={{uri: data?.action?.url}} />
            </View>
            <View style={styles.btnContainer}>
              <View style={styles.btnMainContainer}>
                <GlobalButton
                  onPress={downloadQrCode}
                  isOutline
                  title="SAVE QR CODE TO GALLERY"
                />
              </View>
            </View>
          </>
        ) : null}

        <View />
        <View style={styles.mainScrollContainer}>
          <View
            style={[
              styles.orderStatusContainer,
              styles.shadowBox,
              styles.boxMain,
            ]}>
            <GlobalText>Order Status</GlobalText>
            <GlobalText style={styles.boldFont}>
              {handlePaymentStatus(data?.status)}
            </GlobalText>
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
                    {moment(data?.transactionDate).format('DD MMM YYYY')}{' '}
                    <DotSvg /> {moment(data?.transactionDate).format('HH:mm')}
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
          <FlatList
            data={data?.payments || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPaymentDetail}
          />
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Ordering Details
            </GlobalText>
          </View>
          {renderAddress()}
          <TouchableOpacity
            onPress={toggleOrder}
            style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Item Details ({data?.details?.length} {handleItemText()})
            </GlobalText>
            {data?.details?.length > 1 && (
              <View style={[styles.notesProductContainer, styles.mlAuto]}>
                <GlobalText style={[styles.moreItemText]}>
                  {data?.details?.length - 1} More Item
                </GlobalText>
                <ArrowBottom />
              </View>
            )}
          </TouchableOpacity>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data?.details || []}
            renderItem={renderItemDetails}
          />
          <View style={styles.referenceNoContainer}>
            <View>
              <GlobalText style={styles.referenceNoText}>
                Reference No.
              </GlobalText>
            </View>
            <View>
              <GlobalText style={styles.referenceNoText}>
                {data?.transactionRefNo}
              </GlobalText>
            </View>
          </View>
        </View>
      </ScrollView>
    </Body>
  );
};

export default React.memo(OrderDetail);

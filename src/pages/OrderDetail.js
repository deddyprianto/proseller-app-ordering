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
import QRCode from 'react-native-qrcode-svg';

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
import TimerSvg from '../assets/svg/TimerSvg';
import {permissionDownloadFile} from '../helper/Download';
import {handlePaymentStatus} from '../helper/PaymentStatus';
import DotSvg from '../assets/svg/DotSvg';
import NotesProduct from '../assets/svg/NotesProductSvg';
import ArrowBottom from '../assets/svg/ArrowBottomSvg';
import useCountdownV2 from '../hooks/time/useCountdownV2';
import CreditCard from '../assets/svg/CreditCardSvg';
import SuccessSvg from '../assets/svg/SuccessSvg';
import ProductCartItemCart2 from '../components/productCartList/components/ProductCartItemCart2';
import HandsSvg from '../assets/svg/HandsSvg';
import MapSvg from '../assets/svg/MapSvg';
import appConfig from '../config/appConfig';
import useOrder from '../hooks/order/useOrder';

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
      marginTop: 0,
    },
    mt12: {
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
      flex: 1,
      width: '100%',
    },
    paymentDetailCardText: {
      marginLeft: 8,
      fontFamily: fontFamily.poppinsMedium,
      color: '#343A4A',
      width: '60%',
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
      fontFamily: fontFamily.poppinsSemiBold,
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
      fontFamily: fontFamily.poppinsMedium,
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    moreItemText: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsMedium,
    },
    p12: {
      padding: 12,
    },
    mt16: {
      marginTop: 16,
    },
    dashStyle: {
      marginVertical: 12,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 1,
      borderColor: colors.primary,
    },
    grayColor: {
      color: '#343A4A',
    },
    mv6: {
      marginVertical: 6,
    },
    darkGrey: {
      color: '#737373',
    },
    successContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paymentSuccessText: {
      fontSize: 24,
      fontFamily: fontFamily.poppinsSemiBold,
      marginBottom: 16,
    },
    productContainer: {
      marginVertical: 16,
    },
    row: {
      flexDirection: 'row',
    },
    selectionTitle: {
      marginLeft: 10,
      fontFamily: fontFamily.poppinsBold,
    },
    textColor: {
      color: '#343A4A',
    },
    normalFont: {
      fontFamily: fontFamily.poppinsMedium,
    },
    greyText: {
      color: colors.greyScale5,
    },
    mt8: {
      marginTop: 8,
    },
    mb16: {
      marginBottom: 16,
    },
    root: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
    dividerTitle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      backgroundColor: 'white',
      paddingHorizontal: 16,
      fontFamily: fontFamily.poppinsBold,
      fontSize: 16,
    },

    availableTextDate: {
      marginVertical: 8,
      fontSize: 12,
      fontFamily: fontFamily.poppinsMedium,
      color: colors.textBrand,
    },
    centerComponent: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    dividerItem: {
      height: 1,
      backgroundColor: 'black',
      width: '100%',
      position: 'absolute',
      top: '50%',
    },
  });
  return {styles, colors};
};

const OrderDetail = ({data, isFromPaymentPage}) => {
  const {styles} = useStyles();
  const {minutes, seconds, isTimeEnd} = useCountdownV2(data);
  const [showAllOrder, setShowAllOrder] = React.useState(false);
  const [showAllPreOrder, setShowAllPreOrder] = React.useState(false);
  const staustPending = 'PENDING_PAYMENT';

  const {
    groupingeOrder,
    defaultOrder,
    listPreorder,
    availDate,
    listSelfSelection,
  } = useOrder();
  const toggleOrder = () => setShowAllOrder(prevState => !prevState);
  const togglePreOrder = () => setShowAllPreOrder(prevState => !prevState);
  const preorder_item = 'Preorder Items';
  const ready_items = 'Ready Items';
  const downloadQrCode = async () => {
    permissionDownloadFile(data?.action?.url, `qrcode${data.id}`, 'image/png', {
      title: 'Imaged Saved',
      description: 'Successfully saved image to your gallery.',
    });
  };

  const renderItemDetails = ({item, index}) => {
    if (!showAllOrder && index > 0) return null;
    return (
      <ProductCartItemCart2
        containerStyle={{marginHorizontal: 0}}
        item={item}
      />
    );
  };

  const renderItemPreOrder = ({item, index}) => {
    if (!showAllPreOrder && index > 0) return null;
    return (
      <ProductCartItemCart2
        containerStyle={{marginHorizontal: 0}}
        item={item}
      />
    );
  };

  React.useEffect(() => {
    if (data) {
      groupingeOrder(data?.details || []);
    }
  }, [data]);

  const renderPaymentDetail = ({item}) => (
    <View>
      {item?.paymentType === 'point' ? (
        <View style={[styles.listOrderDetailContainer, styles.mv6]}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <PointSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                Point
              </GlobalText>
            </View>
            <View>
              <GlobalText style={[styles.primaryColor, styles.mediumFont]}>
                {CurrencyFormatter(item?.paymentAmount)}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
      {item?.paymentType === 'voucher' ? (
        <View style={[styles.listOrderDetailContainer, styles.mv6]}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <VoucherSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                Voucher
              </GlobalText>
            </View>
            <View>
              <GlobalText style={[styles.primaryColor, styles.mediumFont]}>
                {CurrencyFormatter(item?.paymentAmount)}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
      {item?.paymentType === 'FOMO_PAY' ? (
        <View style={[styles.listOrderDetailContainer, styles.mv6]}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <CardSvg />
              <GlobalText style={styles.paymentDetailCardText}>
                {item.paymentName}
              </GlobalText>
            </View>
            <View>
              <GlobalText style={[styles.primaryColor, styles.mediumFont]}>
                {CurrencyFormatter(item?.paymentAmount)}
              </GlobalText>
            </View>
          </View>
        </View>
      ) : null}
      {item?.paymentType === 'Stripe' ? (
        <View style={[styles.listOrderDetailContainer, styles.mv6]}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <CreditCard />
              <GlobalText style={styles.paymentDetailCardText}>
                {item.paymentName}
              </GlobalText>
            </View>
            <View>
              <GlobalText style={[styles.primaryColor, styles.mediumFont]}>
                {CurrencyFormatter(item?.paymentAmount)}
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
        <View style={[styles.boxMain, styles.shadowBox, styles.p12]}>
          <View style={styles.orderStatusContainer}>
            <GlobalText style={styles.deliveryText}>
              {data?.orderingMode}{' '}
            </GlobalText>
          </View>
          <View style={[styles.listOrderDetailContainer, styles.mt12]}>
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
          <View style={styles.dashStyle} />
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
          <View style={styles.dashStyle} />

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
                  Will be deliver on{' '}
                  {moment(data?.orderActionDate).format('DD MMM YYYY')}{' '}
                  {data?.orderActionTimeSlot}
                </GlobalText>
              </View>
            </View>
          </View>

          {data.remark ? (
            <>
              <View style={styles.dashStyle} />

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
            </>
          ) : null}
        </View>
      );
    }
    return (
      <View style={[styles.boxMain, styles.shadowBox, styles.p12]}>
        <View style={styles.orderStatusContainer}>
          <GlobalText style={styles.deliveryText}>
            {data?.orderingMode}{' '}
          </GlobalText>
        </View>
        <View style={[styles.listOrderDetailContainer]}>
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
              {data?.outlet.location ? (
                <GlobalText>
                  {data?.outlet?.location} {data?.outlet?.location?.postalCode}
                </GlobalText>
              ) : null}
            </View>
          </View>
        </View>
        <View style={styles.dashStyle} />
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
          <>
            <View style={styles.dashStyle} />
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
          </>
        ) : null}
      </View>
    );
  };

  const handleItemText = data => {
    if (data?.length > 1) {
      return ' Items';
    }
    return 'Item';
  };
  const renderIsItemSelection = () => {
    if (listSelfSelection.length > 0) {
      return (
        <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
          <View style={styles.row}>
            <HandsSvg />
            <GlobalText style={[styles.selectionTitle, styles.textColor]}>
              Items Selections
            </GlobalText>
            <GlobalText style={[styles.mlAuto, styles.normalFont]}>
              {data?.isSelfSelection ? 'Chosen by Customer' : 'Chosen by Staff'}
            </GlobalText>
          </View>
          <View>
            <GlobalText
              style={[styles.greyText, styles.normalFont, styles.mt8]}>
              {data?.isSelfSelection
                ? `Please visit the selected outlet for item selection before ${moment(
                    data?.orderActionDate,
                  ).format('DD MMM YYYY')} ${data?.orderActionTimeSlot}`
                : 'Staff assistance provided on choosing your items.'}
            </GlobalText>
          </View>
          {data?.isSelfSelection ? (
            <>
              <View style={styles.dashStyle} />
              <View style={styles.row}>
                <MapSvg />
                <GlobalText style={[styles.selectionTitle, styles.textColor]}>
                  Outlet
                </GlobalText>
              </View>
              <View style={styles.mt8}>
                <GlobalText>{data?.outlet?.name} </GlobalText>
                <GlobalText>{data?.outlet?.address} </GlobalText>
              </View>
            </>
          ) : null}
        </View>
      );
    }
  };

  const renderHeader = (title, containerStyle, isPreOrder) => (
    <>
      <View style={styles.centerComponent}>
        <View style={[styles.dividerTitle, containerStyle]}>
          <View style={styles.dividerItem} />
          <GlobalText style={styles.titleText}>{title}</GlobalText>
        </View>
        {isPreOrder && availDate ? (
          <GlobalText style={styles.availableTextDate}>
            Available on {moment(availDate).format('DD MMM YYYY')}
          </GlobalText>
        ) : null}
      </View>
    </>
  );

  return (
    <Body>
      {data?.status === staustPending && !isTimeEnd ? (
        <View style={styles.waitingPaymentBox}>
          <GlobalText style={styles.waitingPaymentStyle}>
            Waiting for payment {minutes}:{seconds}
          </GlobalText>
          <View style={styles.clockIcon}>
            <TimerSvg />
          </View>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContainerMain}
        style={styles.scrollContainer}>
        {data?.status === staustPending && !isTimeEnd ? (
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
        {isFromPaymentPage ? (
          <View style={styles.successContainer}>
            <SuccessSvg />
            <GlobalText style={styles.paymentSuccessText}>
              Payment Success
            </GlobalText>
          </View>
        ) : null}

        {appConfig.appName === 'fareastflora' && data?.transactionRefNo ? (
          <View style={[styles.qrContainer, styles.mt16, styles.mb16]}>
            <GlobalText>Scan this QR Code in Delivery Counter</GlobalText>
            <View style={styles.mt12}>
              <QRCode size={200} value={data.transactionRefNo} />
            </View>
          </View>
        ) : null}

        <View />
        <View style={styles.mainScrollContainer}>
          <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
            <View style={styles.orderStatusContainer}>
              <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                Order Status
              </GlobalText>
              <GlobalText style={[styles.boldFont, styles.grayColor]}>
                {handlePaymentStatus(data?.status)}
              </GlobalText>
            </View>
            {data?.cancelationReason ? (
              <View style={styles.mlAuto}>
                <GlobalText style={[styles.darkGrey, styles.mediumFont]}>
                  {data.cancelationReason?.text}
                </GlobalText>
              </View>
            ) : null}
          </View>
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Order Details
            </GlobalText>
          </View>
          <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
            <View style={styles.listOrderDetailContainer}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                    Order Date & Time
                  </GlobalText>
                </View>
                <View>
                  <GlobalText
                    style={[
                      styles.boldFont,
                      styles.grayColor,
                      {flexDirection: 'row'},
                    ]}>
                    {moment(data?.transactionDate).format('DD MMM YYYY')}
                    {'  '}
                    <DotSvg />
                    {'  '}
                    {''}
                    {moment(data?.transactionDate).format('HH:mm')}
                  </GlobalText>
                </View>
              </View>
            </View>
            <View style={[styles.listOrderDetailContainer, styles.mt16]}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                    Subtotal
                  </GlobalText>
                </View>
                <View>
                  <GlobalText style={[styles.boldFont, styles.grayColor]}>
                    {CurrencyFormatter(data?.totalGrossAmount)}
                  </GlobalText>
                </View>
              </View>
            </View>
            {data?.deliveryFee ? (
              <View style={[styles.listOrderDetailContainer, styles.mt16]}>
                <View style={styles.orderStatusContainer}>
                  <View>
                    <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                      Delivery Fee
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText style={styles.boldFont}>
                      {CurrencyFormatter(data?.deliveryFee)}
                    </GlobalText>
                  </View>
                </View>
              </View>
            ) : null}
            <View style={[styles.listOrderDetailContainer, styles.mt16]}>
              <View style={styles.orderStatusContainer}>
                <View>
                  <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                    Incl. Tax
                  </GlobalText>
                </View>
                <View>
                  <GlobalText style={[styles.boldFont, styles.grayColor]}>
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
                  <GlobalText style={[styles.grandTotalText, styles.grayColor]}>
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
              Ordering Type Details
            </GlobalText>
          </View>
          {renderIsItemSelection()}
          {renderAddress()}
          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Payment Details
            </GlobalText>
          </View>
          <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
            <FlatList
              data={data?.payments || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPaymentDetail}
            />
          </View>
          {defaultOrder.length > 0 ? (
            <>
              {renderHeader(ready_items, {marginBottom: 16})}

              <TouchableOpacity
                onPress={toggleOrder}
                style={styles.orderDetailWrapCOntainer}>
                <GlobalText style={styles.oredrDetailText}>
                  Item Details ({defaultOrder.length}{' '}
                  {handleItemText(defaultOrder)})
                </GlobalText>
                {defaultOrder.length > 1 && (
                  <View style={[styles.notesProductContainer, styles.mlAuto]}>
                    <GlobalText style={[styles.moreItemText]}>
                      {defaultOrder.length - 1} More Item
                    </GlobalText>
                    <ArrowBottom />
                  </View>
                )}
              </TouchableOpacity>
              {defaultOrder.length > 0 ? (
                <View style={styles.productContainer}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={defaultOrder || []}
                    renderItem={renderItemDetails}
                  />
                </View>
              ) : null}
            </>
          ) : null}
          {listPreorder.length > 0 ? (
            <>
              {renderHeader(preorder_item, {marginBottom: 16}, true)}
              <TouchableOpacity
                onPress={togglePreOrder}
                style={styles.orderDetailWrapCOntainer}>
                <GlobalText style={styles.oredrDetailText}>
                  Item Details ({listPreorder.length}{' '}
                  {handleItemText(listPreorder)})
                </GlobalText>
                {listPreorder.length > 1 && (
                  <View style={[styles.notesProductContainer, styles.mlAuto]}>
                    <GlobalText style={[styles.moreItemText]}>
                      {listPreorder.length - 1} More Item
                    </GlobalText>
                    <ArrowBottom />
                  </View>
                )}
              </TouchableOpacity>
              {listPreorder.length > 0 ? (
                <View style={styles.productContainer}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={listPreorder || []}
                    renderItem={renderItemPreOrder}
                  />
                </View>
              ) : null}
            </>
          ) : null}

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

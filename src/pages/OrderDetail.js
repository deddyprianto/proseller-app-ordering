/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
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
import MapMarkerSvg from '../assets/svg/MapMarkerSvg';
import CalendarBold from '../assets/svg/CalendarBoldSvg';
import NotesSvg from '../assets/svg/NotesSvg';
import TimerSvg from '../assets/svg/TimerSvg';
import {permissionDownloadFile} from '../helper/Download';
import {handlePaymentStatus} from '../helper/PaymentStatus';
import DotSvg from '../assets/svg/DotSvg';
import ArrowBottom from '../assets/svg/ArrowBottomSvg';
import useCountdownV2 from '../hooks/time/useCountdownV2';
import CreditCard from '../assets/svg/CreditCardSvg';
import SuccessSvg from '../assets/svg/SuccessSvg';
import ProductCartItemCart2 from '../components/productCartList/components/ProductCartItemCart2';
import HandsSvg from '../assets/svg/HandsSvg';
import MapSvg from '../assets/svg/MapSvg';
import useOrder from '../hooks/order/useOrder';
import additionalSetting from '../config/additionalSettings';
import ArrowUpSvg from '../assets/svg/ArrowUpSvg';
import useCalculation from '../hooks/calculation/useCalculation';
import useOrderingTypes from '../hooks/orderingTypes/useOrderingTypes';
import ModalDeliveryDetail from '../components/modal/ModalDeliveryDetail';
import ThreeDotCircle from '../assets/svg/ThreeDotCircle';
import awsConfig from '../config/awsConfig';
import {Actions} from 'react-native-router-flux';
import TruckSvg from '../assets/svg/TruckSvg';
import {useDispatch, useSelector} from 'react-redux';
import {HistoryNotificationModal} from '../components/modal';
import {openPopupNotification} from '../actions/order.action';
import {GET_TRANSACTION_BY_REFERENCE_NO} from '../constant/order';
import LoadingScreen from '../components/loadingScreen';
import appConfig from '../config/appConfig';

const useStyles = () => {
  const {colors, fontFamily, fontSize} = Theme();
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
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
      color: 'black',
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

    textQueueNumber1: {
      color: colors.textPrimary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },

    textQueueNumber2: {
      color: colors.textPrimary,
      fontSize: fontSize[24],
      fontFamily: fontFamily.poppinsMedium,
    },

    viewQueueNumber: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
      color: colors.brandTertiary,
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
      color: 'black',
    },
    mv6: {
      marginVertical: 6,
    },
    pv6: {
      paddingVertical: 6,
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
      color: 'black',
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
    containerItem: {
      marginHorizontal: 0,
      marginTop: 16,
    },
    orderStatusTitle: {
      width: '30%',
    },
    orderStatus: {
      width: '70%',
      alignItems: 'flex-end',
    },
    taxIncl: {
      color: colors.textTertiary,
    },
    scanThisCode: {
      marginTop: 16,
      marginBottom: 6,
      fontWeight: '500',
      fontSize: 16,
      textAlign: 'center',
    },
    pleaseScanText: {
      fontWeight: '500',
      fontSize: 14,
      textAlign: 'center',
      color: colors.background,
    },
    iconCheck: {
      width: 30,
      height: 30,
      tintColor: colors.background,
    },
    viewIcon: {
      width: 30,
      height: 30,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.successColor,
      marginRight: 10,
    },
    containerSuccessLabel: {
      fontFamily: fontFamily.poppinsSemiBold,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 22,
    },
    successText: {
      color: colors.successColor,
    },
    containerQRCodeWithLabel: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      width: screenWidth * 0.9,
      height: screenHeight * 0.525,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomQRLabel: {
      backgroundColor: colors.primary,
      width: '100%',
      height: 87,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    whiteText: {
      color: colors.background,
    },
    verifyYourItem: {
      fontFamily: fontFamily.poppinsBold,
      color: colors.background,
      fontSize: 16,
    },
    unverifiedText: {
      color: colors.errorColor,
    },
  });
  return {styles, colors};
};

const OrderDetail = ({data: dataParent, isFromPaymentPage, step, handleBackPress}) => {
  const {styles} = useStyles();
  const [data, setData] = React.useState(dataParent);
  const {minutes, seconds, isTimeEnd} = useCountdownV2(dataParent);
  const [showAllOrder, setShowAllOrder] = React.useState(false);
  const [showAllPreOrder, setShowAllPreOrder] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const {
    checkTaxHandle,
    checkTaxExclusive,
    checkTaxInclusive,
  } = useCalculation();
  const pendingPayment = 'PENDING_PAYMENT';
  const store_checkout = 'STORECHECKOUT';
  const {
    groupingeOrder,
    defaultOrder,
    listPreorder,
    availDate,
    listSelfSelection,
    itemListWithoutRounding,
    calculateRoundingItem,
    handleGetOrderDetail,
  } = useOrder();
  const [updateData, setUpdatData] = React.useState(false);
  const [showDetailDelivery, setShowDetailDelivery] = React.useState(false);
  const [listItems, setListItems] = React.useState([]);
  const toggleOrder = () => setShowAllOrder(prevState => !prevState);
  const togglePreOrder = () => setShowAllPreOrder(prevState => !prevState);
  const preorder_item = 'Preorder Items';
  const {handleOrderingType, handleDisplayName} = useOrderingTypes();
  const ready_items = 'Ready Items';
  const completeOrder = 'COMPLETED';
  const RETAIL = 'RETAIL';
  const showPopup = useSelector(
    state => state?.orderReducer?.popupNotification?.openPopup,
  );
  const dispatch = useDispatch();
  const notificationData = useSelector(
    state => state?.orderReducer?.notificationData?.notificationData,
  );

  const downloadQrCode = async () => {
    permissionDownloadFile(data?.action?.url, `qrcode${data.id}`, 'image/png', {
      title: 'QR Code Saved Successfully',
      description:
        'You can finalize the payment by uploading the QR Code to the payment platform.',
    });
  };
  React.useEffect(() => {
    handleOrderingType();
  }, []);
  React.useEffect(() => {
    const filtered = defaultOrder.filter(
      obj => obj.id !== 'VOUCHER_FORFEITED_AMOUNT',
    );
    const temp = additionalSetting().showForfeitedItemInTransaction
      ? defaultOrder
      : filtered;
    setListItems(temp);
  }, [defaultOrder]);
  React.useEffect(() => {
    if (data?.status === pendingPayment) {
      let tempInterval = setInterval(async () => {
        await getData();
      }, 30000);
      if (count > 20) {
        clearInterval(tempInterval);
      }
      return () => clearInterval(tempInterval);
    }
  }, [count]);
  React.useEffect(() => {
    const fetchData = () => {
      if (isTimeEnd) {
        setTimeout(async () => {
          await getData();
        }, 1000);
      }
    };
    fetchData();
  }, [isTimeEnd]);

  const getData = async () => {
    const response = await handleGetOrderDetail(data);
    setData(response);
    setCount(prevCount => prevCount + 1);
  };

  const renderItemDetails = ({item, index}) => {
    if (!showAllOrder && index > 0) return null;
    return (
      <ProductCartItemCart2 containerStyle={styles.containerItem} item={item} />
    );
  };

  const renderItemPreOrder = ({item, index}) => {
    if (!showAllPreOrder && index > 0) return null;
    return (
      <ProductCartItemCart2 containerStyle={styles.containerItem} item={item} />
    );
  };

  const closePopup = async () => {
    if (notificationData?.additionalData) {
      getOrderDetail();
    }

    dispatch(openPopupNotification(false));
  };

  const backToHome = () => {
    if (isFromPaymentPage) {
      handleBackPress()
    } else {
      Actions.reset('app', {fromPayment: true});
    }
    return true;
  };

  React.useEffect(() => {
    if (step === 4) {
      BackHandler.addEventListener('hardwareBackPress', backToHome);
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backToHome);
    };
  }, []);

  const getOrderDetail = async () => {
    setUpdatData(true);
    const response = await handleGetOrderDetail(data);
    setData(response);
    setUpdatData(false);
  };

  const toggleDeliveryDetail = () =>
    setShowDetailDelivery(prevState => !prevState);

  React.useEffect(() => {
    if (data) {
      groupingeOrder(itemListWithoutRounding(data) || []);
    }
  }, [data]);

  const renderPaymentDetail = ({item}) => (
    <View>
      {item?.paymentType === 'point' ? (
        <View style={[styles.listOrderDetailContainer, styles.pv6]}>
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
      {item?.paymentType === 'voucher' || item?.paymentType === 'promocode' ? (
        <View style={[styles.listOrderDetailContainer, styles.pv6]}>
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
      {item?.paymentType !== 'voucher' &&
      item?.paymentType !== 'point' &&
      item?.paymentType !== 'promocode' &&
      item?.item?.paymentType !== 'promocode' &&
      item?.paymentAmount > 0 ? (
        <View style={[styles.listOrderDetailContainer, styles.pv6]}>
          <View style={styles.orderStatusContainer}>
            <View style={styles.paymentDetailsCard}>
              <CreditCard />
              <GlobalText style={styles.paymentDetailCardText}>
                {item.paymentName || item?.paymentType}
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
              {handleDisplayName(data?.orderingMode)}{' '}
            </GlobalText>
            {data?.provider?.feeBreakDown ? (
              <TouchableOpacity
                onPress={toggleDeliveryDetail}
                style={styles.mlAuto}>
                <ThreeDotCircle />
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={[styles.listOrderDetailContainer, styles.mt12]}>
            <View style={[styles.orderStatusContainer, styles.columnCard]}>
              <View style={styles.paymentDetailsCard}>
                <MapMarkerSvg />
                <GlobalText
                  style={[styles.paymentDetailCardText, styles.boldFont]}>
                  Delivery To
                </GlobalText>
              </View>
              <View style={styles.columnText}>
                <GlobalText>
                  {data?.deliveryAddress?.recipient?.name} |{' '}
                  {data?.deliveryAddress?.recipient?.phoneNumber}
                </GlobalText>
                <GlobalText>{data?.deliveryAddress?.streetName} </GlobalText>
                <GlobalText>#{data?.deliveryAddress?.unitNo}</GlobalText>
                <GlobalText>SG {data?.deliveryAddress?.postalCode}</GlobalText>
              </View>
            </View>
          </View>
          <View style={styles.dashStyle} />
          <View style={styles.listOrderDetailContainer}>
            <View style={[styles.orderStatusContainer, styles.columnCard]}>
              <View style={styles.paymentDetailsCard}>
                <TruckSvg />
                <GlobalText
                  style={[styles.paymentDetailCardText, styles.boldFont]}>
                  Delivery Provider
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
                  Delivery Date & Time
                </GlobalText>
              </View>
              <View style={styles.columnText}>
                <GlobalText>
                  To be delivered on{' '}
                  {moment(data?.orderActionDate).format('DD MMMM YYYY')}
                </GlobalText>

                <GlobalText>between {data?.orderActionTimeSlot}</GlobalText>
              </View>
            </View>
          </View>

          {data?.remark ? (
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
            {handleDisplayName(data?.orderingMode)}{' '}
          </GlobalText>
        </View>
        <View style={[styles.listOrderDetailContainer]}>
          <View style={[styles.orderStatusContainer, styles.columnCard]}>
            <View style={styles.paymentDetailsCard}>
              <MapMarkerSvg />
              <GlobalText
                style={[styles.paymentDetailCardText, styles.boldFont]}>
                Pickup At
              </GlobalText>
            </View>
            <View style={styles.columnText}>
              <GlobalText>{data?.outlet?.name}</GlobalText>
              {data?.outlet?.location ? (
                <GlobalText>
                  {data?.outlet?.location} {data?.outlet?.location?.postalCode}
                </GlobalText>
              ) : null}
            </View>
          </View>
        </View>
        {data?.orderActionDate || data?.orderActionTimeSlot ? (
          <>
            <View style={styles.dashStyle} />
            <View style={styles.listOrderDetailContainer}>
              <View style={[styles.orderStatusContainer, styles.columnCard]}>
                <View style={styles.paymentDetailsCard}>
                  <CalendarBold />
                  <GlobalText
                    style={[styles.paymentDetailCardText, styles.boldFont]}>
                    Pickup Date & Time
                  </GlobalText>
                </View>
                <View style={styles.columnText}>
                  <GlobalText>
                    To be picked up on{' '}
                    {moment(data?.orderActionDate).format('DD MMMM YYYY')}{' '}
                  </GlobalText>
                  <GlobalText>between {data?.orderActionTimeSlot}</GlobalText>
                </View>
              </View>
            </View>
          </>
        ) : null}

        {data?.remark ? (
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
              Item Selections
            </GlobalText>
            <GlobalText style={[styles.mlAuto, styles.normalFont]}>
              {data?.isSelfSelection
                ? 'Choose by Customer'
                : 'Choose by Seller'}
            </GlobalText>
          </View>
          <View>
            <GlobalText
              style={[styles.greyText, styles.normalFont, styles.mt8]}>
              {data?.isSelfSelection
                ? `Please visit the following outlet before ${moment(
                    data?.selfSelectionDeadline,
                  ).format('DD MMMM YYYY')} for item selection`
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
            Available from {moment(availDate).format('DD MMMM YYYY')}
          </GlobalText>
        ) : null}
      </View>
    </>
  );

  const handleVerified = () => {
    if (data?.orderingMode === store_checkout) {
      const verifiedText = !data?.isVerified ? '(UNVERIFIED)' : '(VERIFIED)';
      const textStyle = !data?.isVerified
        ? styles.unverifiedText
        : styles.successText;

      return (
        <GlobalText style={[styles.boldFont, textStyle]}>
          {verifiedText}
        </GlobalText>
      );
    }
    return '';
  };

  const handleRewardText = () => {
    if (data.status === completeOrder) {
      return `Points earned`;
    }
    return 'Points will be earned';
  };
  return (
    <Body>
      {data?.status === pendingPayment && !isTimeEnd ? (
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
        {data?.status === pendingPayment ? (
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
        {isFromPaymentPage && data?.orderingMode !== store_checkout ? (
          <View style={styles.successContainer}>
            <SuccessSvg />
            <GlobalText style={[styles.paymentSuccessText, styles.mb16]}>
              Payment Success
            </GlobalText>
          </View>
        ) : null}

        {additionalSetting().enableScanAndGo &&
        data?.transactionRefNo &&
        isFromPaymentPage &&
        data?.orderingMode === store_checkout ? (
          <View style={[styles.qrContainer, styles.mt16, styles.mb16]}>
            <View style={[styles.mt12, styles.containerQRCodeWithLabel]}>
              <View style={styles.successContainer}>
                <QRCode size={310} value={data.transactionRefNo} />
              </View>
              <View style={styles.bottomQRLabel}>
                <GlobalText style={styles.verifyYourItem}>
                  Verify your item
                </GlobalText>
                <GlobalText style={styles.pleaseScanText}>
                  Please Scan the QR code at the Exit Verification Counter next
                  to the cashier on Level 1.
                </GlobalText>
              </View>
            </View>
            <View style={styles.containerSuccessLabel}>
              <View style={styles.viewIcon}>
                <Image source={appConfig.iconCheck} style={styles.iconCheck} />
              </View>
              <GlobalText
                style={[styles.paymentSuccessText, styles.successText]}>
                Payment Success
              </GlobalText>
            </View>
          </View>
        ) : null}

        {data?.queueNo &&
          data?.orderingMode !== store_checkout &&
          data?.outlet?.outletType !== RETAIL && (
            <View style={styles.viewQueueNumber}>
              <Text style={styles.textQueueNumber1}>Queue No.</Text>
              <Text style={styles.textQueueNumber2}>{data?.queueNo}</Text>
            </View>
          )}

        <View style={styles.mainScrollContainer}>
          <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
            <View style={styles.orderStatusContainer}>
              <View style={styles.orderStatusTitle}>
                <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                  Order Status
                </GlobalText>
              </View>
              <View style={styles.orderStatus}>
                <GlobalText style={[styles.boldFont, styles.grayColor]}>
                  {handlePaymentStatus(data?.status)}{' '}
                  {additionalSetting().enableScanAndGo && handleVerified()}
                </GlobalText>
              </View>
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
            {data?.totalMembershipDiscountAmount > 0 ? (
              <View style={[styles.listOrderDetailContainer, styles.mt16]}>
                <View style={styles.orderStatusContainer}>
                  <View>
                    <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                      Membership Discount{' '}
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText style={[styles.boldFont, styles.grayColor]}>
                      ({CurrencyFormatter(data?.totalMembershipDiscountAmount)})
                    </GlobalText>
                  </View>
                </View>
              </View>
            ) : null}

            {calculateRoundingItem(data) && calculateRoundingItem(data) > 0 ? (
              <View style={[styles.listOrderDetailContainer, styles.mt16]}>
                <View style={styles.orderStatusContainer}>
                  <View>
                    <GlobalText style={[styles.grayColor, styles.mediumFont]}>
                      Rounding{' '}
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText style={[styles.boldFont, styles.grayColor]}>
                      ({CurrencyFormatter(calculateRoundingItem(data))})
                    </GlobalText>
                  </View>
                </View>
              </View>
            ) : null}

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
            {checkTaxExclusive(data).value ? (
              <View style={[styles.listOrderDetailContainer, styles.mt16]}>
                <View style={styles.orderStatusContainer}>
                  <View>
                    <GlobalText style={[styles.mediumFont]}>
                      {checkTaxExclusive(data).text}
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText style={[styles.boldFont]}>
                      {checkTaxExclusive(data).value}
                    </GlobalText>
                  </View>
                </View>
              </View>
            ) : null}
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
              {checkTaxInclusive(data).value ? (
                <View style={[styles.listOrderDetailContainer, styles.mt8]}>
                  <View style={styles.orderStatusContainer}>
                    <View>
                      <GlobalText style={[styles.mediumFont, styles.taxIncl]}>
                        {checkTaxInclusive(data).text}
                      </GlobalText>
                    </View>
                    <View>
                      <GlobalText style={[styles.boldFont, styles.taxIncl]}>
                        {checkTaxInclusive(data).value}
                      </GlobalText>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.orderDetailWrapCOntainer}>
            <GlobalText style={styles.oredrDetailText}>
              Ordering Type Details
            </GlobalText>
          </View>
          {data?.orderingMode === store_checkout ? (
            <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
              <GlobalText style={styles.deliveryText}>
                {handleDisplayName(data?.orderingMode)}{' '}
              </GlobalText>
            </View>
          ) : (
            <>
              {renderIsItemSelection()}
              {renderAddress()}
            </>
          )}
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

          {data?.earnedPoint > 0 || data?.point > 0 ? (
            <>
              <View style={styles.orderDetailWrapCOntainer}>
                <GlobalText style={styles.oredrDetailText}>Rewards</GlobalText>
              </View>
              <View style={[styles.shadowBox, styles.boxMain, styles.p12]}>
                <View style={styles.orderStatusContainer}>
                  <View style={styles.paymentDetailsCard}>
                    <PointSvg />
                    <GlobalText style={styles.paymentDetailCardText}>
                      {handleRewardText()}{' '}
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText
                      style={[styles.primaryColor, styles.mediumFont]}>
                      {data?.earnedPoint || data?.point}
                    </GlobalText>
                  </View>
                </View>
              </View>
            </>
          ) : null}
          {listItems.length > 0 ? (
            <>
              {listPreorder.length > 0
                ? renderHeader(ready_items, {marginBottom: 16})
                : null}

              <TouchableOpacity
                onPress={toggleOrder}
                style={styles.orderDetailWrapCOntainer}>
                <GlobalText style={styles.oredrDetailText}>
                  Item Details ({listItems.length} {handleItemText(listItems)})
                </GlobalText>
                {listItems.length > 1 && (
                  <View style={[styles.notesProductContainer, styles.mlAuto]}>
                    <GlobalText style={[styles.moreItemText]}>
                      {showAllOrder ? (
                        'Hide Items'
                      ) : (
                        <>{listItems.length - 1} More Item</>
                      )}
                    </GlobalText>
                    {showAllOrder ? <ArrowUpSvg /> : <ArrowBottom />}
                  </View>
                )}
              </TouchableOpacity>
              {listItems.length > 0 ? (
                <View style={styles.productContainer}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={listItems || []}
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
                      {showAllPreOrder ? (
                        'Hide Items'
                      ) : (
                        <>{listPreorder.length - 1} More Item</>
                      )}
                    </GlobalText>
                    {showAllPreOrder ? <ArrowUpSvg /> : <ArrowBottom />}
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

          {additionalSetting().enableScanAndGo &&
          data?.transactionRefNo &&
          !isFromPaymentPage ? (
            <View style={[styles.qrContainer, styles.mt16, styles.mb16]}>
              <View style={styles.mt12}>
                <QRCode size={200} value={data.transactionRefNo} />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <ModalDeliveryDetail
        isVisible={showDetailDelivery}
        closeModal={toggleDeliveryDetail}
        feeBreakDown={data?.provider?.feeBreakDown}
        providerData={data?.provider}
      />
      <HistoryNotificationModal
        value={notificationData}
        open={showPopup}
        handleClose={closePopup}
      />
      <LoadingScreen loading={updateData} />
    </Body>
  );
};

export default React.memo(OrderDetail);

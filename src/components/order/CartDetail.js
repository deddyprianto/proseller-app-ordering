/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import colorConfig from '../../config/colorConfig';
import HandsSvg from '../../assets/svg/HandsSvg';
import DashSvg from '../../assets/svg/DashSvg';
import MapSvg from '../../assets/svg/MapSvg';
import TruckSvg from '../../assets/svg/TruckSvg';
import CalendarBold from '../../assets/svg/CalendarBoldSvg';
import moment from 'moment';
import PointSvg from '../../assets/svg/PointSvg';
import ArrowRight from '../../assets/svg/ArrowRightSvg';
import VoucherSvg from '../../assets/svg/VoucherSvg';
import CreditCard from '../../assets/svg/CreditCard';
import {useSelector} from 'react-redux';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import CheckBox from '@react-native-community/checkbox';
import useCalculation from '../../hooks/calculation/useCalculation';
import GlobalModal from '../modal/GlobalModal';
import GlobalButton from '../button/GlobalButton';
import useSettings from '../../hooks/settings/useSettings';
import ThreeDotCircle from '../../assets/svg/ThreeDotCircle';
import ModalDeliveryDetail from '../modal/ModalDeliveryDetail';
import UsePointModal from '../modal/UsePointModal';
import awsConfig from '../../config/awsConfig';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    orderText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      marginBottom: 12,
    },
    card: {
      borderColor: colorConfig.pageIndex.inactiveTintColor,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      shadowColor: '#00000021',
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.7,
      shadowRadius: 7.49,
      elevation: 2,
      marginHorizontal: 2,
      padding: 12,
    },
    ph16: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    regFont: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    titleCardText: {
      marginLeft: 10,
    },
    boldFont: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    descStyle: {
      marginTop: 8,
    },
    descText: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.greyScale5,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.primary,
      marginVertical: 12,
    },
    mv12: {
      marginVertical: 12,
    },
    mt8: {
      marginTop: 8,
    },
    deliveryText: {
      fontSize: 16,
      color: theme.colors.brandTertiary,
    },
    mr10: {
      marginRight: 10,
    },
    mt12: {
      marginTop: 12,
    },
    smallFont: {
      fontSize: 12,
    },
    mediumFont: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    mediumSize: {
      fontSize: 14,
    },
    mt36: {
      marginTop: 36,
    },
    ph14: {
      paddingHorizontal: 14,
    },
    brandColor: {
      color: theme.colors.brandTertiary,
    },
    primaryColor: {
      color: theme.colors.primary,
    },
    checkBoxStyle: {
      width: 24,
      height: 24,
    },
    ml8: {
      marginLeft: 8,
    },
    p12: {
      padding: 12,
    },
    bgGrey: {
      backgroundColor: '#F9F9F9',
      borderRadius: 8,
    },
    mb36: {
      marginBottom: 36,
    },
    ml32: {
      marginLeft: 32,
    },
    checkboxText: {
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
      marginLeft: 32,
    },
    mt4: {
      marginTop: 4,
    },
    pointText: {
      fontSize: 12,
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    viewSwitcher: {
      width: 32,
      height: 16,
      borderRadius: 100,
      padding: 2,
      backgroundColor: theme.colors.buttonDisabled,
    },
    viewSwitcherActive: {
      width: 32,
      height: 16,
      borderRadius: 100,
      padding: 2,
      backgroundColor: theme.colors.buttonActive,
    },
  });
  return {styles, colors: theme.colors};
};

const CartDetail = ({
  data,
  availableSelection,
  openPoint,
  openVoucher,
  openPayment,
  selectedPaymentMethod,
  vouchers,
  totalAmount,
  myPoint,
  fullPoint,
  totalPointToPay,
  myMoneyPoint,
  isAgreeTnc,
  onAgreeTnc,
  latestSelfSelectionDate,
}) => {
  const {styles, colors} = useStyles();
  const selectedAccount = useSelector(
    state => state.cardReducer?.selectedAccount?.selectedAccount,
  );

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );
  const campaign = useSelector(state => state.rewardsReducer.campaign.campaign);

  const [isSwitchPoint, setIsSwitchPoint] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [totalPointVoucher, setTotalPointVoucher] = React.useState(0);
  const {calculateVoucherPoint} = useCalculation();
  const [isOpenTnc, setIsOpenTnc] = React.useState(false);
  const {checkTncPolicyData} = useSettings();
  const [buttonActive, setButtonActive] = React.useState(false);
  const [showDeliveryDetail, setShowDeliveryDetail] = React.useState(false);
  const handleTextSelection = () => {
    if (data?.isSelfSelection) {
      return {
        title: 'Chosen by Customer',
        description: `Please visit the selected outlet for item selection before ${moment(
          latestSelfSelectionDate || data?.orderActionDate,
        ).format('DD MMMM YYYY')} .`,
      };
    }
    return {
      title: 'Chosen by Staff',
      description: 'Staff assistance provided on choosing your items.',
    };
  };

  const toggleTnc = () => setIsOpenTnc(prevState => !prevState);

  const handleAgreeTnc = value => {
    if (onAgreeTnc && typeof onAgreeTnc === 'function') {
      onAgreeTnc(value);
    }
  };

  const onButtonActive = active => {
    setButtonActive(active);
  };

  const toggleDelivery = () => setShowDeliveryDetail(prevState => !prevState);

  const renderOrderDetail = () => {
    if (data?.cartDetails?.orderingMode.toLowerCase() === 'delivery') {
      return (
        <>
          <View style={[styles.row, styles.mt12]}>
            <View style={styles.mr10}>
              <MapSvg />
            </View>
            <GlobalText style={[styles.boldFont, styles.smallFont]}>
              Delivery To
            </GlobalText>
          </View>
          <View style={styles.mt8}>
            <GlobalText
              style={[styles.smallFont, styles.mediumFont, styles.mediumSize]}>
              {data.deliveryAddress?.recipient?.name} |{' '}
              {data.deliveryAddress?.recipient?.phoneNumber}
            </GlobalText>
          </View>
          <View>
            <GlobalText>{data.deliveryAddress?.streetName}</GlobalText>
          </View>
          <View style={styles.mv12}>
            <DashSvg />
          </View>
          {data.deliveryProvider ? (
            <>
              <View style={styles.row}>
                <View style={styles.mr10}>
                  <TruckSvg />
                </View>
                <GlobalText>Delivery Provider</GlobalText>
                <View style={styles.mlAuto}>
                  <GlobalText>{data?.deliveryProvider?.name}</GlobalText>
                </View>
              </View>
              <View style={styles.mv12}>
                <DashSvg />
              </View>
            </>
          ) : null}
          {data.orderActionDate ? (
            <>
              <View style={styles.row}>
                <View style={styles.mr10}>
                  <CalendarBold />
                </View>
                <GlobalText>Date & Time</GlobalText>
              </View>
              <View>
                <GlobalText>
                  Will be deliver on :{' '}
                  {moment(data?.orderActionDate).format('DD MMMM YYYY')} at{' '}
                  {data?.orderActionTimeSlot}
                </GlobalText>
              </View>
            </>
          ) : null}
        </>
      );
    }
    return (
      <>
        <View style={[styles.row, styles.mt12]}>
          <View style={styles.mr10}>
            <MapSvg />
          </View>
          <GlobalText style={[styles.boldFont, styles.smallFont]}>
            Pickup at
          </GlobalText>
        </View>
        <View style={styles.mt8}>
          <GlobalText
            style={[
              styles.smallFont,
              styles.mediumFont,
              styles.mediumSize,
              styles.primaryColor,
            ]}>
            {data?.cartDetails?.outlet?.name}
          </GlobalText>
        </View>
        <View>
          <GlobalText style={[styles.primaryColor, styles.mt4]}>
            {data?.cartDetails?.outlet?.address}
          </GlobalText>
        </View>

        {data.orderActionDate ? (
          <>
            <View style={styles.mv12}>
              <DashSvg />
            </View>
            <View style={styles.row}>
              <View style={styles.mr10}>
                <CalendarBold />
              </View>
              <GlobalText>Date & Time</GlobalText>
            </View>
            <View style={styles.mt4}>
              <GlobalText>
                {moment(data?.orderActionDate).format('DD MMMM YYYY')} at{' '}
                {data?.orderActionTimeSlot}
              </GlobalText>
            </View>
          </>
        ) : null}
      </>
    );
  };

  React.useEffect(() => {
    const amount = calculateVoucherPoint(vouchers);
    setTotalPointVoucher(amount);
  }, [vouchers, isSwitchPoint]);

  const leftValue = useState(new Animated.Value(0))[0];

  const handleClick = () => {
    const isActive = leftValue._value > 10;
    const value = isActive ? 0 : 16;
    if (isActive) {
      totalPointToPay(0);
    } else {
      totalPointToPay();
    }

    Animated.timing(leftValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    setIsSwitchPoint(!isActive);
  };

  const renderPointSwitcher = () => {
    const stylesView = isSwitchPoint
      ? styles.viewSwitcherActive
      : styles.viewSwitcher;

    return (
      <TouchableOpacity
        onPress={() => {
          handleClick();
        }}
        style={stylesView}>
        <Animated.View
          style={[
            {
              width: 12,
              height: 12,
              borderRadius: 8,
              backgroundColor: 'white',
              marginLeft: leftValue,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };
  const renderPointText = () => {
    const pointWorth = campaign.points.pointsToRebateRatio1;

    if (fullPoint) {
      return (
        <View>
          <GlobalText style={[styles.brandColor, styles.mediumFont]}>
            {fullPoint} points used (worth {CurrencyFormatter(myMoneyPoint)})
          </GlobalText>
        </View>
      );
    } else {
      return (
        <View>
          <GlobalText style={styles.pointText}>
            Available Points {totalPoint} points
          </GlobalText>
          <GlobalText style={styles.pointText}>
            worth {CurrencyFormatter(pointWorth)}
          </GlobalText>
        </View>
      );
    }
  };

  const renderPointType = () => {
    if (awsConfig.COMPANY_NAME === 'Far East Flora') {
      return renderPointSwitcher();
    } else {
      return (
        <View style={styles.mlAuto}>
          <ArrowRight />
        </View>
      );
    }
  };

  const renderPoint = () => {
    return (
      <TouchableOpacity
        disabled={awsConfig.COMPANY_NAME === 'Far East Flora'}
        onPress={() => {
          setIsOpenModal(true);
        }}
        style={[styles.card]}>
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View style={styles.row}>
            <View style={styles.mr10}>
              <PointSvg />
            </View>
            <View>
              <GlobalText>Use Point </GlobalText>
              {renderPointText()}
            </View>
            <View style={[styles.mlAuto, styles.justifyCenter]}>
              {renderPointType()}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderModal = () => {
    const pointWorth = campaign.points.pointsToRebateRatio1;

    const total = totalAmount();
    const payment = total?.payment;

    return (
      <UsePointModal
        open={isOpenModal}
        totalAmount={payment}
        pointBalance={totalPoint}
        pointRatio={pointWorth}
        handleClose={() => {
          setIsOpenModal(false);
        }}
        handleUsePoint={value => {
          totalPointToPay(value);
          setIsOpenModal(false);
        }}
      />
    );
  };

  return (
    <View>
      <GlobalText style={[styles.orderText, styles.ph16]}>
        Order Details
      </GlobalText>
      <View style={[styles.ph14]}>
        {availableSelection?.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <HandsSvg />
              <GlobalText
                style={[
                  styles.titleCardText,
                  styles.boldFont,
                  styles.smallFont,
                ]}>
                Items Selections
              </GlobalText>
              <GlobalText style={[styles.mlAuto, styles.regFont]}>
                {handleTextSelection().title}
              </GlobalText>
            </View>
            <View style={styles.descStyle}>
              <GlobalText style={styles.descText}>
                {handleTextSelection().description}
              </GlobalText>
            </View>
            {data?.isSelfSelection ? (
              <>
                <View style={styles.mv12}>
                  <DashSvg />
                </View>
                <View>
                  <View style={styles.row}>
                    <MapSvg />
                    <GlobalText style={[styles.titleCardText, styles.boldFont]}>
                      Outlet
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText>{data.cartDetails?.outlet?.name}</GlobalText>
                    <GlobalText>{data.cartDetails?.outlet?.address}</GlobalText>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={[{paddingHorizontal: 14}, styles.mt8]}>
        <View style={styles.card}>
          <View style={[styles.row, styles.mt12]}>
            <GlobalText style={[styles.boldFont, styles.deliveryText]}>
              {data?.cartDetails?.orderingMode}{' '}
            </GlobalText>
            {data?.cartDetails?.orderingMode === 'DELIVERY' ? (
              <TouchableOpacity onPress={toggleDelivery} style={styles.mlAuto}>
                <ThreeDotCircle />
              </TouchableOpacity>
            ) : null}
          </View>
          {renderOrderDetail()}
        </View>
      </View>

      <GlobalText style={[styles.orderText, styles.ph16, {marginTop: 36}]}>
        Payment Details
      </GlobalText>
      <View style={styles.ph14}>
        {renderPoint()}
        <TouchableOpacity
          onPress={openVoucher}
          style={[styles.card, styles.mt8]}>
          <View style={styles.row}>
            <View style={styles.mr10}>
              <VoucherSvg />
            </View>
            <GlobalText>Use Voucher</GlobalText>
            <View style={styles.mlAuto}>
              <ArrowRight />
            </View>
          </View>
          {vouchers?.length > 0 ? (
            <View style={styles.mt12}>
              {vouchers.map(voucher => (
                <View>
                  <GlobalText style={[styles.brandColor, styles.mediumFont]}>
                    {voucher?.name}
                  </GlobalText>
                </View>
              ))}
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openPayment}
          style={[styles.card, styles.mt8]}>
          <View style={styles.row}>
            <View style={styles.mr10}>
              <CreditCard />
            </View>
            <GlobalText>Payment Method</GlobalText>
            <View style={styles.mlAuto}>
              <ArrowRight />
            </View>
          </View>
          {selectedAccount ? (
            <View>
              <GlobalText
                style={[styles.brandColor, styles.mediumFont, styles.mt12]}>
                {selectedAccount?.details?.cardIssuer}{' '}
                {selectedPaymentMethod(selectedAccount)}
              </GlobalText>
            </View>
          ) : null}
        </TouchableOpacity>
        <View style={[styles.p12, styles.bgGrey, styles.mt8]}>
          <GlobalText>
            Amount paid by points/vouchers{' '}
            {CurrencyFormatter(totalPointVoucher)}
          </GlobalText>
          <GlobalText>
            Amount paid by {selectedAccount?.details?.cardIssuer}{' '}
            {CurrencyFormatter(data?.totalNettAmount)}{' '}
          </GlobalText>
        </View>
        <View
          style={[
            styles.row,
            styles.mt8,
            {alignItems: 'center', marginTop: 32},
          ]}>
          <CheckBox
            style={styles.checkBoxStyle}
            lineWidth={1}
            boxType="square"
            onFillColor={colors.primary}
            onTintColor={colors.primary}
            onCheckColor={'white'}
            value={isAgreeTnc}
            onValueChange={handleAgreeTnc}
          />
          <GlobalText style={[styles.ml8]}>
            I agree to the{' '}
            <GlobalText onPress={toggleTnc} style={[styles.brandColor]}>
              Terms and Conditions.
            </GlobalText>
          </GlobalText>
        </View>
        <View>
          <GlobalText style={[styles.mt8, styles.ml3, styles.checkboxText]}>
            Tick the checkbox to proceed to payment.
          </GlobalText>
        </View>
      </View>
      <GlobalModal
        title="Terms and Conditions"
        closeModal={toggleTnc}
        isCloseToBottom={onButtonActive}
        titleStyle={styles.titleModal}
        stickyBottom={
          <View>
            <GlobalButton
              disabled={!buttonActive}
              onPress={toggleTnc}
              title="Understood"
            />
          </View>
        }
        isVisible={isOpenTnc}>
        <GlobalText>{checkTncPolicyData().tnc?.settingValue}</GlobalText>
      </GlobalModal>
      <ModalDeliveryDetail
        closeModal={toggleDelivery}
        isVisible={showDeliveryDetail}
      />
      {renderModal()}
    </View>
  );
};

export default React.memo(CartDetail);

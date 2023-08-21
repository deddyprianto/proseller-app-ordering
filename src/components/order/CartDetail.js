import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
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
      color: theme.colors.brandPrimary,
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
  myPoint,
  myMoneyPoint,
}) => {
  const {styles, colors} = useStyles();
  const selectedAccount = useSelector(
    state => state.cardReducer?.selectedAccount?.selectedAccount,
  );
  const handleTextSelection = () => {
    if (data?.isSelfSelection) {
      return {
        title: 'Chosen by Customer',
        description: `Please visit the selected outlet for item selection before ${
          data?.orderActionDate
        } .`,
      };
    }
    return {
      title: 'Chosen by Staff',
      description: 'Staff assistance provided on choosing your items.',
    };
  };

  return (
    <View>
      <GlobalText style={[styles.orderText, styles.ph16]}>
        Order Details
      </GlobalText>
      <View style={styles.ph14}>
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
      {data?.deliveryAddress ? (
        <View style={[{paddingHorizontal: 14}, styles.mt8]}>
          <View style={styles.card}>
            <View style={[styles.row, styles.mt12]}>
              <GlobalText style={[styles.boldFont, styles.deliveryText]}>
                Delivery
              </GlobalText>
            </View>
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
                style={[
                  styles.smallFont,
                  styles.mediumFont,
                  styles.mediumSize,
                ]}>
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
          </View>
        </View>
      ) : null}
      <GlobalText style={[styles.orderText, styles.ph16, styles.mt36]}>
        Payment Details
      </GlobalText>
      <View style={styles.ph14}>
        <TouchableOpacity onPress={openPoint} style={[styles.card]}>
          <View style={styles.row}>
            <View style={styles.mr10}>
              <PointSvg />
            </View>
            <GlobalText>Use Point</GlobalText>
            <View style={styles.mlAuto}>
              <ArrowRight />
            </View>
          </View>
          {myPoint ? (
            <View>
              <GlobalText
                style={[styles.brandColor, styles.mediumFont, styles.mt12]}>
                {myPoint} points used (worth {CurrencyFormatter(myMoneyPoint)})
              </GlobalText>
            </View>
          ) : null}
        </TouchableOpacity>
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
          <View style={styles.mt12}>
            {vouchers?.length > 0 &&
              vouchers.map(voucher => (
                <View>
                  <GlobalText style={[styles.brandColor, styles.mediumFont]}>
                    {voucher?.name}
                  </GlobalText>
                </View>
              ))}
          </View>
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
          <View>
            <GlobalText
              style={[styles.brandColor, styles.mediumFont, styles.mt12]}>
              {selectedAccount?.details?.cardIssuer}{' '}
              {selectedPaymentMethod(selectedAccount)}
            </GlobalText>
          </View>
        </TouchableOpacity>
        <View style={[styles.p12, styles.bgGrey, styles.mt8]}>
          <GlobalText>Amount paid by points/vouchers</GlobalText>
          <GlobalText>Subtotal</GlobalText>
        </View>
        <View style={[styles.row, styles.mt8, {alignItems: 'center'}]}>
          <CheckBox
            style={styles.checkBoxStyle}
            lineWidth={1}
            boxType="square"
            onFillColor={colors.primary}
            onTintColor={colors.primary}
            onCheckColor={'white'}
            //   value={props.checkboxValue?.consent}
            //   onValueChange={newValue => onChangeValue('consent', newValue)}
          />
          <GlobalText style={styles.ml8}>
            I agree to the Terms and Conditions.
          </GlobalText>
        </View>
      </View>
    </View>
  );
};

export default React.memo(CartDetail);

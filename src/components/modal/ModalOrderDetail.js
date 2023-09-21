import React from 'react';
import GlobalModal from './GlobalModal';
import {View, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import Theme from '../../theme/Theme';
import {useSelector} from 'react-redux';
import useCalculation from '../../hooks/calculation/useCalculation';
import {isEmptyArray} from '../../helper/CheckEmpty';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    modalItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      alignItems: 'center',
    },
    modalItemPrice: {
      fontFamily: theme.fontFamily.poppinsSemiBold,
      color: 'black',
    },
    negativeColor: {
      color: theme.colors.semanticError,
    },
    modalChildren: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale4,
    },
    threedotContainer: {
      marginLeft: 'auto',
    },
    detailDotContainer: {
      marginLeft: 8,
    },
    minusText: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    noMargin: {
      marginHorizontal: 0,
      marginTop: 0,
    },
    divider: {
      height: 1,
      flex: 1,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.border,
    },
    grandTotalText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    priceText: {
      fontSize: 24,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      color: theme.colors.primary,
    },
    p12: {
      padding: 12,
    },
    mt16: {
      marginTop: 16,
    },
    bgGrey: {
      backgroundColor: '#F9F9F9',
      borderRadius: 8,
    },
    mediumFont: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    taxPriceText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.greyScale5,
    },
    semiBold: {
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return styles;
};

const ModalOrderDetail = ({
  open,
  closeModal,
  vouchers,
  pointDisc,
  hideAmountPaid,
  totalPointToPay,
}) => {
  const styles = useStyles();
  const {
    calculationAmountPaidByVisa,
    calculatePoint,
    calculateVoucherPoint,
    calculateVoucher,
  } = useCalculation();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const delivery_mode = 'DELIVERY';
  const handleCloseDetail = () => {
    if (closeModal && typeof closeModal === 'function') {
      closeModal();
    }
  };
  const selectedAccount = useSelector(
    state => state.cardReducer?.selectedAccount?.selectedAccount,
  );

  const voucherOnly = () => {
    if (!isEmptyArray(vouchers)) {
      const filterVoucher = vouchers.filter(
        voucher => voucher?.paymentType !== 'point',
      );
      return filterVoucher;
    }
    return [];
  };

  const checkTax = () => {
    if (basket?.inclusiveTax > 0 && basket?.exclusiveTax > 0) {
      return (
        <>
          <View style={[styles.divider, styles.noMargin]} />

          <View style={styles.modalItem}>
            <GlobalText style={styles.modalItemPrice}>Tax</GlobalText>
            <GlobalText style={[styles.modalItemPrice, styles.semiBold]}>
              {CurrencyFormatter(basket?.totalTaxAmount)}{' '}
            </GlobalText>
          </View>
        </>
      );
    }
    if (basket?.inclusiveTax > 0) {
      return (
        <>
          <View style={[styles.divider, styles.noMargin]} />

          <View style={styles.modalItem}>
            <GlobalText style={styles.taxPriceText}>Incl. Tax</GlobalText>
            <GlobalText style={[styles.taxPriceText, styles.semiBold]}>
              {CurrencyFormatter(basket?.inclusiveTax)}{' '}
            </GlobalText>
          </View>
        </>
      );
    }

    if (basket?.exclusiveTax > 0) {
      return (
        <>
          <View style={[styles.divider, styles.noMargin]} />

          <View style={styles.modalItem}>
            <GlobalText style={styles.modalItemPrice}>Excl. Tax</GlobalText>
            <GlobalText style={[styles.modalItemPrice, styles.semiBold]}>
              {CurrencyFormatter(basket?.exclusiveTax)}{' '}
            </GlobalText>
          </View>
        </>
      );
    }
    return null;
  };
  const itemDiscount =
    basket?.totalDiscountAmount - (basket.totalMembershipDiscountAmount || 0);
  return (
    <GlobalModal
      title="Details"
      isBottomModal
      closeModal={handleCloseDetail}
      modalContainerStyle={{padding: 0}}
      closeContainerStyle={{marginRight: 16}}
      isVisible={open}>
      <View style={styles.modalChildren}>
        <View style={styles.modalItem}>
          <GlobalText>Subtotal</GlobalText>
          <GlobalText style={styles.modalItemPrice}>
            {CurrencyFormatter(basket?.totalGrossAmount)}{' '}
          </GlobalText>
        </View>
        {itemDiscount > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={[styles.minusText, styles.mediumFont]}>
              Item Discount
            </GlobalText>
            <GlobalText style={styles.minusText}>
              ({CurrencyFormatter(itemDiscount)} )
            </GlobalText>
          </View>
        ) : null}
        {basket?.totalMembershipDiscountAmount > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={[styles.minusText, styles.mediumFont]}>
              Membership Discount
            </GlobalText>
            <GlobalText style={styles.minusText}>
              ({CurrencyFormatter(basket.totalMembershipDiscountAmount)} )
            </GlobalText>
          </View>
        ) : null}
        {basket?.orderingMode === delivery_mode && basket?.provider ? (
          <>
            <View style={[styles.divider, styles.noMargin]} />
            <View style={styles.modalItem}>
              <GlobalText>Delivery Fee</GlobalText>
              <GlobalText style={styles.modalItemPrice}>
                {basket?.provider?.deliveryFee > 0
                  ? CurrencyFormatter(basket?.provider?.deliveryFee)
                  : 'FREE'}
              </GlobalText>
            </View>
          </>
        ) : null}

        {checkTax()}

        <View style={[styles.divider, styles.noMargin]} />
        <View style={styles.modalItem}>
          <GlobalText style={styles.grandTotalText}>Grand Total</GlobalText>
          <GlobalText style={styles.priceText}>
            {CurrencyFormatter(basket?.totalNettAmount)}{' '}
          </GlobalText>
        </View>
        {totalPointToPay && totalPointToPay > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={styles.minusText}>Paid with point</GlobalText>
            <GlobalText style={[styles.modalItemPrice, styles.minusText]}>
              ({CurrencyFormatter(calculatePoint(vouchers))} )
            </GlobalText>
          </View>
        ) : null}
        {calculateVoucher(voucherOnly()) > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={styles.minusText}>Paid with voucher</GlobalText>
            <GlobalText style={[styles.modalItemPrice, styles.minusText]}>
              ({CurrencyFormatter(calculateVoucher(voucherOnly()))} )
            </GlobalText>
          </View>
        ) : null}
        {!hideAmountPaid ? (
          <View style={[styles.p12, styles.mt16, styles.bgGrey]}>
            <GlobalText>
              Amount paid by points/vouchers{' '}
              {CurrencyFormatter(calculateVoucherPoint(vouchers))}{' '}
            </GlobalText>
            {calculationAmountPaidByVisa(
              basket?.totalNettAmount,
              vouchers,
              calculateVoucherPoint(vouchers),
            ) > 0 ? (
              <GlobalText>
                Amount paid{' '}
                {selectedAccount ? `by ` : 'by selected payment method'}
                {''}
                {selectedAccount?.details?.cardIssuer}{' '}
                {CurrencyFormatter(
                  Number(
                    calculationAmountPaidByVisa(
                      basket?.totalNettAmount,
                      vouchers,
                      calculateVoucherPoint(vouchers),
                    ),
                  ),
                )}
              </GlobalText>
            ) : null}
          </View>
        ) : null}
      </View>
    </GlobalModal>
  );
};

export default React.memo(ModalOrderDetail);

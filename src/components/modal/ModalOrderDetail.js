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
  const {calculationAmountPaidByVisa} = useCalculation();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const {calculateVoucherPoint} = useCalculation();
  const {calculateVoucher} = useCalculation();
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
            <GlobalText>Tax</GlobalText>
            <GlobalText style={styles.modalItemPrice}>
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
            <GlobalText>Incl. Tax</GlobalText>
            <GlobalText style={styles.modalItemPrice}>
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
            <GlobalText>Excl. Tax</GlobalText>
            <GlobalText style={styles.modalItemPrice}>
              {CurrencyFormatter(basket?.exclusiveTax)}{' '}
            </GlobalText>
          </View>
        </>
      );
    }
    return null;
  };
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
        {basket?.totalDiscountAmount > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={[styles.minusText, styles.mediumFont]}>
              Item Discount
            </GlobalText>
            <GlobalText style={styles.minusText}>
              ({CurrencyFormatter(basket?.totalDiscountAmount)} )
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
              ({CurrencyFormatter(totalPointToPay)} )
            </GlobalText>
          </View>
        ) : null}
        {voucherOnly()?.length > 0 ? (
          <View style={styles.modalItem}>
            <GlobalText style={styles.minusText}>Paid voucher</GlobalText>
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
            <GlobalText>
              Amount paid by {selectedAccount?.details?.cardIssuer}{' '}
              {calculationAmountPaidByVisa(
                basket?.totalNettAmount,
                vouchers,
                calculateVoucherPoint(vouchers),
              )}
            </GlobalText>
          </View>
        ) : null}
      </View>
    </GlobalModal>
  );
};

export default React.memo(ModalOrderDetail);

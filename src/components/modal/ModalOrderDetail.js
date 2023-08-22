import React from 'react';
import GlobalModal from './GlobalModal';
import {View, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import Theme from '../../theme/Theme';
import {useSelector} from 'react-redux';

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
      color: theme.colors.errorColor,
      fontFamily: theme.fontFamily.poppinsMedium,
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
      color: theme.colors.errorColor,
    },
  });
  return styles;
};

const ModalOrderDetail = ({open, closeModal}) => {
  const styles = useStyles();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  const handleCloseDetail = () => {
    if (closeModal && typeof closeModal === 'function') {
      closeModal();
    }
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
            <GlobalText style={styles.minusText}>Item Discount</GlobalText>
            <GlobalText style={styles.modalItemPrice}>
              ({CurrencyFormatter(basket?.totalDiscountAmount)} )
            </GlobalText>
          </View>
        ) : null}
        <View style={[styles.divider, styles.noMargin]} />
        <View style={styles.modalItem}>
          <GlobalText>Delivery Fee</GlobalText>
          <GlobalText style={styles.modalItemPrice}>
            {CurrencyFormatter(basket?.provider?.deliveryFee)}{' '}
          </GlobalText>
        </View>
        <View style={[styles.divider, styles.noMargin]} />

        <View style={styles.modalItem}>
          <GlobalText>Incl. Tax</GlobalText>
          <GlobalText style={styles.modalItemPrice}>
            {CurrencyFormatter(basket?.provider?.totalTaxAmount)}{' '}
          </GlobalText>
        </View>
        <View style={[styles.divider, styles.noMargin]} />
        <View style={styles.modalItem}>
          <GlobalText style={styles.grandTotalText}>Grand Total</GlobalText>
          <GlobalText style={styles.priceText}>
            {CurrencyFormatter(basket?.totalNettAmount)}{' '}
          </GlobalText>
        </View>
      </View>
    </GlobalModal>
  );
};

export default React.memo(ModalOrderDetail);

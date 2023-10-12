import React from 'react';
import GlobalModal from './GlobalModal';
import {ScrollView, View, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../globalText';
import {useSelector} from 'react-redux';
import CurrencyFormatter from '../../helper/CurrencyFormatter';

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
    grandTotalText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    priceText: {
      fontSize: 24,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      color: theme.colors.errorColor,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.greyScale3,
      width: '100%',
    },
    itemDelivery: {
      flexDirection: 'row',
      marginTop: 16,
      justifyContent: 'space-between',
    },
    ph16: {
      paddingHorizontal: 16,
    },
    feeText: {
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    mt16: {
      marginTop: 16,
    },
    totalText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    priceTotal: {
      color: theme.colors.errorColor,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return {styles};
};

const ModalDeliveryDetail = ({
  isVisible,
  closeModal,
  feeBreakDown,
  providerData,
}) => {
  const {styles} = useStyles();
  const provider = useSelector(
    state => state.orderReducer?.dataBasket?.product?.provider,
  );
  console.log({provider}, 'lilin');

  const renderBreakDown = (fee, index) => (
    <View style={styles.itemDelivery} key={index}>
      <GlobalText>{fee.text}</GlobalText>
      <GlobalText style={styles.feeText}>
        {CurrencyFormatter(fee.fee)}
      </GlobalText>
    </View>
  );
  const renderComponentBreakdown = () => {
    if (feeBreakDown) {
      return (
        <>
          {feeBreakDown?.map((fee, index) => (
            <>{renderBreakDown(fee, index)}</>
          ))}
        </>
      );
    }
    return (
      <>
        {provider?.feeBreakDown?.map((fee, index) => (
          <>{renderBreakDown(fee, index)}</>
        ))}
      </>
    );
  };
  console.log(provider, 'lika');
  return (
    <GlobalModal
      title="Delivery Fee Details"
      isBottomModal
      closeModal={closeModal}
      isVisible={isVisible}
      modalContainerStyle={{padding: 0}}
      closeContainerStyle={{marginRight: 16}}>
      <ScrollView>
        <View style={styles.divider} />
        <View style={styles.ph16}>
          {renderComponentBreakdown()}
          <View style={[styles.divider, styles.mt16]} />
          <View style={styles.itemDelivery}>
            <View>
              <GlobalText style={styles.totalText}>
                Total Delivery Fee
              </GlobalText>
            </View>
            <View>
              <GlobalText style={[styles.totalText, styles.priceTotal]}>
                {provider
                  ? CurrencyFormatter(provider?.deliveryFee)
                  : CurrencyFormatter(providerData?.deliveryFee)}
              </GlobalText>
            </View>
          </View>
        </View>
      </ScrollView>
    </GlobalModal>
  );
};

export default ModalDeliveryDetail;

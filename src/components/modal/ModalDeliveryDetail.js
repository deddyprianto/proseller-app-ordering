import React from 'react';
import GlobalModal from './GlobalModal';
import {ScrollView, View, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../globalText';

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
  return {styles};
};

const ModalDeliveryDetail = ({isVisible, closeModal}) => {
  const {styles} = useStyles();
  return (
    <GlobalModal
      title="Details"
      isBottomModal
      closeModal={closeModal}
      modalContainerStyle={{padding: 0}}
      closeContainerStyle={{marginRight: 16}}>
      <ScrollView>
        <View style={styles.modalItem}>
          <GlobalText>Subtotal</GlobalText>
          <GlobalText style={styles.modalItemPrice}>
            {/* {CurrencyFormatter(basket?.totalGrossAmount)}{' '} */}
          </GlobalText>
        </View>
      </ScrollView>
    </GlobalModal>
  );
};

export default ModalDeliveryDetail;

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalText from '../globalText';
import GlobalButton from '../button/GlobalButton';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {useSelector} from 'react-redux';
import ThreeDotCircle from '../../assets/svg/ThreeDotCircle';
import Theme from '../../theme/Theme';
import ModalOrderDetail from '../modal/ModalOrderDetail';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale4,
      padding: 16,
    },
    footerChild: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    threedotContainer: {
      marginLeft: 'auto',
    },
    detailDotContainer: {
      marginLeft: 8,
    },
    stepText: {
      color: theme.colors.brandTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    granTotal: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    priceAll: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      color: theme.colors.primary,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return {styles};
};

const GrandTotalFloating = ({
  onPressBtn,
  btnText,
  vouchers,
  pointDisc,
  disabledBtn,
  hideAmountPaid,
}) => {
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const [seeDetail, setSeeDetail] = React.useState(false);
  const {styles} = useStyles();
  const handleOpenDetail = () => {
    setSeeDetail(true);
  };

  const handleCloseDetail = () => {
    setSeeDetail(false);
  };

  return (
    <>
      <View style={styles.footer}>
        <View style={styles.footerChild}>
          <GlobalText style={styles.granTotal}>Grand Total</GlobalText>
          <View style={styles.priceContainer}>
            <GlobalText style={styles.priceAll}>
              {CurrencyFormatter(basket?.totalNettAmount)}
            </GlobalText>
            <TouchableOpacity
              onPress={handleOpenDetail}
              style={styles.threedotContainer}>
              <View style={styles.detailDotContainer}>
                <ThreeDotCircle />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <GlobalButton
            disabled={disabledBtn}
            onPress={onPressBtn}
            title={btnText}
          />
        </View>
      </View>
      <ModalOrderDetail
        vouchers={vouchers}
        open={seeDetail}
        closeModal={handleCloseDetail}
        pointDisc={pointDisc}
        hideAmountPaid={hideAmountPaid}
      />
    </>
  );
};

export default GrandTotalFloating;

import React from 'react';
import {StyleSheet} from 'react-native';
import InformationMessage from './InformationMessage';
import GlobalText from '../globalText';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import Theme from '../../theme/Theme';
import {useSelector} from 'react-redux';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    textVoucher: isRedeemable => ({
      color: isRedeemable ? 'black' : theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
    }),
    mh16: {
      marginHorizontal: 16,
    },
    mb8: {
      marginBottom: 8,
    },
    boldFont: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsBold,
    },
  });
  return {
    styles,
  };
};

const InformationRedeem = () => {
  const {styles} = useStyles();
  const basket = useSelector(state => state?.orderReducer?.dataBasket?.product);

  const isRedeemable = basket?.totalRedeemableAmount > 0;

  return (
    <InformationMessage>
      {!isRedeemable ? (
        <GlobalText>
          None of the grand total is eligible for redemption with points or a
          voucher.
        </GlobalText>
      ) : (
        <GlobalText>
          <GlobalText style={styles.boldFont}>
            {CurrencyFormatter(basket?.totalRedeemableAmount)}
          </GlobalText>{' '}
          of the grand total can be redeemed with points or a voucher.
        </GlobalText>
      )}
    </InformationMessage>
  );
};

export default InformationRedeem;

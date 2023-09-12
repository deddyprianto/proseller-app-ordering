import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import GlobalText from '../globalText';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';
import Theme from '../../theme/Theme';
import {useSelector} from 'react-redux';
import CurrencyFormatter from '../../helper/CurrencyFormatter';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    imageContainer: type => ({
      width: normalizeLayoutSizeWidth(396),
      height: normalizeLayoutSizeWidth(92),
      justifyContent: 'center',
      paddingHorizontal: 22,
      borderWidth: type === 'used' ? 1 : 0,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      backgroundColor: 'white',
    }),
    voucherContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '100%',
    },
    voucherRoundLeft: type => ({
      position: 'absolute',
      top: '40%',
      width: 20,
      height: 20,
      borderRightWidth: 2,
      backgroundColor: 'white',
      borderRightColor:
        type === 'used' ? theme.colors.primary : theme.colors.greyScale4,
      borderRadius: 10,
      left: -13,
      zIndex: 100,
    }),
    voucherRoundRight: type => ({
      position: 'absolute',
      top: '40%',
      width: 20,
      height: 20,
      borderLeftWidth: 2,
      borderLeftColor:
        type === 'used' ? theme.colors.primary : theme.colors.greyScale4,

      backgroundColor: 'white',
      borderRadius: 10,
      right: -13,
      zIndex: 100,
    }),
    voucherName: {
      justifyContent: 'center',
    },
    nameWidth: type => ({
      width: type !== 'unavailable' ? '65%' : '100%',
    }),
    actionWidth: {
      width: '34.5%',
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    leftDivider: {
      width: '0.5%',
      height: '100%',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderStyle: 'dotted',
      borderRadius: 1,
    },
    buttonAction: type => ({
      backgroundColor: type === 'used' ? 'white' : theme.colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    }),
    buttonText: type => ({
      fontFamily: theme.fontFamily.poppinsMedium,
      color: type === 'used' ? theme.colors.primary : 'white',
    }),
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
      marginHorizontal: 16,
      borderRadius: 8,
    },
    descFont: () => ({
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.greyScale5,
    }),
    nameFont: type => ({
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsBold,
      color: type === 'unavailable' ? theme.colors.greyScale5 : 'black',
    }),
  });
  return {styles};
};

const VoucherListCheckout = ({onPress, item, type}) => {
  const {styles} = useStyles();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const handleText = () => {
    if (type === 'used') {
      return 'Use Later';
    }
    return 'Use Now';
  };
  const handleDescription = () => {
    if (item?.minPurchaseAmount <= basket?.totalNettAmount) {
      return ' No minimal order';
    } else {
      const calculateDifference =
        item?.minPurchaseAmount - basket?.totalNettAmount;
      return ` Add ${CurrencyFormatter(
        calculateDifference,
      )} more to your order to enjoy this voucher`;
    }
  };

  return (
    <View style={[styles.shadowProp, {marginTop: 16}]}>
      <View style={[styles.imageContainer(type)]}>
        <View style={styles.voucherRoundLeft(type)} />
        <View style={styles.voucherRoundRight(type)} />
        <View style={{width: '100%', height: '100%'}}>
          <View style={styles.voucherContainer}>
            <View style={[styles.voucherName, styles.nameWidth(type)]}>
              <GlobalText style={styles.nameFont(type)}>
                {item?.name}{' '}
              </GlobalText>
              <GlobalText style={styles.descFont(type)} numberOfLines={2}>
                {'\u2022'} {handleDescription()}
              </GlobalText>
            </View>

            {type !== 'unavailable' ? (
              <>
                <View style={styles.leftDivider} />
                <View style={[styles.voucherName, styles.actionWidth]}>
                  <TouchableOpacity
                    style={[styles.mlAuto, styles.buttonAction(type)]}
                    onPress={onPress}>
                    <GlobalText style={styles.buttonText(type)}>
                      {handleText()}
                    </GlobalText>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default VoucherListCheckout;

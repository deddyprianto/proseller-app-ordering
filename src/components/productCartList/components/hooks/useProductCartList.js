import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {isEmptyArray} from '../../../../helper/CheckEmpty';
import Theme from '../../../../theme/Theme';
import CurrencyFormatter from '../../../../helper/CurrencyFormatter';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    textModifier: {
      // flex: 1,
    },
    textModifierItemQty: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemQtyUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemName: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPrice: {
      color: 'black',
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    viewProductModifierItem: {
      width: '70%',
      flexDirection: 'row',
    },
    viewBullet: {
      height: 6,
      width: 6,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginRight: 5,
      backgroundColor: theme.colors.border,
    },
    textAddOn: {
      marginVertical: 4,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
      marginTop: 8,
      paddingHorizontal: 12,
    },
    // batas

    textProductHeaderQty: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderName: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderNameUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },

    textPriceSmall: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsBold,
    },

    textPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewProductHeader: {
      //   flexDirection: 'row',
      marginBottom: 4,
    },
    viewProductHeaderQty: {
      paddingVertical: 3,
      paddingHorizontal: 4.5,
      borderRadius: 5,
      backgroundColor: theme.colors.textQuaternary,
    },
    viewProductHeaderQtyUnavailable: {
      paddingVertical: 3,
      paddingHorizontal: 4.5,
      borderRadius: 5,
      backgroundColor: theme.colors.textTertiary,
    },

    viewTotalPrice: {
      flexDirection: 'row',
    },

    textNormalPrice: {
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      fontSize: 12,
      marginRight: 4,
      textDecorationLine: 'line-through',
    },
    textDiscountPrice: {
      color: theme.colors.textError,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      fontSize: 12,
      marginRight: 4,
    },
    boxQty: {
      marginRight: 8,
      width: 30,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWidth: {
      width: '100%',
    },
    mediumFont: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    rightPrice: {
      width: '30%',
      alignItems: 'flex-end',
    },
    leftDesc: {
      flexDirection: 'row',
      width: '100%',
      flex: 1,
    },
    discountText: {
      textDecorationLine: 'line-through',
      color: theme.colors.greyScale5,
    },
    afterDiscountText: {
      color: theme.colors.semanticColorError,
    },
    ml4: {
      marginLeft: 4,
    },
  });
  return styles;
};

const useProductCartList = ({isProductUnavailable}) => {
  const styles = useStyles();
  const renderProductModifierItem = ({
    qty,
    name,
    price,
    styleItem,
    textPriceContainer,
    textPrice,
  }) => {
    const styleTextQty = isProductUnavailable
      ? styles.textModifierItemQtyUnavailable
      : styles.textModifierItemQty;

    const styleTextPrice = isProductUnavailable
      ? styles.textModifierItemPriceUnavailable
      : styles.textModifierItemPrice;

    return (
      <View style={styles.leftDesc}>
        <View style={[styles.viewProductModifierItem, styleItem]}>
          <View style={styles.viewBullet} />

          <Text style={[styles.textModifier]}>
            <Text style={styleTextQty}>{qty}x </Text>
            <Text style={styles.textModifierItemName}> {name} </Text>
          </Text>
        </View>
        <View style={[styles.rightPrice, textPriceContainer]}>
          <Text style={[styleTextPrice, textPrice]}>
            {''}+ {CurrencyFormatter(price)}{' '}
          </Text>
        </View>
      </View>
    );
  };

  const renderProductModifier = (
    item,
    styleText,
    styleItem,
    textPriceContainer,
    textPrice,
  ) => {
    if (!isEmptyArray(item.modifiers)) {
      let productModifiers = {};
      const finalGrouping = [];
      item?.modifiers?.forEach(modifier => {
        modifier?.modifier?.details?.forEach(detail => {
          finalGrouping.push({...detail, modifier});
          if (!productModifiers[modifier.modifierID]) {
            const emptyData = [];
            emptyData.push({...detail, modifierID: modifier?.modifierID});
            productModifiers[modifier.modifierID] = emptyData;
          } else {
            productModifiers[modifier.modifierID] = [
              ...productModifiers[modifier.modifierID],
              {...detail, modifierID: modifier?.modifierID},
            ];
          }
        });
      });
      const componentModifier = Object.keys(productModifiers).map(value => {
        const findModifierName = item?.product?.productModifiers?.find(
          modifier => modifier?.modifierID === value,
        );
        return (
          <>
            {findModifierName ? (
              <Text style={[styles.textAddOn, styleText]}>
                {findModifierName?.modifierName}{' '}
              </Text>
            ) : null}
            {productModifiers[value]?.map(detail => {
              return renderProductModifierItem({
                qty: detail?.quantity * item?.quantity,
                name: detail?.name,
                price: detail?.price * item?.quantity,
                modifierId: detail?.modifierID,
                isProductUnavailable,
                styleItem,
                textPriceContainer,
                textPrice,
              });
            })}
          </>
        );
      });

      return <View>{componentModifier}</View>;
    }
  };

  const renderProductHeader = item => {
    const styleTextName = isProductUnavailable
      ? styles.textProductHeaderNameUnavailable
      : styles.textProductHeaderName;

    return (
      <View style={[styles.viewProductHeader]}>
        <View style={styles.fullWidth}>
          <Text style={[styleTextName, styles.fullWidth]} numberOfLines={2}>
            {item?.product?.name}{' '}
          </Text>
          {renderPrice(item)}
        </View>
      </View>
    );
  };

  const renderPrice = item => {
    console.log({item}, 'item produk');
    const styleTextPrice = isProductUnavailable
      ? [styles.textPriceUnavailable]
      : [styles.textPriceSmall];
    if (item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount) {
      return (
        <View style={[styles.viewTotalPrice]}>
          <Text
            style={[
              styles.textPriceSmall,
              styles.mediumFont,
              styles.discountText,
            ]}>
            + {CurrencyFormatter(item?.retailPrice * item?.quantity)}
          </Text>
          <Text
            style={[
              styles.textPriceSmall,
              styles.mediumFont,
              styles.afterDiscountText,
              styles.ml4,
            ]}>
            + {CurrencyFormatter(item?.amountAfterDisc)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styleTextPrice}>
        {CurrencyFormatter(item?.retailPrice * item?.quantity)}
      </Text>
    );
  };

  return {
    renderProductModifier,
    renderProductHeader,
  };
};

export default useProductCartList;

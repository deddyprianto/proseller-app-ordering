import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {isEmptyArray} from '../../../../helper/CheckEmpty';
import Theme from '../../../../theme/Theme';
import CurrencyFormatter from '../../../../helper/CurrencyFormatter';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    textModifier: {
      flex: 1,
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 12,
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
  });
  return styles;
};

const useProductCartList = ({isProductUnavailable}) => {
  const styles = useStyles();
  const renderProductModifierItem = ({qty, name, price}) => {
    const styleTextQty = isProductUnavailable
      ? styles.textModifierItemQtyUnavailable
      : styles.textModifierItemQty;

    const styleTextPrice = isProductUnavailable
      ? styles.textModifierItemPriceUnavailable
      : styles.textModifierItemPrice;

    return (
      <>
        <View style={styles.viewProductModifierItem}>
          <View style={styles.viewBullet} />

          <Text style={styles.textModifier}>
            <Text style={styleTextQty}>{qty}x </Text>
            <Text style={styles.textModifierItemName}> {name} </Text>
          </Text>
          <View>
            <Text style={[styleTextPrice]}> + {CurrencyFormatter(price)} </Text>
          </View>
        </View>
      </>
    );
  };

  const renderProductModifier = item => {
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
              <Text style={styles.textAddOn}>
                {findModifierName?.modifierName}{' '}
              </Text>
            ) : null}
            {productModifiers[value]?.map(detail => {
              return renderProductModifierItem({
                qty: detail?.quantity,
                name: detail?.name,
                price: detail?.price,
                modifierId: detail?.modifierID,
                isProductUnavailable,
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
    const isPromotionApplied =
      item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount;

    return (
      <View style={[styles.viewProductHeader]}>
        <View style={styles.fullWidth}>
          <Text style={[styleTextName, styles.fullWidth]} numberOfLines={2}>
            {item?.product?.name}{' '}
            {isPromotionApplied ? (
              <Text style={[styles.textNormalPrice]}>
                + {CurrencyFormatter(item?.grossAmount)}
              </Text>
            ) : null}
          </Text>
          {renderPrice(item)}
        </View>
      </View>
    );
  };

  const renderPrice = item => {
    const styleTextPrice = isProductUnavailable
      ? [styles.textPriceUnavailable]
      : [styles.textPriceSmall];

    if (item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount) {
      return (
        <View style={[styles.viewTotalPrice]}>
          <Text style={[styles.textDiscountPrice, {width: '100%'}]}>
            + {CurrencyFormatter(item?.amountAfterDisc)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styleTextPrice}>{CurrencyFormatter(item?.grossAmount)}</Text>
    );
  };

  return {
    renderProductModifier,
    renderProductHeader,
  };
};

export default useProductCartList;

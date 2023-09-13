import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Theme from '../../../theme/Theme';
import GlobalText from '../../globalText';
import PreorderLabel from '../../label/Preorder';
import AllowSelfSelectionLabel from '../../label/AllowSelfSelection';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';
import {isEmptyArray} from '../../../helper/CheckEmpty';
import appConfig from '../../../config/appConfig';
import useProductCartList from './hooks/useProductCartList';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      marginHorizontal: 16,
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    amountContainer: {
      minWidth: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
      paddingHorizontal: 8,
    },
    amountText: {
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 12,
    },
    productName: {
      marginLeft: 8,
      width: '55%',
      justifyContent: 'center',
    },
    productText: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    headerContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    totalPrice: {
      flexDirection: 'row',
      marginTop: 4,
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
    textPrice: {
      fontSize: 18,
      fontFamily: theme.fontFamily.poppinsBold,
      color: theme.colors.primary,
    },
    textPriceContainer: {
      marginLeft: 'auto',
    },
    modifierContaine: {
      marginTop: 10,
    },
    viewProductModifierItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    viewBullet: {
      height: 6,
      width: 6,
      borderRadius: 3,
      marginTop: 5,
      marginRight: 5,
      backgroundColor: theme.colors.border,
    },
    textModifier: {
      flex: 1,
    },

    textModifierItemName: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPrice: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemQty: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddOn: {
      marginBottom: 4,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewPromoActive: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      backgroundColor: theme.colors.semanticError,
      marginTop: 10,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    iconPromo: {
      color: theme.colors.textTertiary,
      fontSize: 8,
    },
    imagePromo: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    row: {
      flexDirection: 'row',
    },
    textPromo: {
      fontSize: 12,
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return {styles};
};

const ProductCartItemCart2 = ({item, containerStyle}) => {
  const {styles} = useStyles();
  const {renderProductModifier} = useProductCartList({
    isProductUnavailable: false,
  });
  const renderPreOrder = () => {
    if (item?.isPreOrderItem) {
      return <PreorderLabel containerStyle={styles.preOrderContainer} />;
    }
    return null;
  };

  const renderAllowSelection = () => {
    if (item.product?.allowSelfSelection) {
      return <AllowSelfSelectionLabel />;
    }
    return null;
  };

  const handleMarginBtm = () => {
    if (item.product?.allowSelfSelection || item?.isPreOrderItem) {
      return 12;
    }
    return 0;
  };

  const renderLabel = () => (
    <View style={{flexDirection: 'row', marginBottom: handleMarginBtm()}}>
      {renderAllowSelection()}
      {renderPreOrder()}
    </View>
  );

  const renderPrice = () => {
    if (item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount) {
      return (
        <View style={styles.totalPrice}>
          <GlobalText style={[styles.textNormalPrice]}>
            + {CurrencyFormatter(item?.grossAmount)}
          </GlobalText>
          <GlobalText style={[styles.textDiscountPrice]}>
            + {CurrencyFormatter(item?.amountAfterDisc)}
          </GlobalText>
        </View>
      );
    }

    return null;
  };

  const renderPromoIcon = () => {
    if (!isEmptyArray(item.promotions)) {
      return (
        <View style={[styles.viewPromoActive]}>
          <ImageBackground
            source={appConfig.iconPromoStar}
            style={styles.imagePromo}>
            <GlobalText style={[styles.iconPromo]}>%</GlobalText>
          </ImageBackground>
          <GlobalText style={styles.textPromo}>Promo</GlobalText>
        </View>
      );
    }
  };

  return (
    <View style={[styles.cardContainer, containerStyle]}>
      <View>{renderLabel()}</View>
      <View style={styles.headerContainer}>
        <View style={styles.amountContainer}>
          <GlobalText style={styles.amountText}>{item.quantity}x</GlobalText>
        </View>
        <View style={styles.productName}>
          <GlobalText numberOfLines={2} style={styles.productText}>
            {item.product?.name}
          </GlobalText>
        </View>
        <View style={styles.textPriceContainer}>
          <GlobalText style={styles.textPrice}>
            {CurrencyFormatter(item?.grossAmount)}
          </GlobalText>
        </View>
      </View>
      <View style={styles.row}>{renderPromoIcon()}</View>
      {renderPrice()}
      {renderProductModifier(item)}
    </View>
  );
};

export default React.memo(ProductCartItemCart2);

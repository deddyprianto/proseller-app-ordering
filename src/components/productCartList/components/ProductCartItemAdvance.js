/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import DashedLine from 'react-native-dashed-line';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

import appConfig from '../../../config/appConfig';

import CurrencyFormatter from '../../../helper/CurrencyFormatter';
import {isEmptyArray} from '../../../helper/CheckEmpty';

import Theme from '../../../theme';
import {useSelector} from 'react-redux';
import PreorderLabel from '../../label/Preorder';
import AllowSelfSelectionLabel from '../../label/AllowSelfSelection';
import {Actions} from 'react-native-router-flux';
import useProductCartList from './hooks/useProductCartList';
import PencilSvg from '../../../assets/svg/PencilSvg';
import GlobalText from '../../globalText';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    body: {
      marginBottom: 0,
      height: 'auto',
      flexDirection: 'row',
    },
    bodyLeft: {
      flex: 1,
    },
    bodyRight: {
      marginLeft: 'auto',
      flexDirection: 'column',
    },
    footer: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    image: {
      height: 62,
      width: 62,
    },
    imageNotes: {
      marginTop: 5,
      width: 10,
      height: 9,
      marginRight: 4,
      tintColor: theme.colors.textTertiary,
    },
    iconEdit: {
      fontSize: 10,
      marginRight: 2,
      color: theme.colors.buttonActive,
    },
    iconEditUnavailable: {
      fontSize: 10,
      marginRight: 2,
      color: theme.colors.buttonDisabled,
    },
    iconPromo: {
      color: theme.colors.textTertiary,
      fontSize: 8,
    },
    iconPromoActive: {
      fontSize: 8,
      color: theme.colors.semanticError,
    },
    iconInformation: {
      width: 16,
      height: 16,
      marginRight: 4,
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
      tintColor: theme.colors.semanticError,
    },
    iconBullet: {
      fontSize: 6,
      color: theme.colors.border,
    },
    divider: {
      width: '100%',
      height: 0.5,
      marginVertical: 8,
      backgroundColor: theme.colors.primary,
    },
    imagePromo: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    textAddOn: {
      marginVertical: 4,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderQty: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderName: {
      maxWidth: (WIDTH * 5) / 10,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderNameUnavailable: {
      maxWidth: (WIDTH * 5) / 10,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderPrice: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
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
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceFooter: isDiscount => ({
      color: isDiscount ? theme.colors.errorColor : 'black',
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    }),
    textPriceSmall: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceFooterUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceBeforeDiscount: {
      marginRight: 10,
      textDecorationLine: 'line-through',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textEdit: {
      paddingTop: 2,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEditUnavailable: {
      paddingTop: 2,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPromo: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNotes: {
      flex: 1,
      fontStyle: 'italic',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNotDiscountAble: {
      flex: 1,
      color: theme.colors.semanticError,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewLabel: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    viewNotes: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewNonDiscountAble: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 8,
    },
    viewTransparentImage: {
      flex: 1,
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    viewProductHeader: {
      flexDirection: 'row',
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
    viewProductModifierItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
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
    viewEdit: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
    },
    viewEditUnavailable: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonDisabled,
    },
    viewPromo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 50,
      backgroundColor: theme.colors.textTertiary,
      marginTop: 10,
    },
    viewPromoActive: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.semanticError,
      paddingVertical: 2,
      marginTop: 10,
    },
    viewTotalPrice: {
      flexDirection: 'row',
    },
    dividerDashed: {
      color: theme.colors.textQuaternary,
    },
    dividerDashedUnavailable: {
      color: theme.colors.textTertiary,
    },
    preOrderContainer: {
      width: '25%',
    },
    amountSmall: {
      fontSize: 12,
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
    rowContainer: {
      flexDirection: 'row',
    },
    pencilIcon: {
      marginRight: 8,
    },
    textPrice: {
      position: 'absolute',
      right: 0,
      paddingVertical: 4,
      paddingHorizontal: 8,
      top: -20,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: 'white',
      fontSize: 12,
    },
    noPh: {
      paddingHorizontal: 0,
    },
    mediumFont: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceModifier: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    ml8: {
      marginLeft: 8,
    },
    mb16: {
      marginBottom: 16,
    },
  });
  return styles;
};

const ProductCartItemAdvance = ({item, disabled, step}) => {
  const styles = useStyles();
  const orderingMode = useSelector(
    state => state.orderReducer?.dataBasket?.product?.orderingMode,
  );

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );
  const isProductUnavailable =
    item?.orderingStatus !== 'AVAILABLE' && orderingMode !== 'STORECHECKOUT';
  const {renderProductModifier, renderProductHeader} = useProductCartList({
    isProductUnavailable,
  });

  const renderDividerDashed = () => {
    const styleColor = isProductUnavailable
      ? styles.dividerDashedUnavailable.color
      : styles.dividerDashed.color;

    return (
      <DashedLine
        dashLength={10}
        dashThickness={0.5}
        dashGap={5}
        dashColor={styleColor}
      />
    );
  };

  const renderTotalPrice = () => {
    const isDiscountProduct = item.amountAfterDisc < item.grossAmount;

    const styleTextPrice = isProductUnavailable
      ? [styles.textPriceFooterUnavailable]
      : [styles.textPriceFooter(isDiscountProduct)];
    return (
      <View style={styles.viewTotalPrice}>
        {isDiscountProduct ? (
          <GlobalText style={styles.textPriceBeforeDiscount}>
            {CurrencyFormatter(item?.grossAmount)}{' '}
          </GlobalText>
        ) : null}
        <Text style={[styleTextPrice]}>
          {CurrencyFormatter(item?.amountAfterDisc)}
        </Text>
      </View>
    );
  };

  const renderEditIcon = () => {
    if (!disabled) {
      const styleView = isProductUnavailable
        ? styles.viewEditUnavailable
        : styles.viewEdit;
      const styleText = isProductUnavailable
        ? styles.textEditUnavailable
        : styles.textEdit;

      return (
        <View style={styleView}>
          <View style={styles.pencilIcon}>
            <PencilSvg />
          </View>
          <Text style={styleText}>Edit</Text>
        </View>
      );
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderTotalPrice()}
        {renderEditIcon()}
      </View>
    );
  };

  const renderImageAvailable = image => {
    return (
      <ImageBackground
        style={styles.image}
        resizeMode="stretch"
        source={{uri: image}}>
        <GlobalText style={styles.textPrice}>{item?.quantity}x</GlobalText>
      </ImageBackground>
    );
  };

  const renderImageUnavailable = image => {
    return (
      <ImageBackground
        style={styles.image}
        resizeMode="stretch"
        source={{uri: image}}>
        <View style={styles.viewTransparentImage} />
        <GlobalText style={styles.textPrice}>{item?.quantity}x</GlobalText>
      </ImageBackground>
    );
  };

  const renderImage = () => {
    const image = item?.product?.defaultImageURL
      ? item?.product?.defaultImageURL
      : imageSettings?.productPlaceholderImage;

    if (isProductUnavailable) {
      return renderImageUnavailable(image);
    } else {
      return renderImageAvailable(image);
    }
  };

  const renderPromoIcon = () => {
    if (!isEmptyArray(item.promotions)) {
      const active = item?.isPromotionApplied && !isProductUnavailable;
      const styleViewPromo = active ? styles.viewPromoActive : styles.viewPromo;
      const styleIconPromo = active ? styles.iconPromoActive : styles.iconPromo;

      return (
        <View style={[styleViewPromo]}>
          <ImageBackground
            source={appConfig.iconPromoStar}
            style={styles.imagePromo}>
            <Text style={[styleIconPromo, {textAlign: 'center'}]}>%</Text>
          </ImageBackground>
          <Text style={styles.textPromo}>Promo</Text>
        </View>
      );
    }
  };

  const renderBodyRight = () => {
    return <View style={styles.bodyRight}>{renderImage()}</View>;
  };

  const renderDivider = () => {
    if (item.remark && !isEmptyArray(item.modifiers)) {
      return <View style={styles.divider} />;
    }
  };

  const renderNotes = () => {
    if (item.remark) {
      return (
        <View style={styles.viewNotes}>
          <Image source={appConfig.notes} style={styles.imageNotes} />
          <Text style={styles.textNotes}>{item?.remark}</Text>
        </View>
      );
    }
  };

  const renderNonDiscountAbleText = () => {
    if (item.product?.isNotRedeemable) {
      return (
        <View style={styles.viewNonDiscountAble}>
          <Image
            source={appConfig.iconInformation}
            style={styles.iconInformation}
          />
          <Text style={styles.textNotDiscountAble}>
            This product can’t be redeem with point/voucher
          </Text>
        </View>
      );
    }
  };

  const renderBodyLeft = () => {
    return (
      <>
        <View style={[styles.bodyLeft]}>{renderProductHeader(item)}</View>
      </>
    );
  };

  const renderBody = () => {
    return (
      <>
        <View style={styles.body}>
          {renderBodyLeft()}
          {renderBodyRight()}
        </View>
        {renderProductModifier(
          item,
          styles.noPh,
          styles.noPh,
          styles.ml8,
          styles.textPriceModifier,
        )}
        <View style={[styles.rowContainer, styles.mb16]}>
          {renderPromoIcon()}
        </View>
        {renderDivider()}
        {renderNotes()}
        {renderNonDiscountAbleText()}
      </>
    );
  };

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

  const renderLabel = () => (
    <View style={styles.viewLabel}>
      {renderAllowSelection()}
      {renderPreOrder()}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={() => {
        Actions.productDetail({
          productId: item?.product?.id,
          selectedProduct: item,
          prevPage: Actions.currentScene,
        });
      }}
      style={styles.root}>
      {renderLabel()}
      {renderBody()}
      {renderDividerDashed()}
      {renderFooter()}
    </TouchableOpacity>
  );
};

export default React.memo(ProductCartItemAdvance);

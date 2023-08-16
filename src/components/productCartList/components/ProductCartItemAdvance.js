/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';
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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import appConfig from '../../../config/appConfig';

import CurrencyFormatter from '../../../helper/CurrencyFormatter';
import {isEmptyArray} from '../../../helper/CheckEmpty';

import ProductAddModal from '../../productAddModal';

import Theme from '../../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {getProductById} from '../../../actions/product.action';
import PreorderLabel from '../../label/Preorder';
import AllowSelfSelectionLabel from '../../label/AllowSelfSelection';
import AddItemAmount from './AddItemAmount';

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
      marginBottom: 16,
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
      marginBottom: 4,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderQty: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[10],
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
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderPriceUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[10],
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
    textPriceFooter: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
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
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEditUnavailable: {
      paddingTop: 2,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[10],
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
    viewNotes: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewNonDiscountAble: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewTransparentImage: {
      flex: 1,
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    viewProductHeader: {
      flexDirection: 'row',
      alignItems: 'center',
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
      paddingVertical: 2,
      backgroundColor: 'white',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
    },
    viewEditUnavailable: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 2,
      backgroundColor: 'white',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.buttonDisabled,
    },
    viewPromo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 2,
      borderRadius: 50,
      backgroundColor: theme.colors.textTertiary,
    },
    viewPromoActive: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 2,
      borderRadius: 50,
      backgroundColor: theme.colors.semanticError,
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
      marginBottom: 12,
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
  });
  return styles;
};

const ProductCartItemAdvance = ({item, disabled, step}) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [product, setProduct] = useState({});

  const orderingMode = useSelector(
    state => state.orderReducer?.dataBasket?.product?.orderingMode,
  );

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );
  const isProductUnavailable =
    item?.orderingStatus !== 'AVAILABLE' && orderingMode !== 'STORECHECKOUT';

  const handleOpenAddModal = async () => {
    const response = await dispatch(getProductById(item.product.id));
    setProduct(response);
    setIsOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };
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

  const renderProductHeader = () => {
    const styleViewQty = isProductUnavailable
      ? styles.viewProductHeaderQtyUnavailable
      : styles.viewProductHeaderQty;

    const styleTextName = isProductUnavailable
      ? styles.textProductHeaderNameUnavailable
      : styles.textProductHeaderName;

    const styleTextPrice = isProductUnavailable
      ? styles.textProductHeaderPriceUnavailable
      : styles.textProductHeaderPrice;

    return (
      <View style={[styles.viewProductHeader]}>
        <View style={[styleViewQty, {marginRight: 8}]}>
          <Text style={styles.textProductHeaderQty}>{item.quantity}x</Text>
        </View>
        <Text style={styleTextName} numberOfLines={1}>
          {item?.product?.name}
        </Text>
        <Text style={styleTextPrice}>+ {item?.product?.retailPrice}</Text>
      </View>
    );
  };

  const renderProductModifierItem = ({qty, name, price}) => {
    const styleTextQty = isProductUnavailable
      ? styles.textModifierItemQtyUnavailable
      : styles.textModifierItemQty;

    const styleTextPrice = isProductUnavailable
      ? styles.textModifierItemPriceUnavailable
      : styles.textModifierItemPrice;

    return (
      <View style={styles.viewProductModifierItem}>
        <View style={styles.viewBullet} />

        <Text style={styles.textModifier}>
          <Text style={styleTextQty}>{qty}x </Text>
          <Text style={styles.textModifierItemName}>{name}</Text>
          <Text style={styleTextPrice}>+{price} </Text>
        </Text>
      </View>
    );
  };

  const renderProductModifier = () => {
    if (!isEmptyArray(item.modifiers)) {
      const productModifiers = item.modifiers.map(modifier => {
        return modifier?.modifier?.details.map(detail => {
          return renderProductModifierItem({
            qty: detail?.quantity,
            name: detail?.name,
            price: detail?.price,
          });
        });
      });

      return (
        <View>
          <Text style={styles.textAddOn}>Add-On</Text>
          {productModifiers}
        </View>
      );
    }
  };
  const renderTotalPrice = () => {
    const styleTextPrice = isProductUnavailable
      ? [styles.textPriceFooterUnavailable]
      : [styles.textPriceFooter];
    const modifierPrice = calculateModifier();

    if (item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount) {
      return (
        <View style={styles.viewTotalPrice}>
          <Text style={[styleTextPrice]}>
            {CurrencyFormatter(item?.amountAfterDisc + modifierPrice)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styleTextPrice}>
        {CurrencyFormatter(item?.grossAmount + modifierPrice)}
      </Text>
    );
  };
  console.log({item}, 'telek');
  const renderPrice = () => {
    const styleTextPrice = isProductUnavailable
      ? [styles.textPriceUnavailable]
      : [styles.textPriceSmall];

    if (item?.isPromotionApplied && item.amountAfterDisc < item.grossAmount) {
      return (
        <View style={styles.viewTotalPrice}>
          <Text style={[styles.textNormalPrice]}>
            + {CurrencyFormatter(item?.grossAmount)}
          </Text>
          <Text style={[styles.textDiscountPrice]}>
            + {CurrencyFormatter(item?.amountAfterDisc)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styleTextPrice}>{CurrencyFormatter(item?.grossAmount)}</Text>
    );
  };

  const renderEditIcon = () => {
    if (!disabled) {
      const styleView = isProductUnavailable
        ? styles.viewEditUnavailable
        : styles.viewEdit;
      const styleIcon = isProductUnavailable
        ? styles.iconEditUnavailable
        : styles.iconEdit;
      const styleText = isProductUnavailable
        ? styles.textEditUnavailable
        : styles.textEdit;

      return (
        <View style={styleView}>
          <MaterialIcons style={styleIcon} name="edit" />
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
        source={{uri: image}}
      />
    );
  };

  const renderImageUnavailable = image => {
    return (
      <ImageBackground
        style={styles.image}
        resizeMode="stretch"
        source={{uri: image}}>
        <View style={styles.viewTransparentImage} />
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
        <View style={[styleViewPromo, {maxWidth: 100}]}>
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
      <View style={styles.bodyLeft}>
        {renderProductHeader()}
        {renderPrice()}
        {renderPromoIcon()}
        {renderProductModifier()}
        {renderDivider()}
        {renderNotes()}
        {renderNonDiscountAbleText()}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {renderBodyLeft()}
        {renderBodyRight()}
      </View>
    );
  };

  const renderProductAddModal = () => {
    if (isOpenAddModal) {
      return (
        <ProductAddModal
          product={product}
          open={isOpenAddModal}
          handleClose={() => {
            handleCloseAddModal();
          }}
          selectedProduct={item}
        />
      );
    }
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
    <View style={{flexDirection: 'row'}}>
      {renderAllowSelection()}
      {renderPreOrder()}
    </View>
  );

  const calculateModifier = () => {
    if (item.modifiers.length > 0) {
      let amount = [];

      item.modifiers?.forEach((mod, index) => {
        return mod.modifier.details.forEach(mod2 => {
          amount.push(mod2.price * mod2.quantity);
        });
      });
      const sum = amount.reduce((a, b) => a + b);
      return sum;
    }
    return 0;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleOpenAddModal();
      }}
      style={styles.root}>
      {renderLabel()}
      {renderBody()}
      {renderDividerDashed()}
      {renderFooter()}
      {renderProductAddModal()}
    </TouchableOpacity>
  );
};

export default ProductCartItemAdvance;

/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';

import ProductUpdateModal from '../../productUpdateModal';

import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';
import {useSelector} from 'react-redux';
import GlobalText from '../../globalText';
import colorConfig from '../../../config/colorConfig';
import {normalizeLayoutSizeHeight} from '../../../helper/Layout';
import {Actions} from 'react-native-router-flux';
import {navigate} from '../../../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const borderRadiusImage = Platform.OS === 'ios' ? 20 : 30;
  const styles = StyleSheet.create({
    root: {
      marginTop: 20,
      width: '48%',
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      shadowColor: '#00000021',
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.7,
      shadowRadius: 7.49,
      elevation: 12,
      padding: 8,
      borderRadius: 8,
    },
    body: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    bodyLeft: {
      flex: 1,
    },
    bodyRight: {
      marginLeft: 16,
    },
    textQty: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQtyUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNameUnavailable: {
      flex: 1,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      marginTop: normalizeLayoutSizeHeight(8),
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceUnavailable: {
      marginTop: normalizeLayoutSizeHeight(8),
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPromo: {
      lineHeight: 18,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
      flex: 1,
    },
    textNotAvailable: {
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: theme.fontSize[14],
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    textNotAvailableStyle: {
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewQtyAndName: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 5,
      height: normalizeLayoutSizeHeight(42),
    },
    viewIconCart: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.buttonActive,
    },
    viewIconCartUnavailable: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.buttonDisabled,
    },
    viewPromo: {
      flexDirection: 'row',
      borderRadius: 50,
      marginTop: 10,
    },
    promoContainer: {
      elevation: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.semanticError,
      marginTop: 11,
      width: '100%',
    },
    viewImage: {
      width: '100%',
      maxWidth: '100%',
      aspectRatio: 1 / 1,
      borderRadius: 8,
    },
    viewTransparentImage: {
      flex: 1,
      borderRadius: borderRadiusImage,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      borderRadius: 8,
    },
    imagePromo: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    iconPromo: {
      color: theme.colors.semanticError,
      fontSize: 8,
    },
    iconCart: {
      width: 24,
      height: 24,
      tintColor: 'white',
    },
    counterCartProduct: {
      height: 26,
      width: 'auto',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      paddingHorizontal: 4,
      minWidth: 30,
    },
    counterStyle: {
      color: 'white',
    },
    promoContainerNoBg: {
      padding: 4,
      marginTop: 12,
    },
    preOrderLabel: {
      paddingVertical: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.greyScale3,
      position: 'absolute',
      top: 8,
      left: 8,
      paddingHorizontal: 8,
      borderRadius: 4,
      zIndex: 100,
    },
    preOrderText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 12,
    },
  });
  return styles;
};

const Product = ({product, basket}) => {
  const styles = useStyles();
  const [totalQty, setTotalQty] = useState(0);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const {colors, fontFamily} = Theme();
  const isProductAvailable = product?.orderingStatus === 'AVAILABLE';
  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const handleOpenUpdateModal = () => {
    setIsOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const handleProductItemIds = item => {
    let items = [];
    if (item) {
      if (!isEmptyArray(item?.variants || [])) {
        item?.variants.forEach(variant => {
          items.push(variant.id);
        });
      }
      items.push(item?.id);
    }
    return items;
  };

  const handleProductItemsInBasket = ({basketDetails, item}) => {
    const productItemIds = handleProductItemIds(item);
    if (!isEmptyArray(productItemIds)) {
      const result = filter(
        basketDetails,
        basketDetail => indexOf(productItemIds, basketDetail.product.id) !== -1,
      );
      return result;
    }
    return [];
  };

  const handleQuantityProduct = () => {
    let totalQty = 0;

    const productItemInBasket = handleProductItemsInBasket({
      basketDetails: basket?.details,
      item: product,
    });

    productItemInBasket.forEach(item => {
      totalQty = totalQty + item?.quantity;
    });

    return totalQty;
  };

  useEffect(() => {
    const totalQtyProductInBasket = handleQuantityProduct();
    setTotalQty(totalQtyProductInBasket);
  }, [product, basket]);

  const renderImageAvailable = image => {
    return (
      <View>
        {totalQty <= 0 ? null : (
          <View
            style={[
              styles.counterCartProduct,
              {backgroundColor: colors.primary},
            ]}>
            <GlobalText
              style={[
                styles.counterStyle,
                {fontFamily: fontFamily.poppinsMedium},
              ]}>
              {totalQty}x
            </GlobalText>
          </View>
        )}

        <ImageBackground
          style={styles.viewImage}
          imageStyle={styles.image}
          resizeMode="contain"
          source={{uri: image}}
        />
      </View>
    );
  };

  const renderImageUnavailable = image => {
    return (
      <ImageBackground
        style={styles.viewImage}
        imageStyle={styles.image}
        resizeMode="contain"
        source={{uri: image}}>
        <View style={styles.viewTransparentImage}>
          <View style={styles.textNotAvailable}>
            <Text style={styles.textNotAvailableStyle}>Not Available</Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const renderImage = () => {
    const image = product?.defaultImageURL
      ? product?.defaultImageURL
      : imageSettings?.productPlaceholderImage;

    if (isProductAvailable) {
      return renderImageAvailable(image);
    } else {
      return renderImageUnavailable(image);
    }
  };

  const renderName = () => {
    const styleText = isProductAvailable
      ? styles.textName
      : styles.textNameUnavailable;

    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={Number(appConfig.descriptionLineProduct)}
        style={styleText}
        allowFontScaling={false}>
        {product?.name}
      </Text>
    );
  };
  const renderQtyAndName = () => {
    return <View style={styles.viewQtyAndName}>{renderName()}</View>;
  };

  const renderPrice = () => {
    const styleText = isProductAvailable
      ? styles.textPrice
      : styles.textPriceUnavailable;

    return (
      <Text style={styleText}>{CurrencyFormatter(product?.retailPrice)}</Text>
    );
  };

  const handleProductOnClick = () => {
    if (totalQty) {
      handleOpenUpdateModal();
    } else {
      navigate('productDetail', {
        productId: product.id,
        prevPage: Actions.currentScene,
      });
    }
  };

  const renderBodyLeft = () => {
    return (
      <View style={styles.bodyLeft}>
        {renderQtyAndName()}
        {renderPrice()}
      </View>
    );
  };

  const renderBody = () => {
    return <View style={styles.body}>{renderBodyLeft()}</View>;
  };

  const renderProductUpdateModal = () => {
    if (isOpenUpdateModal) {
      return (
        <ProductUpdateModal
          product={product}
          basket={basket}
          open={isOpenUpdateModal}
          handleClose={() => {
            handleCloseUpdateModal();
          }}
        />
      );
    }
  };

  const renderPromoIcon = () => {
    if (!isEmptyArray(product?.promotions) && isProductAvailable) {
      return (
        <View style={styles.viewPromo}>
          <View style={styles.promoContainer}>
            <ImageBackground
              source={appConfig.iconPromoStar}
              style={styles.imagePromo}>
              <Text style={styles.iconPromo}>%</Text>
            </ImageBackground>
            <GlobalText numberOfLines={1} style={styles.textPromo}>
              {product.promotions[0]?.name || null}
            </GlobalText>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.viewPromo}>
        <View style={styles.promoContainerNoBg}>
          <View style={styles.imagePromo} />
        </View>
      </View>
    );
  };

  const renderPreOrderLabel = () => {
    if (product?.isPreOrderItem) {
      return (
        <View style={styles.preOrderLabel}>
          <GlobalText style={styles.preOrderText}>Preorder</GlobalText>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      disabled={!isProductAvailable}
      onPress={() => {
        handleProductOnClick();
      }}
      style={styles.root}>
      {renderPreOrderLabel()}
      {renderImage()}
      {renderPromoIcon()}
      {renderBody()}
      {renderProductUpdateModal()}
    </TouchableOpacity>
  );
};

export default Product;

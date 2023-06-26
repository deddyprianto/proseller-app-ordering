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
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';

import ProductUpdateModal from '../../productUpdateModal';
import ProductAddModal from '../../productAddModal';

import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';
import {useSelector} from 'react-redux';

const useStyles = () => {
  const theme = Theme();
  const borderRadiusImage = Platform.OS === 'ios' ? 20 : 30;
  const styles = StyleSheet.create({
    root: {
      marginTop: 20,
      width: '48%',
      backgroundColor: 'white',
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
      marginTop: 5,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceUnavailable: {
      marginTop: 5,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPromo: {
      lineHeight: 18,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNotAvailable: {
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
      backgroundColor: theme.colors.backgroundTransparent2,
    },
    viewQtyAndName: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 5,
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
      elevation: 1,
      position: 'absolute',
      top: 8,
      left: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.semanticError,
    },
    viewImage: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
      borderRadius: 8,
    },
    viewTransparentImage: {
      flex: 1,
      borderRadius: borderRadiusImage,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundTransparent1,
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
  });
  return styles;
};

const Product = ({product, basket}) => {
  const styles = useStyles();
  const [totalQty, setTotalQty] = useState(0);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const isProductAvailable = product?.orderingStatus === 'AVAILABLE';
  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

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
      <ImageBackground
        style={styles.viewImage}
        imageStyle={styles.image}
        resizeMode="contain"
        source={{uri: image}}
      />
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
          <Text style={styles.textNotAvailable}>Not Available</Text>
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

  const renderQty = () => {
    const styleText = isProductAvailable
      ? styles.textQty
      : styles.textQtyUnavailable;

    if (totalQty) {
      return <Text style={styleText}>{totalQty} x </Text>;
    }
  };

  const renderName = () => {
    const styleText = isProductAvailable
      ? styles.textName
      : styles.textNameUnavailable;

    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={3}
        style={styleText}
        allowFontScaling={false}>
        {product?.name}
      </Text>
    );
  };
  const renderQtyAndName = () => {
    return (
      <View style={styles.viewQtyAndName}>
        {renderQty()}
        {renderName()}
      </View>
    );
  };

  const renderPrice = () => {
    const styleText = isProductAvailable
      ? styles.textPrice
      : styles.textPriceUnavailable;

    return (
      <Text style={styleText}>{CurrencyFormatter(product?.retailPrice)}</Text>
    );
  };

  const cartIcon = () => {
    const styleView = isProductAvailable
      ? styles.viewIconCart
      : styles.viewIconCartUnavailable;

    return (
      <View style={styleView}>
        <Image source={appConfig.iconCart} style={styles.iconCart} />
      </View>
    );
  };

  const handleProductOnClick = () => {
    if (totalQty) {
      handleOpenUpdateModal();
    } else {
      handleOpenAddModal();
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

  const renderBodyRight = () => {
    return <View style={styles.bodyRight}>{cartIcon()}</View>;
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
        />
      );
    }
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
          <ImageBackground
            source={appConfig.iconPromoStar}
            style={styles.imagePromo}>
            <Text style={styles.iconPromo}>%</Text>
          </ImageBackground>
          <Text style={styles.textPromo}>Promo</Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      disabled={!isProductAvailable}
      onPress={() => {
        handleProductOnClick();
      }}
      style={styles.root}>
      {renderPromoIcon()}
      {renderImage()}
      {renderBody()}
      {renderProductAddModal()}
      {renderProductUpdateModal()}
    </TouchableOpacity>
  );
};

export default Product;

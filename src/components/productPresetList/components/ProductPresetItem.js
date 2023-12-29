/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';

import ProductUpdateModal from '../../productUpdateModal';

import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';
import {useSelector} from 'react-redux';
import {navigate} from '../../../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginTop: 20,
      width: '48%',
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
    textName: {
      flex: 1,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      marginTop: 5,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
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
      backgroundColor: theme.colors.primary,
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
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

  const renderImage = () => {
    const image = product?.defaultImageURL
      ? {uri: product?.defaultImageURL}
      : imageSettings?.productPlaceholderImage;

    return <Image style={styles.image} resizeMode="contain" source={image} />;
  };

  const renderQty = () => {
    if (totalQty) {
      return <Text style={styles.textQty}>{totalQty} x </Text>;
    }
  };

  const renderName = () => {
    return (
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.textName}>
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
    return (
      <Text style={styles.textPrice}>
        {CurrencyFormatter(product?.retailPrice)}
      </Text>
    );
  };

  const cartIcon = () => {
    return (
      <View style={styles.viewIconCart}>
        <Image source={appConfig.iconCart} style={styles.iconCart} />
      </View>
    );
  };

  const handleProductOnClick = () => {
    if (totalQty) {
      handleOpenUpdateModal();
    } else {
      navigate('productDetail', {
        productId: product?.id,
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

  return (
    <TouchableOpacity
      onPress={() => {
        handleProductOnClick();
      }}
      style={styles.root}>
      {renderImage()}
      {renderBody()}
      {renderProductUpdateModal()}
    </TouchableOpacity>
  );
};

export default Product;

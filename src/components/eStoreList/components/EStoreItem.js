/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import currencyFormatter from '../../../helper/CurrencyFormatter';
import Theme from '../../../theme';
import ProductAddModal from '../../productAddModal';
import ProductUpdateModal from '../../productUpdateModal';
import appConfig from '../../../config/appConfig';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      padding: 16,
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: theme.colors.secondary,
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    alignFlexEnd: {
      alignItems: 'flex-end',
    },
    image: {
      aspectRatio: 1 / 1,
      height: 'auto',
      width: undefined,
    },
    iconPlus: {
      width: 12,
      height: 12,
      marginRight: 10,
    },
    textPrice: {
      marginBottom: 16,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      flex: 1,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddCart: {
      height: 18,
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewQty: {
      marginRight: 4,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      backgroundColor: theme.colors.primary,
    },
    viewBody: {
      flex: 1,
      marginLeft: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    touchableAddCart: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
  });
  return styles;
};

const EStoreItem = ({item, basket}) => {
  const styles = useStyles();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

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

  const handleProductOnClick = () => {
    const qty = handleQuantityProduct();
    if (qty) {
      handleOpenUpdateModal();
    } else {
      handleOpenAddModal();
    }
  };

  const handleProductItemIds = () => {
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

  const handleProductItemsInBasket = () => {
    const basketDetails = basket?.details;
    const productItemIds = handleProductItemIds();
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
      item,
    });

    productItemInBasket.forEach(product => {
      totalQty = totalQty + product?.quantity;
    });

    return totalQty;
  };

  const renderQty = () => {
    const qty = handleQuantityProduct();
    if (qty) {
      return (
        <View style={styles.viewQty}>
          <Text style={styles.textQty}>{qty}x</Text>
        </View>
      );
    }
  };

  const renderName = () => {
    return (
      <Text style={styles.textName} numberOfLines={1}>
        {item.name}
      </Text>
    );
  };

  const renderQtyAndName = () => {
    return (
      <View style={styles.flexRowCenter}>
        {renderQty()}
        {renderName()}
      </View>
    );
  };

  const renderPrice = () => {
    return (
      <Text style={styles.textPrice}>
        {currencyFormatter(item.retailPrice)}
      </Text>
    );
  };

  const renderAddCartButton = () => {
    return (
      <View style={styles.alignFlexEnd}>
        <TouchableOpacity
          style={styles.touchableAddCart}
          onPress={() => {
            handleProductOnClick();
          }}>
          <Image source={appConfig.iconPlus} style={styles.iconPlus} />
          <Text style={styles.textAddCart}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductAddModal = () => {
    if (isOpenAddModal) {
      return (
        <ProductAddModal
          product={item}
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
          product={item}
          basket={basket}
          open={isOpenUpdateModal}
          handleClose={() => {
            handleCloseUpdateModal();
          }}
        />
      );
    }
  };

  const renderImage = () => {
    const image = item?.defaultImageURL
      ? {uri: item?.defaultImageURL}
      : appConfig.logoMerchant;

    return <Image style={styles.image} resizeMode="center" source={image} />;
  };

  const renderBody = () => {
    return (
      <View style={styles.viewBody}>
        {renderQtyAndName()}
        {renderPrice()}
        {renderAddCartButton()}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderImage()}
      {renderBody()}
      {renderProductUpdateModal()}
      {renderProductAddModal()}
    </View>
  );
};

export default EStoreItem;

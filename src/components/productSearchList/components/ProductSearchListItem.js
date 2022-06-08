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
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import colorConfig from '../../../config/colorConfig';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import {isEmptyArray} from '../../../helper/CheckEmpty';

import ProductUpdateModal from '../../productUpdateModal';
import ProductAddModal from '../../productAddModal';

const styles = StyleSheet.create({
  root: {
    width: '48%',
  },
  textQty: {
    color: colorConfig.primaryColor,
    fontSize: 12,
  },
  textName: {
    fontSize: 12,
    width: '60%',
  },
  textPrice: {
    marginTop: 5,
    fontSize: 12,
  },
  viewQtyAndName: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  image: {
    height: 160,
    width: 175,
    marginTop: 20,
  },
  icon: {
    width: 40,
    height: 25,
    fontSize: 15,
    backgroundColor: colorConfig.primaryColor,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

const ProductSearchListItem = ({product, basket}) => {
  const [totalQty, setTotalQty] = useState(0);
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
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={{uri: product?.defaultImageURL}}
      />
    );
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
    return <Text style={styles.textPrice}>$ {product?.retailPrice}</Text>;
  };

  const cartIcon = () => {
    return <IconAntDesign name="shoppingcart" style={styles.icon} />;
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

  const handleProductOnClick = () => {
    if (totalQty) {
      handleOpenUpdateModal();
    } else {
      handleOpenAddModal();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleProductOnClick();
      }}
      style={styles.root}>
      {renderImage()}
      {renderQtyAndName()}
      {renderPrice()}
      {cartIcon()}
      {renderProductAddModal()}
      {renderProductUpdateModal()}
    </TouchableOpacity>
  );
};

export default ProductSearchListItem;

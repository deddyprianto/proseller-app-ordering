/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from 'react-native';

import ProductAddModal from '../productAddModal';
import {isEmptyArray} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.backgroundTransparent,
    },
    rootBody: {
      padding: 16,
      width: '100%',
      maxHeight: '100%',
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 10,
      backgroundColor: theme.colors.border,
    },
    divider: {
      width: '100%',
      height: 1,
      marginVertical: 16,
      backgroundColor: theme.colors.text2,
    },
    iconNotes: {
      width: 10,
      height: 8,
      marginVertical: 3,
      marginRight: 4,
      tintColor: theme.colors.text2,
    },
    iconClose: {
      width: 14,
      height: 14,
      tintColor: theme.colors.text4,
    },
    iconEdit: {
      width: 8,
      height: 8,
      tintColor: theme.colors.text4,
      marginRight: 4,
    },
    textAddOn: {
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textNotes: {
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemQty: {
      fontStyle: 'italic',
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemName: {
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPrice: {
      fontStyle: 'italic',
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMakeAnother: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textHeader: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEditButton: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewQty: {
      height: 18,
      borderRadius: 5,
      paddingVertical: 1.5,
      paddingHorizontal: 4.5,
      backgroundColor: theme.colors.primary,
    },
    viewQtyAndName: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewPriceAndEditButton: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    viewProductModifierItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewEditButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
    },
    viewNotes: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    touchableMakeAnother: {
      marginTop: 16,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    touchableCloseButton: {
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
    },
  });
  return styles;
};

const ProductUpdateModal = ({open, handleClose, product, basket}) => {
  const styles = useStyles();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [productInBasket, setProductInBasket] = useState([]);
  const [
    selectedProductBasketUpdate,
    setSelectedProductBasketUpdate,
  ] = useState({});

  const handleProductVariantIds = product => {
    let items = [];
    if (product) {
      if (!isEmptyArray(product?.variants || [])) {
        product.variants.forEach(variant => {
          items.push(variant.id);
        });
      }
      items.push(product.id);
    }
    return items;
  };

  const handleProductVariantInBasket = ({basketDetails, product}) => {
    const productItemIds = handleProductVariantIds(product);
    if (!isEmptyArray(productItemIds)) {
      const result = filter(
        basketDetails,
        basketDetail => indexOf(productItemIds, basketDetail.product.id) !== -1,
      );
      return result;
    }
    return [];
  };

  const handleProductVariants = () => {
    const productItemInBasket = handleProductVariantInBasket({
      basketDetails: basket?.details,
      product,
    });
    return productItemInBasket;
  };

  useEffect(() => {
    if (!isEmptyArray(product.variants)) {
      const items = handleProductVariants();
      setProductInBasket(items);
    } else {
      const items = basket?.details?.filter(
        item => item.product.id === product.id,
      );

      setProductInBasket(items);
    }
  }, [basket, product, open]);

  const handleOpenAddModal = value => {
    setIsOpenAddModal(true);
    setSelectedProductBasketUpdate(value);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
    setSelectedProductBasketUpdate({});
  };

  const renderHeaderText = () => {
    return <Text style={styles.textHeader}>This item already in cart</Text>;
  };

  const renderHeaderCloseButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleClose();
        }}
        style={styles.touchableCloseButton}>
        <Image source={appConfig.iconClose} style={styles.iconClose} />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        {renderHeaderText()}
        {renderHeaderCloseButton()}
      </View>
    );
  };

  const renderProductModifierItems = items => {
    const productModifierItems = items.map((item, index) => {
      return (
        <View key={index} style={styles.viewProductModifierItem}>
          <View style={styles.bullet} />
          <View style={{marginRight: 8}} />
          <Text style={styles.textModifierItemQty}>{item.quantity}x</Text>
          <View style={{marginRight: 8}} />
          <Text style={styles.textModifierItemName}>{item.name}</Text>
          <View style={{marginRight: 8}} />
          <Text style={styles.textModifierItemPrice}>+{item.price}</Text>
        </View>
      );
    });

    return productModifierItems;
  };

  const renderProductModifiers = productModifiers => {
    if (!isEmptyArray(productModifiers)) {
      const result = productModifiers.map(productModifier => {
        return renderProductModifierItems(productModifier?.modifier?.details);
      });

      return (
        <View style={{marginTop: 8}}>
          <Text style={styles.textAddOn}>Add-On</Text>
          {result}
        </View>
      );
    }
  };

  const renderProductItemName = name => {
    return <Text style={styles.textName}>{name}</Text>;
  };

  const renderProductItemQty = qty => {
    return (
      <View style={styles.viewQty}>
        <Text style={styles.textQty}>{qty}x</Text>
      </View>
    );
  };

  const renderProductItemQtyAndName = item => {
    return (
      <View style={styles.viewQtyAndName}>
        {renderProductItemQty(item?.quantity)}
        <View style={{marginRight: 8}} />
        {renderProductItemName(item?.product?.name)}
      </View>
    );
  };

  const renderProductItemPrice = price => {
    return <Text style={styles.textPrice}>SGD {price}</Text>;
  };

  const renderProductItemEditButton = () => {
    return (
      <View style={styles.viewEditButton}>
        <Image source={appConfig.iconEdit} style={styles.iconEdit} />
        <Text style={styles.textEditButton}>Edit</Text>
      </View>
    );
  };

  const renderProductItemPriceAndEditButton = item => {
    return (
      <View style={styles.viewPriceAndEditButton}>
        {renderProductItemPrice(item?.grossAmount)}
        {renderProductItemEditButton()}
      </View>
    );
  };

  const renderNotes = item => {
    if (item.remark) {
      return (
        <View style={styles.viewNotes}>
          <Image source={appConfig.iconNotes} style={styles.iconNotes} />
          <Text style={styles.textNotes}>{item?.remark}</Text>
        </View>
      );
    }
  };

  const renderProductItemDivider = index => {
    const lastIndex = productInBasket.length - 1;

    if (lastIndex !== index) {
      return <View style={styles.divider} />;
    }
  };

  const renderProductItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleOpenAddModal(item);
        }}>
        {renderProductItemQtyAndName(item)}
        {renderProductModifiers(item?.modifiers)}
        {renderNotes(item)}
        {renderProductItemPriceAndEditButton(item)}
        {renderProductItemDivider(index)}
      </TouchableOpacity>
    );
  };

  const renderProducts = () => {
    return (
      <FlatList
        data={productInBasket}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => renderProductItem({item, index})}
      />
    );
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleOpenAddModal();
        }}
        style={styles.touchableMakeAnother}>
        <Text style={styles.textMakeAnother}>Make Another</Text>
      </TouchableOpacity>
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
          selectedProduct={selectedProductBasketUpdate}
        />
      );
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Modal animationType="none" transparent={true} visible={open}>
      <View style={styles.root}>
        <View style={styles.rootBody}>
          {renderHeader()}
          {renderProducts()}
          {renderFooter()}
        </View>
      </View>
      {renderProductAddModal()}
    </Modal>
  );
};

export default ProductUpdateModal;

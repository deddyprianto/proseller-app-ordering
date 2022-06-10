/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import {Dialog, Portal, Provider} from 'react-native-paper';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProductAddModal from '../productAddModal';
import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';

const styles = StyleSheet.create({
  root: {
    height: '50%',
  },
  bullet: {
    width: 6,
    height: 6,
    backgroundColor: '#D6D6D6',
    borderRadius: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#B7B7B7',
  },
  iconCloseButton: {
    color: 'white',
    fontSize: 10,
  },
  imageNotes: {
    width: 10,
    height: 9,
    marginRight: 4,
    tintColor: '#B7B7B7',
  },
  textAddOn: {
    color: '#B7B7B7',
    fontStyle: 'italic',
    fontSize: 10,
  },
  textName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textQty: {
    fontSize: 10,
    color: 'white',
  },
  textPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorConfig.primaryColor,
  },
  textNotes: {
    color: '#B7B7B7',
    fontSize: 8,
    fontStyle: 'italic',
  },
  textModifierItemQty: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textModifierItemName: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  textModifierItemPrice: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textMakeAnother: {
    fontSize: 12,
    color: 'white',
  },
  textHeader: {
    fontSize: 12,
  },
  textEditButton: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewQty: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colorConfig.primaryColor,
  },
  viewQtyAndName: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewPriceAndEditButton: {
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
  },
  viewProductModifierItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewEditButton: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 50,
  },
  viewNotes: {
    display: 'flex',
    flexDirection: 'row',
  },
  touchableMakeAnother: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
  },
  touchableCloseButton: {
    width: 12,
    height: 12,
    backgroundColor: colorConfig.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

const ProductUpdateModal = ({open, handleClose, product, basket}) => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [productInBasket, setProductInBasket] = useState([]);
  const [
    selectedProductBasketUpdate,
    setSelectedProductBasketUpdate,
  ] = useState({});

  const handleOpenAddModal = value => {
    setIsOpenAddModal(true);
    setSelectedProductBasketUpdate(value);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
    setSelectedProductBasketUpdate({});
  };

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
    // if (!isEmptyArray(product.variants)) {
    //   const items = handleProductVariants();
    //   setProductInBasket(items);
    // } else {
    const items = basket?.details?.filter(
      item => item.product.id === product.id,
    );

    setProductInBasket(items);
    // }
  }, [basket, product]);

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
      const result = productModifiers.map((productModifier, index) => {
        return renderProductModifierItems(productModifier?.modifier?.details);
      });

      return (
        <View>
          <View style={{marginTop: 8}} />
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
        <IconMaterialIcons name="edit" style={{color: 'white'}} />
        <Text style={styles.textEditButton}>Edit</Text>
      </View>
    );
  };

  const renderProductItemPriceAndEditButton = item => {
    return (
      <View style={styles.viewPriceAndEditButton}>
        {renderProductItemPrice(item?.product?.retailPrice)}
        {renderProductItemEditButton()}
      </View>
    );
  };

  const renderNotes = item => {
    if (item.remark) {
      return (
        <View style={styles.viewNotes}>
          <Image source={appConfig.notes} style={styles.imageNotes} />
          <Text style={styles.textNotes}>{item?.remark}</Text>
        </View>
      );
    }
  };

  const renderProductItem = item => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleOpenAddModal(item);
        }}>
        {renderProductItemQtyAndName(item)}
        {renderProductModifiers(item?.modifiers)}
        <View style={{marginTop: 8}} />
        {renderNotes(item)}
        <View style={{marginTop: 8}} />
        {renderProductItemPriceAndEditButton(item)}
        <View style={{marginTop: 16}} />
        <View style={styles.divider} />
        <View style={{marginTop: 16}} />
      </TouchableOpacity>
    );
  };

  const renderProducts = () => {
    const result = productInBasket?.map((item, index) => {
      return renderProductItem(item);
    });

    return result;
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
        <IconIonicons name="md-close" style={styles.iconCloseButton} />
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
    <Modal animationType="none" transparent={true}>
      <Provider>
        <Portal>
          <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
            <ScrollView style={{paddingHorizontal: 16}}>
              <View style={{marginTop: 16}} />
              {renderHeader()}
              <View style={{marginTop: 16}} />
              {renderProducts()}
              <View style={{marginTop: 16}} />
              {renderFooter()}
              <View style={{marginBottom: 16}} />
            </ScrollView>
          </Dialog>
        </Portal>
      </Provider>
      {renderProductAddModal()}
    </Modal>
  );
};

export default ProductUpdateModal;

/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

import IconIonicons from 'react-native-vector-icons/Ionicons';

import {
  addProductToBasket,
  updateProductBasket,
} from '../../actions/order.action';

import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';
import currencyFormatter from '../../helper/CurrencyFormatter';
import ProductModifiers from './components/ProductModifiers';
import LoadingScreen from '../loadingScreen';
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 2,
    width: '100%',
    backgroundColor: 'white',
  },
  image: {
    height: 300,
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 19,
  },
  textAddToCartButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  textTermsAndConditionsModifier: {
    fontSize: 10,
    color: '#B7B7B7',
  },
  viewAddToCartButton: {
    padding: 16,
    backgroundColor: 'white',
    borderColor: '#D6D6D6',
    borderTopWidth: 1,
  },
  viewProductModifier: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 20,
  },
  viewSelectedProductModifier: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 20,
    backgroundColor: colorConfig.primaryColor,
  },
  viewGroupProductModifier: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  touchableAddToCartButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    paddingVertical: 10,
  },
  touchableAddToCartButtonDisabled: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7B7B7',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#D6D6D6',
  },
});

const ProductAddModal = ({open, handleClose, product, selectedProduct}) => {
  const dispatch = useDispatch();
  const [variantName, setVariantName] = useState('');
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productAdd, setProductAdd] = useState({});
  const [productUpdate, setProductUpdate] = useState({});
  const [selectedVariantOptions, setSelectedVariantOptions] = useState([]);
  const [variantImageURL, setVariantImageURL] = useState('');
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);
  const [notes, setNotes] = useState('');

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const handlePrice = ({qty, totalPrice}) => {
    setTotalPrice(qty * totalPrice);
  };

  const handleProductSelected = () => {
    if (!isEmptyObject(selectedProduct)) {
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
    }
  };

  const handleProductVariantSelected = () => {
    if (
      !isEmptyArray(selectedProduct?.product?.variants) &&
      isEmptyArray(selectedVariantOptions)
    ) {
      let selected = {};

      selectedProduct.product?.variants.forEach(item => {
        if (item.id === selectedProduct.product?.id) {
          selected = item;
        }
      });
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
      setSelectedVariantOptions(selected?.attributes);
    } else if (!isEmptyArray(product?.variants)) {
      const result = isEmptyArray(selectedVariantOptions)
        ? product?.variants[0]?.attributes || []
        : selectedVariantOptions;
      setSelectedVariantOptions(result);
    }
  };

  useEffect(() => {
    handleProductVariantSelected();
    handleProductSelected();
  }, []);

  const handleProductModifierFormatted = items => {
    let totalPrice = 0;
    let productModifiers = [];

    if (!isEmptyArray(items)) {
      items.forEach(item => {
        totalPrice = totalPrice + item.qty * item.price;
        productModifiers.push({
          modifierID: item.modifierId,
          modifier: {
            details: [
              {
                productID: item.modifierProductId,
                quantity: item.qty,
                price: item.price,
                name: item.name,
              },
            ],
          },
        });
      });

      const productModifierMerged = productModifiers.reduce((obj, a) => {
        if (obj[a.modifierID]) {
          obj[a.modifierID].modifier.details.push(...a.modifier.details);
        } else {
          obj[a.modifierID] = {...a};
        }
        return obj;
      }, {});

      const result = Object.values(productModifierMerged);

      totalPrice = totalPrice + product.retailPrice;

      handlePrice({
        qty,
        totalPrice,
      });

      return result;
    }

    totalPrice = totalPrice + product.retailPrice;
    handlePrice({
      qty,
      totalPrice,
    });
    return productModifiers;
  };

  const handleProductVariantFormatted = items => {
    let productVariant = {};
    const productVariantName = items.map(item => {
      return item.value;
    });

    product?.variants?.forEach(variant => {
      if (JSON.stringify(variant.attributes) === JSON.stringify(items)) {
        productVariant = variant;
      }
    });

    setVariantImageURL(productVariant?.defaultImageURL);
    setVariantName(productVariantName.join(' '));

    handlePrice({
      qty,
      totalPrice: productVariant?.retailPrice || 0,
    });

    return productVariant;
  };

  useEffect(() => {
    if (!isEmptyArray(product?.variants)) {
      const productVariantFormatted = handleProductVariantFormatted(
        selectedVariantOptions,
      );

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${productVariantFormatted.id}`,
          retailPrice: productVariantFormatted.retailPrice,
          remark: notes,
          quantity: qty,
          unitPrice: productVariantFormatted.retailPrice,
        });
      }
      return setProductAdd({
        productID: `product::${productVariantFormatted.id}`,
        retailPrice: productVariantFormatted.retailPrice,
        remark: notes,
        quantity: qty,
      });
    }

    if (!isEmptyArray(product?.productModifiers)) {
      const productModifierFormatted = handleProductModifierFormatted(
        selectedProductModifiers,
      );

      const price = totalPrice / qty;

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${product.id}`,
          retailPrice: price,
          remark: notes,
          quantity: qty,
          unitPrice: price,
          modifiers: productModifierFormatted,
        });
      }
      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: price,
        remark: notes,
        quantity: qty,
        modifiers: productModifierFormatted,
      });
    }

    if (product) {
      handlePrice({
        qty,
        totalPrice: product?.retailPrice || 0,
      });
      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${product.id}`,
          retailPrice: product.retailPrice,
          remark: notes,
          quantity: qty,
          unitPrice: product.retailPrice,
        });
      }

      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: product.retailPrice,
        remark: notes,
        quantity: qty,
      });
    }
  }, [
    qty,
    notes,
    product,
    totalPrice,
    selectedProduct,
    selectedVariantOptions,
    selectedProductModifiers,
  ]);

  const renderImage = () => {
    return (
      <View style={{paddingHorizontal: 19}}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: product.defaultImageURL}}
        />
      </View>
    );
  };

  const renderName = () => {
    return (
      <View style={{paddingHorizontal: 16}}>
        <Text style={{fontSize: 14}}>{product.name}</Text>
      </View>
    );
  };

  const renderPrice = () => {
    return (
      <Text style={{fontSize: 14, color: colorConfig.primaryColor}}>
        {currencyFormatter(product.retailPrice)}
      </Text>
    );
  };

  const renderQty = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: colorConfig.primaryColor,
            borderWidth: 1,
          }}
          disabled={qty === 0}
          onPress={() => {
            setQty(qty - 1);
          }}>
          <Text style={{color: colorConfig.primaryColor, fontSize: 16}}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            color: colorConfig.primaryColor,
            marginHorizontal: 15,
          }}>
          {qty}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colorConfig.primaryColor,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setQty(qty + 1);
          }}>
          <Text style={{color: 'white', fontSize: 16}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNameQtyPrice = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        {renderPrice()}
        {renderQty()}
      </View>
    );
  };

  const renderSpecialInstruction = () => {
    return (
      <View>
        <View
          style={{
            backgroundColor: '#F9F9F9',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
          <Text>Special Instruction</Text>
        </View>
        <View style={{padding: 16}}>
          <TextInput
            style={{
              height: 110,
              borderColor: '#D6D6D6',
              padding: 16,
              borderWidth: 1,
              borderRadius: 8,
            }}
            placeholder="Example: please deliver on time"
            multiline={true}
            numberOfLines={3}
            value={notes}
            onChangeText={value => {
              setNotes(value);
            }}
          />
        </View>
      </View>
    );
  };

  const handleAddOrUpdateProduct = async () => {
    setIsLoading(true);
    if (!isEmptyObject(selectedProduct)) {
      await dispatch(updateProductBasket(productUpdate));
    } else {
      await dispatch(
        addProductToBasket({defaultOutlet, selectedProduct: productAdd}),
      );
    }

    setIsLoading(false);
    handleClose();
  };

  const handleDisabledAddToCartButton = () => {
    if (!isEmptyArray(product?.productModifiers) && !isLoading) {
      let qtyModifierSelected = 0;
      const productModifiers = product.productModifiers.map(productModifier => {
        const min = productModifier.modifier?.min || 0;
        selectedProductModifiers.forEach(selectedProductModifier => {
          if (
            productModifier.modifierID === selectedProductModifier.modifierId
          ) {
            qtyModifierSelected =
              qtyModifierSelected + selectedProductModifier.qty;
          }
        });

        const result = qtyModifierSelected >= min;
        qtyModifierSelected = 0;
        return result;
      });

      const productModifierAllTrue = productModifiers.every(v => v === true);
      return !productModifierAllTrue;
    }

    if (!isLoading) {
      return false;
    }

    return true;
  };

  const renderAddToCartButton = () => {
    const disabled = handleDisabledAddToCartButton();
    const styleDisabled = disabled
      ? styles.touchableAddToCartButtonDisabled
      : styles.touchableAddToCartButton;

    const text =
      qty === 0 ? 'Remove' : `Add To Cart - ${currencyFormatter(totalPrice)}`;

    return (
      <View style={styles.viewAddToCartButton}>
        <TouchableOpacity
          style={styleDisabled}
          disabled={disabled}
          onPress={() => {
            handleAddOrUpdateProduct();
          }}>
          <Text style={styles.textAddToCartButton}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const header = () => {
    return (
      <View
        style={{
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <Text>{product?.categoryName}</Text>
        <IconIonicons
          name="md-close"
          style={{fontSize: 30, position: 'absolute', right: 17}}
          onPress={() => {
            handleClose();
          }}
        />
      </View>
    );
  };

  const renderProductModifiers = () => {
    if (!isEmptyArray(product?.productModifiers)) {
      return (
        <ProductModifiers
          productModifiers={product?.productModifiers}
          selectedProductModifiers={selectedProduct?.modifiers}
          isLoading={false}
          onChange={value => {
            setSelectedProductModifiers(value);
          }}
        />
      );
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <LoadingScreen loading={isLoading} />
      <View style={styles.root}>
        {header()}
        <View style={styles.divider} />
        <ScrollView style={styles.container}>
          {renderImage()}
          <View style={{marginTop: 16}} />
          {renderName()}
          {renderNameQtyPrice()}
          <View style={{marginTop: 16}} />
          {renderProductModifiers()}
          {renderSpecialInstruction()}
        </ScrollView>
        {renderAddToCartButton()}
      </View>
    </Modal>
  );
};

export default ProductAddModal;

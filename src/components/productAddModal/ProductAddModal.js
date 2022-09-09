/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

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
import currencyFormatter from '../../helper/CurrencyFormatter';
import LoadingScreen from '../loadingScreen';
import appConfig from '../../config/appConfig';

import Theme from '../../theme';
import ProductVariants from './components/ProductVariants';
import ProductModifiers from './components/ProductModifiers';
import ProductPromotions from './components/ProductPromotions';
import {SafeAreaView} from 'react-navigation';

const useStyles = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 2,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#D6D6D6',
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
    },
    textHeader: {
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textAddToCartButton: {
      fontSize: theme.fontSize[12],
      color: theme.colors.textButtonDisabled,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      fontSize: theme.fontSize[14],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      width: 36,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textSpecialInstruction: {
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsRegular,
    },

    viewNameAndPrice: {
      width: '70%',
    },
    viewNameQtyPrice: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    viewTextAndButtonQty: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewAddToCartButton: {
      padding: 16,
      backgroundColor: 'white',
      borderColor: '#D6D6D6',
      borderTopWidth: 1,
    },

    viewTextSpecialInstruction: {
      backgroundColor: '#F9F9F9',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },

    touchableAddToCartButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
    },

    touchableAddToCartButtonDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.buttonDisabled,
    },
    touchableMinus: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
    touchablePlus: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    textInputSpecialInstruction: {
      height: 110,
      borderColor: '#D6D6D6',
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: 'white',
      textAlignVertical: 'top',
    },
    iconMinus: {
      width: 12,
      height: 12,
      tintColor: theme.colors.primary,
    },
    iconPlus: {
      width: 12,
      height: 12,
      tintColor: theme.colors.background,
    },
    iconClose: {
      fontSize: 30,
      position: 'absolute',
      right: 17,
    },
    padding16: {
      padding: 16,
    },
  });
  return result;
};

const ProductAddModal = ({open, handleClose, product, selectedProduct}) => {
  console.log('GILA', product);
  const styles = useStyles();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [notes, setNotes] = useState('');
  const [variantName, setVariantName] = useState('');
  const [variantImageURL, setVariantImageURL] = useState('');

  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [variantRetailPrice, setVariantRetailPrice] = useState(0);

  const [productAdd, setProductAdd] = useState({});
  const [productUpdate, setProductUpdate] = useState({});

  const [selectedVariantOptions, setSelectedVariantOptions] = useState([]);
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const handlePrice = ({qty, totalPrice}) => {
    setTotalPrice(qty * totalPrice);
  };

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

    product?.variants?.forEach(variant => {
      if (JSON.stringify(variant.attributes) === JSON.stringify(items)) {
        productVariant = variant;
      }
    });

    setVariantImageURL(productVariant?.defaultImageURL);
    setVariantName(productVariant?.name);
    setVariantRetailPrice(productVariant?.retailPrice);

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

  useEffect(() => {
    if (!isEmptyObject(selectedProduct)) {
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
    }
  }, []);

  const renderImage = () => {
    const image =
      variantImageURL || product?.defaultImageURL
        ? variantImageURL || product?.defaultImageURL
        : imageSettings.productPlaceholderImage;
    return (
      <View style={styles.padding16}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: image}}
        />
      </View>
    );
  };

  const renderNameAndPrice = () => {
    const price = variantRetailPrice || product?.retailPrice;
    const name = variantName || product?.name;

    return (
      <View style={styles.viewNameAndPrice}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textPrice}>{currencyFormatter(price)}</Text>
      </View>
    );
  };

  const renderButtonMinus = () => {
    return (
      <TouchableOpacity
        style={styles.touchableMinus}
        disabled={qty === 0}
        onPress={() => {
          setQty(qty - 1);
        }}>
        <Image source={appConfig.iconMinus} style={styles.iconMinus} />
      </TouchableOpacity>
    );
  };

  const renderButtonPlus = () => {
    return (
      <TouchableOpacity
        style={styles.touchablePlus}
        onPress={() => {
          setQty(qty + 1);
        }}>
        <Image source={appConfig.iconPlus} style={styles.iconPlus} />
      </TouchableOpacity>
    );
  };

  const renderTextQty = () => {
    return <Text style={styles.textQty}>{qty}</Text>;
  };

  const renderTextAndButtonQty = () => {
    return (
      <View style={styles.viewTextAndButtonQty}>
        {renderButtonMinus()}
        {renderTextQty()}
        {renderButtonPlus()}
      </View>
    );
  };

  const renderNameQtyPrice = () => {
    return (
      <View style={styles.viewNameQtyPrice}>
        {renderNameAndPrice()}
        {renderTextAndButtonQty()}
      </View>
    );
  };

  const renderTextSpecialInstruction = () => {
    return (
      <View style={styles.viewTextSpecialInstruction}>
        <Text style={styles.textSpecialInstruction}>Special Instruction</Text>
      </View>
    );
  };

  const renderTextInputSpecialInstruction = () => {
    return (
      <View style={styles.padding16}>
        <TextInput
          style={styles.textInputSpecialInstruction}
          placeholder="Example: please deliver on time"
          multiline={true}
          numberOfLines={3}
          value={notes}
          onChangeText={value => {
            setNotes(value);
          }}
        />
      </View>
    );
  };

  const renderSpecialInstruction = () => {
    return (
      <View>
        {renderTextSpecialInstruction()}
        {renderTextInputSpecialInstruction()}
      </View>
    );
  };

  const handleAddOrUpdateProduct = async () => {
    setIsLoading(true);
    const isSpecialBarcode = product?.isSpecialBarcode;

    if (!isEmptyObject(selectedProduct)) {
      const newProductUpdate = isSpecialBarcode
        ? {
            ...productUpdate,
            specialBarcode: product?.specialBarcode,
            retailPrice: product?.retailPrice,
            unitPrice: product?.retailPrice,
          }
        : productUpdate;
      await dispatch(updateProductBasket(newProductUpdate));
    } else {
      const newProductAdd = isSpecialBarcode
        ? {
            ...productAdd,
            specialBarcode: product?.specialBarcode,
            retailPrice: product?.retailPrice,
          }
        : productAdd;

      await dispatch(
        addProductToBasket({defaultOutlet, selectedProduct: newProductAdd}),
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
      <View style={styles.header}>
        <Text style={styles.textHeader}>{product?.categoryName}</Text>
        <IconIonicons
          name="md-close"
          style={styles.iconClose}
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

  const renderProductVariants = () => {
    if (!isEmptyArray(product?.variantOptions)) {
      return (
        <ProductVariants
          productVariants={product?.variants}
          productVariantOptions={product?.variantOptions}
          selectedProduct={selectedProduct?.product}
          isLoading={false}
          onChange={value => {
            setSelectedVariantOptions(value);
          }}
        />
      );
    }
  };

  const renderProductPromotions = () => {
    if (!isEmptyArray(product?.promotions)) {
      return <ProductPromotions productPromotions={product?.promotions} />;
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        handleClose();
      }}>
      <LoadingScreen loading={isLoading} />
      <SafeAreaView forceInset={{bottom: 'never'}} style={styles.root}>
        {header()}
        <View style={styles.divider} />
        <ScrollView style={styles.container}>
          {renderImage()}
          {renderNameQtyPrice()}
          {renderProductPromotions()}
          {renderProductModifiers()}
          {renderProductVariants()}
          {renderSpecialInstruction()}
        </ScrollView>
        {renderAddToCartButton()}
      </SafeAreaView>
    </Modal>
  );
};

export default ProductAddModal;

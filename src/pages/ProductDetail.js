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
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
} from 'react-native';

import RenderHtml from 'react-native-render-html';
import {Actions} from 'react-native-router-flux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import Theme from '../theme/Theme';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import {getProductById} from '../actions/product.action';
import {addProductToBasket, updateProductBasket} from '../actions/order.action';

import appConfig from '../config/appConfig';

import ProductImages from '../components/productAddModal/components/ProductImages';
import ProductModifiers from '../components/productAddModal/components/ProductModifiers';
import ProductVariants from '../components/productAddModal/components/ProductVariants';
import ProductPromotions from '../components/productAddModal/components/ProductPromotions';

import {Header} from '../components/layout';
import PreorderLabel from '../components/label/Preorder';
import AllowSelfSelectionLabel from '../components/label/AllowSelfSelection';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';

const useStyles = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
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
      fontSize: theme.fontSize[16],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCartButton: {
      fontSize: theme.fontSize[12],
      color: theme.colors.textButtonDisabled,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      fontSize: theme.fontSize[14],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsBold,
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
    textDescription: {
      marginBottom: 8,
      fontSize: theme.fontSize[16],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
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
      marginTop: 4,
    },
    viewTextAndButtonQty: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewCartButton: {
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
    viewDescription: {
      padding: 16,
    },
    touchableCartButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
    },

    touchableCartButtonDisabled: {
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
      // height: 110,
      // textAlignVertical: 'top',
      borderColor: '#D6D6D6',
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: 'white',
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
      fontSize: 24,
      position: 'absolute',
      right: 17,
    },
    padding16: {
      padding: 16,
    },
    marginTopIos: {
      marginTop: 25,
    },
    marginTopAndroid: {
      marginTop: 0,
    },
    marginTopIphone14Pro: {
      marginTop: 35,
    },
    preorderStyle: {
      display: 'flex',
      width: '20%',
    },
    containerPreOrder: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
    },
  });
  return result;
};

const webStyles = StyleSheet.create({
  li: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  strong: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  ol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  ul: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  p: {
    fontFamily: 'Poppins-Medium',
  },
});

const ProductDetail = ({productId, selectedProduct, prevPage}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isPromotionDisabled, setIsPromotionDisabled] = useState(false);

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

  const [product, setProduct] = useState({});

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const {width} = useWindowDimensions();

  useEffect(() => {
    if (prevPage === 'promotionDetail' || prevPage === 'cart') {
      setIsPromotionDisabled(true);
    }
  }, [prevPage]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const response = await dispatch(getProductById(productId));
      setProduct(response);
      setIsLoading(false);
    };
    loadData();
  }, [productId]);

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

  const handleTextCartButton = () => {
    if (qty === 0) {
      return 'Remove';
    } else if (!isEmptyObject(selectedProduct)) {
      return `Update - ${CurrencyFormatter(totalPrice)}`;
    } else {
      return `Add to Cart - ${CurrencyFormatter(totalPrice)}`;
    }
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
    Actions.pop();
  };

  const handleDisabledCartButton = () => {
    if (!isEmptyArray(product?.productModifiers) && !isLoading && qty !== 0) {
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

  const renderImage = () => {
    return (
      <View style={styles.padding16}>
        <ProductImages product={product} />
      </View>
    );
  };

  const renderNameAndPrice = () => {
    const price = variantRetailPrice || product?.retailPrice;
    const name = variantName || product?.name;

    return (
      <View style={styles.viewNameAndPrice}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textPrice}>{CurrencyFormatter(price)}</Text>
      </View>
    );
  };

  const renderButtonMinus = () => {
    const isEdit = !isEmptyObject(selectedProduct);
    const isDisabled = isEdit ? qty === 0 : qty === 1;
    return (
      <TouchableOpacity
        style={styles.touchableMinus}
        disabled={isDisabled}
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
          value={notes}
          onChangeText={value => {
            setNotes(value);
          }}
        />
      </View>
    );
  };

  const renderSpecialInstruction = () => {
    if (defaultOutlet?.enableItemSpecialInstructions) {
      return (
        <View>
          {renderTextSpecialInstruction()}
          {renderTextInputSpecialInstruction()}
        </View>
      );
    }
  };

  const renderCartButton = () => {
    const disabled = handleDisabledCartButton();
    const styleDisabled = disabled
      ? styles.touchableCartButtonDisabled
      : styles.touchableCartButton;

    const text = handleTextCartButton();

    return (
      <View style={styles.viewCartButton}>
        <TouchableOpacity
          style={styleDisabled}
          disabled={disabled}
          onPress={() => {
            handleAddOrUpdateProduct();
          }}>
          <Text style={styles.textCartButton}>{text}</Text>
        </TouchableOpacity>
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
      return (
        <ProductPromotions
          productPromotions={product?.promotions}
          disabled={isPromotionDisabled}
        />
      );
    }
  };

  const renderProductDescription = () => {
    if (product?.description) {
      return (
        <View>
          <View style={styles.divider} />
          <View style={styles.viewDescription}>
            <Text style={styles.textDescription}>Description</Text>
            <RenderHtml
              source={{html: `${product.description}`}}
              contentWidth={width}
              tagsStyles={webStyles}
            />
          </View>
        </View>
      );
    }
  };

  const renderProductCustomFieldItem = item => {
    return (
      <View>
        <View style={styles.divider} />
        <View style={styles.viewDescription}>
          <Text style={styles.textDescription}>{item.name}</Text>
          <RenderHtml
            source={{html: `${item.value}`}}
            contentWidth={width}
            tagsStyles={webStyles}
          />
        </View>
      </View>
    );
  };

  const renderProductCustomFields = () => {
    const customFiltered = product?.custom?.filter(
      row => row?.showToCustomer && row?.value,
    );

    if (!isEmptyArray(customFiltered)) {
      const result = customFiltered?.map((row, index) => {
        if (index <= 2) {
          return renderProductCustomFieldItem(row);
        }
      });

      return result;
    }
  };

  const renderPreOrderLabel = () => {
    if (selectedProduct?.isPreOrderItem || product?.isPreOrderItem) {
      return <PreorderLabel />;
    }
    return null;
  };

  const renderLabelAvailSelection = () => {
    if (
      selectedProduct?.product?.allowSelfSelection ||
      product?.allowSelfSelection
    ) {
      return <AllowSelfSelectionLabel />;
    }
    return null;
  };

  const renderLabel = () => (
    <View style={[styles.row, styles.containerPreOrder]}>
      {renderLabelAvailSelection()}
      {renderPreOrderLabel()}
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header title="Product Detail" />
      <KeyboardAwareScrollView style={styles.container}>
        {renderImage()}
        {renderLabel()}
        {renderNameQtyPrice()}
        {renderProductPromotions()}
        {renderProductDescription()}
        {renderProductModifiers()}
        {renderProductVariants()}
        {renderProductCustomFields()}
        {renderSpecialInstruction()}
      </KeyboardAwareScrollView>
      {renderCartButton()}
    </SafeAreaView>
  );
};

export default ProductDetail;

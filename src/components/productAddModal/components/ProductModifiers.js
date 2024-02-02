/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import IconIonicons from 'react-native-vector-icons/Ionicons';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import Theme from '../../../theme';
import appConfig from '../../../config/appConfig';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';
import {useSelector} from 'react-redux';
import additionalSetting from '../../../config/additionalSettings';

const useStyle = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    textName: {
      marginRight: 8,
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOptionName: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOptionNameDisabled: {
      flex: 1,
      fontSize: theme.fontSize[14],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOptionPrice: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textBarcode: {
      width: '100%',
      textAlign: 'left',
      fontSize: theme.fontSize[12],
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
      fontWeight: '400',
      fontStyle: 'italic',
    },
    textTermsAndConditions: {
      fontSize: theme.fontSize[10],
      color: theme.colors.text2,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewNameAndTermsConditions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    viewOptionNamePrice: {
      flex: 1,
    },
    viewOptionName: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewOption: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    viewTextQty: {
      height: 30,
      width: 36,
      borderRadius: 6,
      marginHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.greyScale4,
    },
    viewTextAndButtonQty: {
      marginLeft: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewOptionCheckboxNamePrice: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewProductModifierItem: {
      flex: 1,
    },
    touchableMinus: {
      width: 30,
      height: 30,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.background,
    },
    touchablePlus: {
      width: 30,
      height: 30,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    touchablePlusDisabled: {
      width: 30,
      height: 30,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
    checkbox: {
      width: 24,
      height: 24,
      backgroundColor: 'white',
      borderRadius: 3,
      borderWidth: 2,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.greyScale2,
    },
    checkboxDisabled: {
      width: 24,
      height: 24,
      backgroundColor: 'white',
      borderRadius: 3,
      borderWidth: 2,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.greyScale3,
    },
    checkboxActive: {
      width: 24,
      height: 24,
      borderRadius: 3,
      borderWidth: 2,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonActive,
    },
    iconMinus: {
      width: 20,
      height: 20,
      tintColor: theme.colors.primary,
    },
    iconPlus: {
      width: 20,
      height: 20,
      tintColor: theme.colors.background,
    },
    iconCheck: {
      color: 'white',
      fontSize: 13,
    },
    imageThumbnail: {
      width: 54,
      height: 54,
      marginRight: 8,
    },
    textOutOfStock: {
      fontSize: theme.fontSize[14],
      color: theme.colors.errorColor,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return result;
};

const ProductModifiers = ({
  productModifiers,
  selectedProductModifiers,
  onChange,
}) => {
  const styles = useStyle();
  const [selected, setSelected] = useState([]);

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const handleProductModifiersData = () => {
    let productModifiersFormatted = [];

    productModifiers.forEach(productModifier => {
      if (productModifier.isYesNo) {
        productModifiersFormatted.unshift(productModifier);
      } else {
        productModifiersFormatted.push(productModifier);
      }
    });

    return productModifiersFormatted;
  };

  const handleSelected = () => {
    if (!isEmptyArray(selectedProductModifiers)) {
      let defaultValue = [];
      selectedProductModifiers.forEach(item => {
        item.modifier.details.forEach(detail => {
          defaultValue.push({
            modifierId: item.modifierID,
            modifierProductId: detail.productID,
            name: detail.name,
            price: detail.price,
            qty: detail.quantity,
          });
        });
      });

      setSelected(defaultValue);
    }
  };

  useEffect(() => {
    handleSelected();
  }, []);

  useEffect(() => {
    if (!isEmptyArray(productModifiers)) {
      onChange(selected);
    }
  }, [selected]);

  const handleAddAndReduceQty = ({key, value}) => {
    let productModifiersQtyChanged = [];
    const qty = key === 'add' ? value.qty + 1 : value.qty - 1;

    selected.forEach(selectedProductModifier => {
      if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
        selectedProductModifier.modifierId === value.modifierId &&
        qty !== 0
      ) {
        productModifiersQtyChanged.push({...value, qty});
      } else if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
        selectedProductModifier.modifierId === value.modifierId &&
        qty === 0
      ) {
        productModifiersQtyChanged.push();
      } else {
        productModifiersQtyChanged.push(selectedProductModifier);
      }
    });

    setSelected(productModifiersQtyChanged);
  };

  const handleModifierOptionSelected = ({
    modifierProductId,
    modifierId,
    qty,
    price,
    name,
  }) => {
    const items = selected;

    const modifierProductIdIndex = selected.findIndex(
      x =>
        x.modifierId === modifierId &&
        x.modifierProductId === modifierProductId,
    );

    if (modifierProductIdIndex !== -1) {
      items.splice(modifierProductIdIndex, 1);
      setSelected([...items]);
    } else {
      setSelected([
        ...items,
        {
          modifierId,
          modifierProductId,
          qty,
          price,
          name,
        },
      ]);
    }
  };

  const handleDisabledRemoveButton = ({modifier, min}) => {
    if (min > 0) {
      let qtyTotal = 0;

      const modifierProducts = selected.filter(
        item => item.modifierId === modifier.modifierId,
      );

      modifierProducts.forEach(modifierProduct => {
        qtyTotal = qtyTotal + modifierProduct.qty;
      });

      const isDisabled = qtyTotal <= 0;

      return isDisabled;
    }
  };

  const handleDisabledAddButton = ({modifier, max}) => {
    if (max > 0) {
      let qtyTotal = 0;

      const modifierProducts = selected.filter(
        item => item.modifierId === modifier.modifierId,
      );

      modifierProducts.forEach(modifierProduct => {
        qtyTotal = qtyTotal + modifierProduct.qty;
      });

      const isDisabled = qtyTotal >= max;

      return isDisabled;
    }
  };

  const handleDisabledCheckbox = ({modifierValue, modifier}) => {
    const max = modifier.max;
    let qtyTotal = 0;

    const modifierProducts = selected.filter(
      item => item.modifierId === modifier.id,
    );
    const modifierProductIds = modifierProducts.map(
      item => item.modifierProductId,
    );

    modifierProducts.forEach(modifierProduct => {
      qtyTotal = qtyTotal + modifierProduct.qty;
    });

    const isDisabled =
      qtyTotal >= max &&
      modifierProductIds.indexOf(modifierValue.productID) === -1;

    if (max === 0) {
      return false;
    }

    return isDisabled || modifierValue.orderingStatus === 'UNAVAILABLE';
  };

  const renderButtonPlus = ({selectedProductModifier, max}) => {
    const isDisabled = handleDisabledAddButton({
      modifier: selectedProductModifier,
      max,
    });

    const styleButton = isDisabled
      ? styles.touchablePlusDisabled
      : styles.touchablePlus;

    return (
      <TouchableOpacity
        style={styleButton}
        disabled={isDisabled}
        onPress={() => {
          handleAddAndReduceQty({
            key: 'add',
            value: selectedProductModifier,
          });
        }}>
        <Image source={appConfig.iconPlus} style={styles.iconPlus} />
      </TouchableOpacity>
    );
  };

  const renderButtonMinus = ({selectedProductModifier, min}) => {
    const disabled = handleDisabledRemoveButton({
      modifier: selectedProductModifier,
      min,
    });

    return (
      <TouchableOpacity
        style={styles.touchableMinus}
        disabled={disabled}
        onPress={() => {
          handleAddAndReduceQty({
            key: 'reduce',
            value: selectedProductModifier,
          });
        }}>
        <Image source={appConfig.iconMinus} style={styles.iconMinus} />
      </TouchableOpacity>
    );
  };

  const renderTextQty = qty => {
    return (
      <View style={styles.viewTextQty}>
        <Text style={styles.textQty}>{qty}</Text>
      </View>
    );
  };

  const renderButtonAndTextQty = ({modifierValue, modifier}) => {
    const modifierProductId = modifierValue?.productID;
    const max = modifier?.max;
    const min = modifier?.min;
    const isYesNo = modifier?.isYesNo;
    const modifierId = modifier?.id;

    const selectedProductModifier = selected.find(
      item =>
        item.modifierProductId === modifierProductId &&
        item.modifierId === modifierId,
    );

    const selectedProductModifierQty = selectedProductModifier?.qty || 0;
    const minAndMaxOnlyOne = min === 1 && max === 1;

    if (selectedProductModifierQty > 0 && !isYesNo && !minAndMaxOnlyOne) {
      return (
        <View style={styles.viewTextAndButtonQty}>
          {renderButtonMinus({selectedProductModifier, min})}
          {renderTextQty(selectedProductModifierQty)}
          {renderButtonPlus({selectedProductModifier, max})}
        </View>
      );
    }
  };

  const renderCheckbox = ({modifier, modifierValue}) => {
    const disabled = handleDisabledCheckbox({modifier, modifierValue});

    const active = selected.find(
      value =>
        value.modifierProductId === modifierValue.productID &&
        value.modifierId === modifier.id,
    );
    const style = active
      ? styles.checkboxActive
      : disabled
      ? styles.checkboxDisabled
      : styles.checkbox;

    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={() => {
          handleModifierOptionSelected({
            modifierProductId: modifierValue.productID,
            modifierId: modifier.id,
            qty: 1,
            price: modifierValue.price,
            name: modifierValue.name,
          });
        }}>
        <IconIonicons style={styles.iconCheck} name="md-checkmark" />
      </TouchableOpacity>
    );
  };

  const renderThumbnailImage = ({modifierValue}) => {
    if (appConfig?.modifierType === 'textWithThumbnail') {
      const image = modifierValue?.defaultImageURL
        ? modifierValue?.defaultImageURL
        : imageSettings?.productPlaceholderImage;

      return <Image source={{uri: image}} style={styles.imageThumbnail} />;
    }
  };

  const renderOptionName = ({modifierValue, isDisabled}) => {
    const styleText = isDisabled
      ? styles.textOptionNameDisabled
      : styles.textOptionName;

    return (
      <Text numberOfLines={2} style={styleText}>
        {modifierValue?.name}
      </Text>
    );
  };

  const renderOptionBarcode = modifierValue => {
    const barcode = modifierValue?.barcode;
    return (
      additionalSetting().showBarcode &&
      barcode && <Text style={styles.textBarcode}>{barcode}</Text>
    );
  };

  const renderOptionPrice = ({isPrice, modifierValue}) => {
    if (isPrice) {
      return (
        <Text style={styles.textOptionPrice}>
          {CurrencyFormatter(modifierValue.price)}
        </Text>
      );
    }
  };

  const renderOptionNameAndPrice = ({isYesNo, modifierValue, isDisabled}) => {
    const isPrice = !isYesNo && modifierValue?.price;
    const barcode = modifierValue?.barcode;
    const styleView =
      isPrice || (additionalSetting().showBarcode && barcode)
        ? styles.viewOptionNamePrice
        : styles.viewOptionName;
    return (
      <View style={styleView}>
        {renderOptionName({modifierValue, isDisabled})}
        {renderOptionBarcode(modifierValue)}
        {renderOptionPrice({isPrice, modifierValue})}
      </View>
    );
  };

  const renderOptionCheckboxImageNamePrice = ({modifierValue, modifier}) => {
    const isDisabled = handleDisabledCheckbox({modifier, modifierValue});

    return (
      <View style={styles.viewOptionCheckboxNamePrice}>
        {renderCheckbox({modifierValue, modifier})}
        {renderThumbnailImage({modifierValue})}
        {renderOptionNameAndPrice({
          isYesNo: modifier?.isYesNo,
          modifierValue,
          isDisabled,
        })}
        {modifierValue?.orderingStatus === 'UNAVAILABLE' && (
          <Text style={styles.textOutOfStock}>Out of Stock</Text>
        )}
      </View>
    );
  };

  const renderOptionItem = ({modifierValue, modifier}) => {
    return (
      <View style={styles.viewOption}>
        {renderOptionCheckboxImageNamePrice({modifierValue, modifier})}
        {renderButtonAndTextQty({
          modifierValue,
          modifier,
        })}
      </View>
    );
  };

  const renderOptions = ({modifier}) => {
    const modifierList = modifier?.details || [];

    const result = modifierList.map(modifierValue => {
      return renderOptionItem({modifierValue, modifier});
    });

    return result;
  };

  const renderTextTermsAndConditions = productModifier => {
    const min = productModifier?.modifier?.min || 0;
    const max = productModifier?.modifier?.max || 0;

    let text = '';
    if (min === 0 && max === 0) {
      text = 'optional';
    }

    if (min > 0 && max === 0) {
      text = `Min ${min}`;
    }

    if (min === 0 && max > 0) {
      text = `Max ${max}`;
    }

    if (min > 0 && max > 0) {
      text = `Min ${min}, Max ${max}`;
    }

    return <Text style={styles.textTermsAndConditions}>{text}</Text>;
  };

  const renderTextName = productModifier => {
    return <Text style={styles.textName}>{productModifier?.modifierName}</Text>;
  };

  const renderNameAndTermsConditions = productModifier => {
    if (!productModifier.isYesNo) {
      return (
        <View style={styles.viewNameAndTermsConditions}>
          {renderTextName(productModifier)}
          {renderTextTermsAndConditions(productModifier)}
        </View>
      );
    }
  };

  const renderProductModifierItem = productModifier => {
    return (
      <View style={styles.viewProductModifierItem}>
        {renderNameAndTermsConditions(productModifier)}
        {renderOptions({
          modifier: productModifier?.modifier,
          isYesNo: productModifier?.isYesNo,
        })}
      </View>
    );
  };

  const renderProductModifiers = () => {
    if (!isEmptyArray(productModifiers)) {
      const data = handleProductModifiersData();

      const result = data.map(productModifier => {
        return renderProductModifierItem(productModifier);
      });

      return result;
    }
  };

  return renderProductModifiers();
};

export default ProductModifiers;

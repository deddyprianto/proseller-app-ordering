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
      flex: 1,
      fontSize: theme.fontSize[12],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOptionPrice: {
      fontSize: theme.fontSize[10],
      color: theme.colors.text2,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textTermsAndConditions: {
      fontSize: theme.fontSize[10],
      color: theme.colors.text2,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      width: 36,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    viewNameAndTermsConditions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    viewOption: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
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
    checkbox: {
      width: 20,
      height: 20,
      backgroundColor: 'white',
      borderRadius: 3,
      borderWidth: 1,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#667080',
    },
    checkboxActive: {
      width: 20,
      height: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
      borderWidth: 1,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.primary,
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
    iconCheck: {
      color: 'white',
      fontSize: 13,
    },
    flex1: {
      flex: 1,
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

      const isDisabled = qtyTotal <= min;

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

    return isDisabled;
  };

  const handleProductModifierYesNo = () => {
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

  const renderButtonPlus = ({selectedProductModifier, max}) => {
    const disabled = handleDisabledAddButton({
      modifier: selectedProductModifier,
      max,
    });

    return (
      <TouchableOpacity
        style={styles.touchablePlus}
        disabled={disabled}
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
    return <Text style={styles.textQty}>{qty}</Text>;
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

    if (selectedProductModifierQty > 0 && !isYesNo) {
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
    const style = active ? styles.checkboxActive : styles.checkbox;

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

  const renderOptionNameAndPrice = ({isYesNo, modifierValue}) => {
    if (isYesNo && !modifierValue?.price) {
      return (
        <View style={styles.flex1}>
          <Text numberOfLines={2} style={styles.textOptionName}>
            {modifierValue?.name}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.flex1}>
          <Text numberOfLines={2} style={styles.textOptionName}>
            {modifierValue?.name}
          </Text>
          <Text style={styles.textOptionPrice}>
            {CurrencyFormatter(modifierValue?.price)}
          </Text>
        </View>
      );
    }
  };

  const renderOptionCheckboxNamePrice = ({modifierValue, modifier}) => {
    return (
      <View style={styles.viewOptionCheckboxNamePrice}>
        {renderCheckbox({modifierValue, modifier})}
        {renderOptionNameAndPrice({
          isYesNo: modifier?.isYesNo,
          modifierValue,
        })}
      </View>
    );
  };
  const renderOptions = ({modifier}) => {
    const modifierList = modifier?.details || [];

    const result = modifierList.map(modifierValue => {
      return (
        <View style={styles.viewOption}>
          {renderOptionCheckboxNamePrice({modifierValue, modifier})}
          {renderButtonAndTextQty({
            modifierValue,
            modifier,
          })}
        </View>
      );
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
      text = `Min ${productModifier.modifier.min}`;
    }

    if (min === 0 && max > 0) {
      text = `Max ${productModifier.modifier.max}`;
    }

    if (min > 0 && max > 0) {
      text = `Min ${productModifier.modifier.min}, Max ${
        productModifier.modifier.max
      }`;
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

  const renderProductModifiers = () => {
    if (!isEmptyArray(productModifiers)) {
      const productModifiersFormatted = handleProductModifierYesNo(
        productModifiers,
      );

      const result = productModifiersFormatted.map(productModifier => {
        return (
          <View style={styles.flex1}>
            {renderNameAndTermsConditions(productModifier)}
            {renderOptions({
              modifier: productModifier?.modifier,
              isYesNo: productModifier?.isYesNo,
            })}
          </View>
        );
      });

      return result;
    }
  };

  return renderProductModifiers();
};

export default ProductModifiers;

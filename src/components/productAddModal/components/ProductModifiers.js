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

import {isEmptyArray} from '../../../helper/CheckEmpty';
import colorConfig from '../../../config/colorConfig';

const styles = StyleSheet.create({
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
    // backgroundColor: '#B7B7B7',
    backgroundColor: colorConfig.primaryColor,
    paddingVertical: 10,
  },
});

const ProductModifiers = ({
  productModifiers,
  selectedProductModifiers,
  onChange,
  isLoading,
}) => {
  const [selected, setSelected] = useState([]);

  const handleProductModifierSelected = () => {
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
    handleProductModifierSelected();
  }, []);

  useEffect(() => {
    if (!isEmptyArray(productModifiers)) {
      onChange(selected);
    }
  }, [selected]);

  const handleAddAndReduceQtyProductModifier = ({key, value}) => {
    let productModifiersQtyChanged = [];
    const qty = key === 'add' ? value.qty + 1 : value.qty - 1;

    selected.forEach(selectedProductModifier => {
      if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
        qty !== 0
      ) {
        productModifiersQtyChanged.push({...value, qty});
      } else if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
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

    const modifierProductIds = selected.map(item => {
      return item.modifierProductId;
    });

    const modifierProductIdIndex = modifierProductIds.indexOf(
      modifierProductId,
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

  const handleDisabledRemoveButtonProductModifier = ({modifier, min}) => {
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

  const handleDisabledAddButtonProductModifier = ({modifier, max}) => {
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

  const renderAddAndRemoveProductModifier = ({
    modifierProductId,
    min,
    max,
    isYesNo,
  }) => {
    const selectedProductModifier = selected.find(
      item => item.modifierProductId === modifierProductId,
    );
    const selectedProductModifierQty = selectedProductModifier?.qty || 0;

    if (selectedProductModifierQty > 0 && !isYesNo) {
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
            disabled={
              handleDisabledRemoveButtonProductModifier({
                modifier: selectedProductModifier,
                min,
              }) || isLoading
            }
            onPress={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'reduce',
                value: selectedProductModifier,
              });
            }}>
            <Text style={{color: colorConfig.primaryColor, fontSize: 16}}>
              -
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              color: colorConfig.primaryColor,
              marginHorizontal: 15,
            }}>
            {selectedProductModifierQty}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colorConfig.primaryColor,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={
              handleDisabledAddButtonProductModifier({
                modifier: selectedProductModifier,
                max,
              }) || isLoading
            }
            onPress={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'add',
                value: selectedProductModifier,
              });
            }}>
            <Text style={{color: 'white', fontSize: 16}}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderProductModifierItemPrice = ({isYesNo, modifierValue}) => {
    if (!isYesNo) {
      return (
        <View>
          <Text style={{fontSize: 12}}>{modifierValue?.name}</Text>
          <Text style={{color: '#8A8D8E', fontSize: 10}}>
            SGD {modifierValue?.price}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{fontSize: 14}}>{modifierValue?.name}</Text>
        </View>
      );
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

  const renderProductModifierCheckbox = ({modifier, modifierValue}) => {
    const active = selected.find(
      value => value.modifierProductId === modifierValue.productID,
    );

    return (
      <TouchableOpacity
        style={{
          width: 20,
          height: 20,
          backgroundColor: active ? '#667080' : 'white',
          borderRadius: 3,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#667080',
        }}
        disabled={handleDisabledCheckbox({modifier, modifierValue})}
        onPress={() => {
          handleModifierOptionSelected({
            modifierProductId: modifierValue.productID,
            modifierId: modifier.id,
            qty: 1,
            price: modifierValue.price,
            name: modifierValue.name,
          });
        }}>
        <IconIonicons
          style={{color: 'white', fontSize: 13}}
          name="md-checkmark"
        />
      </TouchableOpacity>
    );
  };

  const renderProductModifierItems = ({modifier}) => {
    const modifierList = modifier?.details || [];

    const result = modifierList.map(modifierValue => {
      return (
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 18,
              paddingVertical: 12,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {renderProductModifierCheckbox({modifierValue, modifier})}
              <View style={{marginRight: 10}} />
              {renderProductModifierItemPrice({
                isYesNo: modifier?.isYesNo,
                modifierValue,
              })}
            </View>

            {renderAddAndRemoveProductModifier({
              isYesNo: modifier?.isYesNo,
              modifierProductId: modifierValue.productID,
              max: modifier?.max,
              min: modifier?.min,
            })}
          </View>

          <View
            style={{width: '100%', height: 1, backgroundColor: '#D6D6D6'}}
          />
        </View>
      );
    });

    return result;
  };

  const renderTermsAndConditionsProductModifiers = productModifier => {
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

    return <Text style={styles.textTermsAndConditionsModifier}>{text}</Text>;
  };

  const renderProductModifierName = productModifier => {
    if (!productModifier.isYesNo) {
      return (
        <View
          style={{
            backgroundColor: '#F9F9F9',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14}}>{productModifier?.modifierName}</Text>
            <View style={{marginRight: 8}} />
            {renderTermsAndConditionsProductModifiers(productModifier)}
          </View>
        </View>
      );
    }
  };

  const renderProductModifiers = () => {
    if (!isEmptyArray(productModifiers)) {
      let productModifiersFormatted = [];
      productModifiers.forEach(productModifier => {
        if (productModifier.isYesNo) {
          productModifiersFormatted.unshift(productModifier);
        } else {
          productModifiersFormatted.push(productModifier);
        }
      });

      const result = productModifiersFormatted.map(productModifier => {
        return (
          <View>
            {renderProductModifierName(productModifier)}
            {renderProductModifierItems({
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

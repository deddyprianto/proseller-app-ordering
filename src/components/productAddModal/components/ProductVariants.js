/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import Theme from '../../../theme';

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
      fontSize: theme.fontSize[12],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewName: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    viewOption: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    viewRadioButtonActive: {
      width: 20,
      height: 20,
      borderRadius: 100,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      borderColor: theme.colors.buttonActive,
    },
    viewRadioButtonInactive: {
      width: 20,
      height: 20,
      borderRadius: 100,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      borderColor: theme.colors.greyScale2,
    },
    iconRadioButton: {
      width: 10,
      height: 10,
      borderRadius: 100,
      backgroundColor: theme.colors.buttonActive,
    },
  });
  return result;
};

const ProductVariants = ({
  productVariants,
  productVariantOptions,
  selectedProduct,
  onChange,
}) => {
  const styles = useStyle();
  const [selected, setSelected] = useState([]);

  const handleSelected = value => {
    onChange(value);
    setSelected(value);
  };

  useEffect(() => {
    if (!isEmptyArray(selectedProduct?.variants) && isEmptyArray(selected)) {
      const variant = selectedProduct.variants.find(
        item => item.id === selectedProduct.id,
      );

      handleSelected(variant?.attributes);
    } else if (!isEmptyArray(productVariants)) {
      const result = isEmptyArray(selected)
        ? productVariants[0]?.attributes || []
        : selected;

      handleSelected(result);
    }
  }, [selected]);

  const handleVariantOptionSelected = ({name, option}) => {
    if (selected) {
      const selectedChanged = selected.map(value => {
        if (value.name === name) {
          return {...value, value: option};
        }
        return value;
      });

      handleSelected(selectedChanged);
    }
  };

  const renderName = value => {
    if (value) {
      return (
        <View style={styles.viewName}>
          <Text style={styles.textName}>{value}</Text>
        </View>
      );
    }
  };

  const renderOptionName = name => {
    return <Text style={styles.textOptionName}>{name}</Text>;
  };

  const renderRadioButton = ({name, option, variantIndex}) => {
    const active = selected[variantIndex]?.value === option;

    const styleActive = active
      ? styles.viewRadioButtonActive
      : styles.viewRadioButtonInactive;

    const styleValueActive = active && styles.iconRadioButton;

    return (
      <TouchableOpacity
        onPress={() => {
          handleVariantOptionSelected({
            name,
            option,
          });
        }}
        style={styleActive}>
        <View style={styleValueActive} />
      </TouchableOpacity>
    );
  };

  const renderOptions = ({name, options, variantIndex}) => {
    if (!isEmptyArray(options)) {
      const result = options?.map(option => {
        return (
          <View style={styles.viewOption}>
            {renderRadioButton({name, option, variantIndex})}
            {renderOptionName(option)}
          </View>
        );
      });

      return result;
    }
  };

  const renderProductVariants = () => {
    if (!isEmptyArray(productVariantOptions)) {
      const result = productVariantOptions?.map((variantOption, index) => {
        return (
          <View>
            {renderName(variantOption?.optionName)}
            {renderOptions({
              name: variantOption?.optionName,
              options: variantOption?.options,
              variantIndex: index,
            })}
          </View>
        );
      });

      return result;
    }
  };

  return renderProductVariants();
};

export default ProductVariants;

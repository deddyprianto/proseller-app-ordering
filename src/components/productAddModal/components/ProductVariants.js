/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {RadioButton} from 'react-native-paper';

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
    viewRadioButton: {
      maxHeight: 20,
      maxWidth: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    radioButton: {
      width: 20,
      height: 20,
    },
    primaryColor: {
      color: theme.colors.primary,
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

  const renderRadioButton = ({name, option}) => {
    return (
      <View style={styles.viewRadioButton}>
        <RadioButton
          value={option}
          onPress={() => {
            handleVariantOptionSelected({
              name,
              option,
            });
          }}
          color={styles.primaryColor.color}
          theme={styles.radioButton}
        />
      </View>
    );
  };

  const renderOptions = ({name, options}) => {
    if (!isEmptyArray(options)) {
      const result = options?.map((option, index) => {
        return (
          <View style={styles.viewOption}>
            {renderRadioButton({name, option})}
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
            <RadioButton.Group value={selected[index]?.value}>
              {renderOptions({
                name: variantOption?.optionName,
                options: variantOption?.options,
              })}
            </RadioButton.Group>
          </View>
        );
      });

      return result;
    }
  };

  return renderProductVariants();
};

export default ProductVariants;

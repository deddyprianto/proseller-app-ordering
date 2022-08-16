/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    textCategoryName: {
      textAlign: 'center',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCategoryNameSelected: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    touchableCategoryItem: {
      borderRadius: 8,
      marginHorizontal: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    touchableCategoryItemSelected: {
      borderRadius: 8,
      marginHorizontal: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.buttonActive,
    },
  });
  return styles;
};

const ProductSubCategoryItem = ({subCategory, selected, onPress}) => {
  const styles = useStyles();

  const isSelected = subCategory?.id === selected?.id;

  const styleText = isSelected
    ? styles.textCategoryNameSelected
    : styles.textCategoryName;

  const styleTouchable = isSelected
    ? styles.touchableCategoryItemSelected
    : styles.touchableCategoryItem;

  return (
    <TouchableOpacity style={styleTouchable} onPress={onPress}>
      <Text style={styleText}>{subCategory?.name}</Text>
    </TouchableOpacity>
  );
};

export default ProductSubCategoryItem;

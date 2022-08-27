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
      marginHorizontal: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    touchableCategoryItemSelected: {
      marginHorizontal: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonActive,
    },
    touchableCategoryItemFirstIndex: {
      marginLeft: 16,
      marginRight: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    touchableCategoryItemSelectedFirstIndex: {
      marginLeft: 16,
      marginRight: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonActive,
    },
    touchableCategoryItemLastIndex: {
      marginRight: 16,
      marginLeft: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    touchableCategoryItemSelectedLastIndex: {
      marginRight: 16,
      marginLeft: 4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 7,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonActive,
    },
  });
  return styles;
};

const ProductSubCategoryItem = ({
  subCategory,
  selected,
  onPress,
  isFirstIndex,
  isLastIndex,
}) => {
  const styles = useStyles();

  const isSelected = subCategory?.id === selected?.id;

  const styleText = isSelected
    ? styles.textCategoryNameSelected
    : styles.textCategoryName;

  const handleStyleRoot = () => {
    if (isFirstIndex) {
      const styleTouchableFirstIndex = isSelected
        ? styles.touchableCategoryItemSelectedFirstIndex
        : styles.touchableCategoryItemFirstIndex;
      return styleTouchableFirstIndex;
    }

    if (isLastIndex) {
      const styleTouchableLastIndex = isSelected
        ? styles.touchableCategoryItemSelectedLastIndex
        : styles.touchableCategoryItemLastIndex;
      return styleTouchableLastIndex;
    }

    const styleTouchable = isSelected
      ? styles.touchableCategoryItemSelected
      : styles.touchableCategoryItem;
    return styleTouchable;
  };

  return (
    <TouchableOpacity style={handleStyleRoot()} onPress={onPress}>
      <Text style={styleText}>{subCategory?.name}</Text>
    </TouchableOpacity>
  );
};

export default ProductSubCategoryItem;

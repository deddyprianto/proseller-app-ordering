/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: theme.colors.greyScale3,
    },
    rootLastIndex: {
      marginHorizontal: 16,
    },
    textParent: {
      padding: 16,
    },
    textPrimary: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textSecondary: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const SearchSuggestionItem = ({searchText, suggestion, lastIndex}) => {
  const styles = useStyles();
  const styleRoot = lastIndex ? styles.rootLastIndex : styles.root;
  return (
    <TouchableOpacity style={styleRoot} onPress={suggestion?.onClick}>
      <Text style={styles.textParent}>
        <Text style={styles.textPrimary}>Search “{searchText}” in </Text>
        <Text style={styles.textSecondary}>“{suggestion?.name}”</Text>
      </Text>
    </TouchableOpacity>
  );
};

export default SearchSuggestionItem;

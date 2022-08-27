/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-navigation';

import SearchSuggestionItem from './components/SearchSuggestionItem';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
  });
  return styles;
};

const SearchSuggestionList = ({suggestions, searchText}) => {
  const styles = useStyles();

  const renderSuggestions = () => {
    const results = suggestions.map((value, index) => {
      const lastIndex = suggestions.length - 1 == index;
      return (
        <SearchSuggestionItem
          searchText={searchText}
          suggestion={value}
          lastIndex={lastIndex}
        />
      );
    });

    return results;
  };

  return <ScrollView style={styles.root}>{renderSuggestions()}</ScrollView>;
};

export default SearchSuggestionList;

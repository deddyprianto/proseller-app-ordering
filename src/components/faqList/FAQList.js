import React from 'react';

import {View, StyleSheet, ScrollView} from 'react-native';

import {isEmptyArray} from '../../helper/CheckEmpty';

import Theme from '../../theme';

import FAQGroupListItem from './components/FAQGroupListItem';
import FAQListItem from './components/FAQListItem';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    divider: {
      marginHorizontal: 16,
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
  });
  return styles;
};

const FAQList = ({faqs, searchQuery}) => {
  const styles = useStyles();

  const renderFAQList = () => {
    if (!isEmptyArray(faqs)) {
      const result = faqs.map(faq => {
        return (
          <View>
            <FAQListItem data={faq} searchQuery={searchQuery} />
            <View style={styles.divider} />
          </View>
        );
      });

      return result;
    }
  };

  const renderFAQGroupList = () => {
    if (!isEmptyArray(faqs)) {
      const result = faqs.map(faq => {
        return <FAQGroupListItem data={faq} />;
      });
      return result;
    }
  };

  const renderList = () => {
    if (searchQuery) {
      return renderFAQList();
    } else {
      return renderFAQGroupList();
    }
  };

  return <ScrollView>{renderList()}</ScrollView>;
};

export default FAQList;

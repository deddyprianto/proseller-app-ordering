import React from 'react';

import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';

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
    containerCard: {
      zIndex: 0,
    },
  });
  return styles;
};

const FAQList = ({faqs, searchQuery, onRefresh}) => {
  const styles = useStyles();

  const renderFAQList = () => {
    if (!isEmptyArray(faqs)) {
      const result = faqs.map((faq, index) => {
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
      return <View style={styles.containerCard}>{result}</View>;
    }
  };

  const renderList = () => {
    if (searchQuery) {
      return renderFAQList();
    } else {
      return renderFAQGroupList();
    }
  };

  return <View>{renderList()}</View>;
};

export default FAQList;

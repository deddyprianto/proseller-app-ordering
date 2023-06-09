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

const FAQList = ({questions, searchQuery}) => {
  const styles = useStyles();

  const renderFAQList = () => {
    if (!isEmptyArray(questions)) {
      const result = questions.map(data => {
        return (
          <View>
            <FAQListItem data={data} searchQuery={searchQuery} />
            <View style={styles.divider} />
          </View>
        );
      });

      return result;
    }
  };

  const renderFAQGroupList = () => {
    if (!isEmptyArray(questions)) {
      const result = questions.map(question => {
        return <FAQGroupListItem data={question} />;
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

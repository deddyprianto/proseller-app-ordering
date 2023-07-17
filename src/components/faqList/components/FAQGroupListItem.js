import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import Theme from '../../../theme';
import FAQListItem from './FAQListItem';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      margin: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    textTitle: {
      marginTop: 16,
      marginHorizontal: 16,
      fontSize: theme.fontSize[16],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
  });
  return styles;
};

const FAQGroupListItem = ({data}) => {
  const styles = useStyles();

  const renderItem = (faq, index) => {
    return (
      <View>
        <FAQListItem data={faq} />
        {index < data?.faqs?.length - 1 ? (
          <View style={styles.divider} />
        ) : null}
      </View>
    );
  };

  const body = () => {
    const faqList = data?.faqs?.map((faq, index) => {
      return renderItem(faq, index);
    });
    return faqList;
  };

  const header = () => {
    return <Text style={styles.textTitle}>{data?.type}</Text>;
  };

  return (
    <View style={styles.root}>
      {header()}
      {body()}
    </View>
  );
};

export default FAQGroupListItem;

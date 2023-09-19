import React from 'react';

import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';

import MyFavoriteOutletListItem from './components/MyFavoriteOutletListItem';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      borderRadius: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    text: {
      margin: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return styles;
};

const MyFavoriteOutletList = ({outlets}) => {
  const styles = useStyles();

  const renderOutletList = () => {
    if (!isEmptyArray(outlets)) {
      const result = outlets.map(outlet => {
        if (outlet) {
          const data = {...outlet, isFavorite: true};
          return <MyFavoriteOutletListItem item={data} />;
        }
      });
      return result;
    }
  };

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.text}>
        Choose a specific outlet for direct ordering.
      </Text>
      <View style={styles.container}>{renderOutletList()}</View>
    </ScrollView>
  );
};

export default MyFavoriteOutletList;

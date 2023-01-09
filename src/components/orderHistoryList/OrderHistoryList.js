/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */
import React from 'react';

import {StyleSheet} from 'react-native';
import {FlatList} from 'react-navigation';
import OrderHistoryListItem from './components/OrderHistoryListItem';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const OrderHistoryList = ({histories, filter}) => {
  const renderOrderHistoryItem = item => {
    return <OrderHistoryListItem history={item} type={filter} />;
  };

  return (
    <FlatList
      contentContainerStyle={styles.root}
      data={histories}
      renderItem={({item, index}) => renderOrderHistoryItem(item, index)}
    />
  );
};

export default OrderHistoryList;

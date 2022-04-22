import React from 'react';

import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  container: {marginTop: 16},
  text: {
    fontSize: 14,
    fontWeight: '400',
  },
  textDate: {
    fontSize: 10,
    fontWeight: '400',
  },
  textPoint: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#5CD423',
  },
});

const PointHistoryListItem = ({voucher, qty, pointToRedeem}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Receive Points</Text>
      <Text style={styles.textDate}>Fri Oct 17 2098 13:59:26 GMT+0700</Text>
      <Text style={styles.textPoint}>+46</Text>
    </View>
  );
};

export default PointHistoryListItem;

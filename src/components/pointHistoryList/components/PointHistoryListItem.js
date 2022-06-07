import moment from 'moment';
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

const PointHistoryListItem = ({history, type}) => {
  const dateFormatted = moment(history?.date).format(
    'ddd MMM DD YYYY hh:mm:ss',
  );
  const point = history?.amount;

  const textPoint = type === 'received' ? `+ ${point}` : `- ${point}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{history?.text}</Text>
      <Text style={styles.textDate}>{dateFormatted}</Text>
      <Text style={styles.textPoint}>{textPoint}</Text>
    </View>
  );
};

export default PointHistoryListItem;

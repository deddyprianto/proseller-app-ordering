/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import OrderingModeListItem from './components/OrderingModeListItem';
import {useDispatch, useSelector} from 'react-redux';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  });
  return styles;
};

const OrderingModeList = ({orderingMode, estimatedWaitingTime}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const orderingModeSelected = useSelector(
    state => state.orderReducer.dataOrderingMode.orderingMode,
  );

  const renderBody = () => {
    const result = orderingMode.map(type => {
      const isSelected = orderingModeSelected === type?.key;
      const waitingTime = estimatedWaitingTime[(type?.key)] || '';

      return (
        <OrderingModeListItem
          item={type}
          waitingTime={waitingTime}
          selected={isSelected}
          handleSelect={data => {
            dispatch({
              type: 'DATA_ORDERING_MODE',
              orderingMode: data.key,
            });
          }}
        />
      );
    });

    return <View style={styles.body}>{result}</View>;
  };

  return <ScrollView style={styles.root}>{renderBody()}</ScrollView>;
};

export default OrderingModeList;

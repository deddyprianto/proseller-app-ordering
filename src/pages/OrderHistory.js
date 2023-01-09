import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, SafeAreaView} from 'react-native';

import colorConfig from '../config/colorConfig';

import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {
  getOrderHistoryOngoing,
  getOrderHistoryPast,
} from '../actions/order.history.action';
import OrderHistoryList from '../components/orderHistoryList';
import {isEmptyArray} from '../helper/CheckEmpty';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  viewFilter: {
    marginHorizontal: 16,
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    height: 46,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    elevation: 4,
  },
  touchablePointsActive: {
    height: 34,
    backgroundColor: colorConfig.primaryColor,
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  touchablePointsInactive: {
    height: 34,
    backgroundColor: '#F9F9F9',
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPointsActive: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  textPointsInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B7B7B7',
  },
});

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('ongoing');
  const [histories, setHistories] = useState([]);

  const orderHistoryPast = useSelector(
    state => state.orderHistoryReducer.orderHistoryPast?.data,
  );
  const orderHistoryOngoing = useSelector(
    state => state.orderHistoryReducer.orderHistoryOngoing?.data,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getOrderHistoryPast());
      await dispatch(getOrderHistoryOngoing());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (filter === 'ongoing') {
      setHistories(orderHistoryOngoing);
    } else {
      setHistories(orderHistoryPast);
    }
  }, [filter, orderHistoryPast, orderHistoryOngoing]);

  const handleChangePointsFilter = value => {
    setFilter(value);
  };

  const handleStyleFilterButton = value => {
    if (value === filter) {
      return styles.touchablePointsActive;
    }
    return styles.touchablePointsInactive;
  };

  const handleStyleFilterButtonText = value => {
    if (value === filter) {
      return styles.textPointsActive;
    }
    return styles.textPointsInactive;
  };

  const renderPastButton = () => {
    const style = handleStyleFilterButton('past');
    const styleText = handleStyleFilterButtonText('past');
    return (
      <TouchableOpacity
        onPress={() => {
          handleChangePointsFilter('past');
        }}
        style={style}>
        <Text style={styleText}>Past</Text>
      </TouchableOpacity>
    );
  };

  const renderOngoingButton = () => {
    const style = handleStyleFilterButton('ongoing');
    const styleText = handleStyleFilterButtonText('ongoing');
    return (
      <TouchableOpacity
        onPress={() => {
          handleChangePointsFilter('ongoing');
        }}
        style={style}>
        <Text style={styleText}>Ongoing</Text>
      </TouchableOpacity>
    );
  };

  const renderFilter = () => {
    return (
      <View style={styles.viewFilter}>
        {renderOngoingButton()}
        {renderPastButton()}
      </View>
    );
  };

  const renderOrderHistory = () => {
    if (!isEmptyArray(histories)) {
      return <OrderHistoryList histories={histories} filter={filter} />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {renderFilter()}
      {renderOrderHistory()}
    </SafeAreaView>
  );
};

export default OrderHistory;

import React, {useEffect, useState} from 'react';

import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getReceivedPointActivity,
  getUsedPointActivity,
} from '../../actions/rewards.action';

import colorConfig from '../../config/colorConfig';
import PointHistoryListItem from './components/PointHistoryListItem';

const styles = StyleSheet.create({
  viewPointsFilterSelector: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    width: '100%',
    height: 46,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
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

const PointHistoryList = () => {
  const dispatch = useDispatch();

  const receivedPointHistories = useSelector(
    state => state.rewardsReducer.pointHistories.receivedPoints,
  );
  const usedPointHistories = useSelector(
    state => state.rewardsReducer.pointHistories.usedPoints,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getReceivedPointActivity());
      await dispatch(getUsedPointActivity());
    };
    loadData();
  }, [dispatch]);

  const [filter, setFilter] = useState('received');

  const handleChangePointsFilter = value => {
    setFilter(value);
  };

  const handleStylePointsFilterButton = value => {
    if (value === filter) {
      return styles.touchablePointsActive;
    }
    return styles.touchablePointsInactive;
  };

  const handleStylePointsFilterButtonText = value => {
    if (value === filter) {
      return styles.textPointsActive;
    }
    return styles.textPointsInactive;
  };

  const renderPointReceivedButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleChangePointsFilter('received');
        }}
        style={handleStylePointsFilterButton('received')}>
        <Text style={handleStylePointsFilterButtonText('received')}>
          Points Received
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPointUsedButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleChangePointsFilter('used');
        }}
        style={handleStylePointsFilterButton('used')}>
        <Text style={handleStylePointsFilterButtonText('used')}>
          Points Used
        </Text>
      </TouchableOpacity>
    );
  };

  const renderChangePointsFilter = () => {
    return (
      <View style={styles.viewPointsFilterSelector}>
        {renderPointReceivedButton()}
        {renderPointUsedButton()}
      </View>
    );
  };

  const renderPointList = () => {
    const histories =
      filter === 'received' ? receivedPointHistories : usedPointHistories;

    const result = histories?.map(history => {
      return <PointHistoryListItem history={history} type={filter} />;
    });
    return result;
  };

  return (
    <View>
      {renderChangePointsFilter()}
      {renderPointList()}
    </View>
  );
};

export default PointHistoryList;

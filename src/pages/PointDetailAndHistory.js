import React from 'react';

import {StyleSheet, ScrollView, View, Text, SafeAreaView} from 'react-native';

import colorConfig from '../config/colorConfig';

import PointHistoryList from '../components/pointHistoryList';
import {Body, Header} from '../components/layout';
import {useSelector} from 'react-redux';
import moment from 'moment-timezone';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'black',
  },
  textYourPoint: {
    fontSize: 10,
    color: 'white',
  },
  textYourPointValue: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  textPointDateExpired: {
    fontSize: 12,
    color: colorConfig.primaryColor,
    fontWeight: '400',
  },
  textPointHistory: {
    width: '100%',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: '400',
  },
  textDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewYourPoint: {
    display: 'flex',
    backgroundColor: colorConfig.primaryColor,
    width: '100%',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 5,
  },
  viewPointDateExpire: {
    backgroundColor: '#F9F9F9',
    width: '100%',
    borderRadius: 8,
    padding: 10,
  },
});

const PointDetailAndHistory = () => {
  const campaignDescription = useSelector(
    state => state.rewardsReducer.campaign.campaign.campaignDesc,
  );
  const totalPoint = useSelector(
    state => state.rewardsReducer.dataPoint.totalPoint,
  );

  const historyPoints = useSelector(
    state => state.rewardsReducer.dataPoint.detailPoint.history,
  );

  const renderPointHeader = () => {
    return (
      <View style={styles.viewYourPoint}>
        <Text style={styles.textYourPoint}>My Points</Text>
        <Text style={styles.textYourPointValue}>{totalPoint} PTS</Text>
      </View>
    );
  };

  const renderPointDateExpiredItem = historyPoint => {
    const {pointBalance, expiryDate} = historyPoint;
    const date = moment(expiryDate).format('DD MMM YYYY');

    return (
      <Text style={styles.textPointDateExpired}>
        {pointBalance} points will expire on {date}
      </Text>
    );
  };

  const renderPointDateExpired = () => {
    const result = historyPoints.map(historyPoint => {
      return renderPointDateExpiredItem(historyPoint);
    });

    return <View style={styles.viewPointDateExpire}>{result}</View>;
  };

  const renderTextInfo = () => {
    return <Text style={styles.textDescription}>{campaignDescription}</Text>;
  };

  const renderTextPointHistory = () => {
    return <Text style={styles.textPointHistory}>Point History</Text>;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Header title="Point Detail & History" />
        <Body>
          <ScrollView style={styles.container}>
            <View style={{marginTop: '5%'}} />
            {renderPointHeader()}
            <View style={{marginTop: '5%'}} />
            {renderTextInfo()}
            <View style={{marginTop: '5%'}} />
            {renderPointDateExpired()}
            <View style={{marginTop: '5%'}} />
            <View style={styles.divider} />
            <View style={{marginTop: '5%'}} />
            {renderTextPointHistory()}
            <View style={{marginTop: '5%'}} />
            <PointHistoryList />
          </ScrollView>
        </Body>
      </View>
    </SafeAreaView>
  );
};

export default PointDetailAndHistory;

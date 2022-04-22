import React from 'react';

import {StyleSheet, ScrollView, View, Text} from 'react-native';

import colorConfig from '../config/colorConfig';

import PointHistoryList from '../components/pointHistoryList';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
  const renderPointHeader = () => {
    return (
      <View style={styles.viewYourPoint}>
        <Text style={styles.textYourPoint}>Your Points</Text>
        <Text style={styles.textYourPointValue}>55 PTS</Text>
      </View>
    );
  };

  const renderPointDateExpired = () => {
    return (
      <View style={styles.viewPointDateExpire}>
        <Text style={styles.textPointDateExpired}>
          10 points will expire on 30 May 2022
        </Text>
      </View>
    );
  };

  const renderTextInfo = () => {
    return (
      <Text style={{fontSize: 12, fontWeight: '500'}}>
        Earn 10 Points per $1 spent
      </Text>
    );
  };

  const renderTextPointHistory = () => {
    return (
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: 12,
          fontWeight: '400',
        }}>
        Point History
      </Text>
    );
  };

  return (
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
  );
};

export default PointDetailAndHistory;

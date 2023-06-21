import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import {Header} from '../components/layout';
import {calculateDateTime} from '../helper/TimeUtils';
import moment from 'moment';
import GlobalText from '../components/globalText';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  dateText: {
    fontSize: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginTop: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#D6D6D6',
    marginVertical: 8,
  },
  messageText: {
    fontSize: 14,
  },
});

const InboxDetailMessage = props => {
  const {data} = props;
  return (
    <SafeAreaView>
      <Header title={'Inbox'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <GlobalText style={styles.dateText}>
            {calculateDateTime(moment(data.sendOn))}
          </GlobalText>
        </View>
        <View style={styles.titleContainer}>
          <GlobalText style={styles.titleText}>{data.title}</GlobalText>
        </View>
        <View style={styles.line} />
        <View>
          <GlobalText style={styles.messageText}>{data.message}</GlobalText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxDetailMessage;

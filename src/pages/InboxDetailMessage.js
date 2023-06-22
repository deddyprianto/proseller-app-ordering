import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import {Header} from '../components/layout';
import {calculateDateTime} from '../helper/TimeUtils';
import moment from 'moment';
import GlobalText from '../components/globalText';
import Theme from '../theme/Theme';
import colorConfig from '../config/colorConfig';
import Reward from '../assets/img/reward.png'
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
    fontWeight: '500',
  },
  lineReward: {
    marginVertical: 16,
  },
  rewardDesc: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  rewardContainer: {
    marginBottom: 2,
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 10,
    flexDirection: 'row',
    marginTop: 8,
    minHeight: 83,
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  leftRewardContainer: {
    width: '18%',
    height: '100%',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightRewardContainer: {
    width: '82%',
  },
  flex: {
    flex: 1,
  },
  iconReward: {
    height: 15,
    width: 15,
  },
  rewardText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});

const InboxDetailMessage = props => {
  const {data} = props;
  const {colors} = Theme();

  const renderReward = ({item, index}) => (
    <View style={styles.rewardContainer}>
      <View
        style={[styles.leftRewardContainer, {backgroundColor: colors.primary}]}>
        <Image resizeMode="contain" style={styles.iconReward} source={Reward} />
      </View>
      <View style={styles.rightRewardContainer}>
        <GlobalText style={styles.rewardText} >{item}</GlobalText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.flex}>
      <Header title={'Inbox'} />
      <ScrollView>
        <View style={styles.scrollContainer}>
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
          <View style={[styles.line, styles.lineReward]} />
          <View>
            <GlobalText style={styles.titleText}>Rewards</GlobalText>
            <GlobalText style={styles.rewardDesc}>
              All these rewards can be found on “Rewards” menu page
            </GlobalText>
          </View>
        </View>
        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data.rewards || []}
            renderItem={renderReward}
            nestedScrollEnabled
            contentContainerStyle={{paddingBottom: 30}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxDetailMessage;

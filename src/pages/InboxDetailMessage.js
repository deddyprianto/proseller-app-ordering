import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Body, Header} from '../components/layout';
import moment from 'moment';
import GlobalText from '../components/globalText';
import Theme from '../theme/Theme';
import colorConfig from '../config/colorConfig';
import Reward from '../assets/img/reward.png';
import {Actions} from 'react-native-router-flux';
import RenderHtml from 'react-native-render-html';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  dateText: {
    fontSize: 14,
    color: '#888787',
  },
  titleText: {
    fontSize: 16,
  },
  titleContainer: {
    marginTop: 24,
  },
  line: {
    height: 1,
    backgroundColor: '#D6D6D6',
    marginTop: 24,
  },
  messageText: {
    fontSize: 14,
  },
  lineReward: {
    marginVertical: 16,
  },
  rewardDesc: {
    marginTop: 8,
    fontSize: 14,
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
    width: '14%',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightRewardContainer: {
    width: '86%',
    justifyContent: 'center',
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
  },
  containerStyleFlatlist: {
    paddingBottom: 30,
  },
  rewardContainerParent: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  messageContainer: {
    marginTop: 8,
  },
  lineContainer: {
    paddingHorizontal: 15,
  },
  parentReward: {
    flexDirection: 'row',
    height: '100%',
  },
  listRewardContainer: {
    marginTop: 16,
  },
});

const InboxDetailMessage = props => {
  const {data} = props;
  const {colors, fontFamily} = Theme();
  const {width} = useWindowDimensions();

  const tagsStyles = {
    p: {
      margin: 0,
      padding: 0,
    },
  };

  const backHandle = () => {
    Actions.pop();
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandle);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandle);
    };
  }, []);

  const renderReward = ({item, index}) => (
    <View style={styles.rewardContainer}>
      <View style={styles.parentReward}>
        <View
          style={[
            styles.leftRewardContainer,
            {backgroundColor: colors.primary},
          ]}>
          <Image
            resizeMode="contain"
            style={styles.iconReward}
            source={Reward}
          />
        </View>
        <View style={styles.rightRewardContainer}>
          <GlobalText
            style={[
              styles.rewardText,
              {fontFamily: fontFamily.poppinsSemiBold},
            ]}>
            {item}
          </GlobalText>
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.flex}>
      <Header title={'Inbox'} />
      <Body>
        <ScrollView>
          <View style={styles.scrollContainer}>
            <View>
              <GlobalText
                style={[
                  styles.dateText,
                  {fontFamily: fontFamily.poppinsMedium},
                ]}>
                {moment(data.sendOn).format('DD MMMM YYYY')}
              </GlobalText>
            </View>
            <View style={styles.titleContainer}>
              <GlobalText
                style={[
                  styles.titleText,
                  {fontFamily: fontFamily.poppinsBold},
                ]}>
                {data.title}
              </GlobalText>
            </View>
            <View style={styles.messageContainer}>
              <RenderHtml
                tagsStyles={tagsStyles}
                contentWidth={width}
                source={{html: data?.message}}
              />
            </View>
          </View>
          {data?.rewards?.length > 0 ? (
            <>
              <View style={styles.lineContainer}>
                <View style={[styles.line]} />
              </View>
              <View style={styles.rewardContainerParent}>
                <View>
                  <GlobalText style={styles.titleText}>Rewards</GlobalText>
                  <GlobalText
                    style={[
                      styles.rewardDesc,
                      {fontFamily: fontFamily.poppinsMedium},
                    ]}>
                    All the available rewards can be found on Point or Voucher
                    page.{' '}
                  </GlobalText>
                </View>
              </View>

              <View style={styles.listRewardContainer}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={data.rewards || []}
                  renderItem={renderReward}
                  nestedScrollEnabled
                  contentContainerStyle={styles.containerStyleFlatlist}
                />
              </View>
            </>
          ) : null}
        </ScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default InboxDetailMessage;

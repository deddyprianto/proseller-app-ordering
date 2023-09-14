import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {format} from 'date-fns';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import {
  campaign,
  cutomerActivity,
  dataPointHistory,
} from '../actions/rewards.action';
import {getUserProfile} from '../actions/user.action';
import Loader from './loader';
import {isEmptyArray} from '../helper/CheckEmpty';
import {Header} from './layout';
import GlobalText from './globalText';
import withHooksComponent from './HOC';
import NoPointSvg from '../assets/svg/NoPointSvg';
import moment from 'moment';

class DetailPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      loading: false,
      history: [],
      customerActivity: [],
      skip: 0,
      take: 20,
      filterReceive: true,
      dataLength: 0,
      actualLength: 0,
      type: 'received',
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.getInfoPoint();
    this.getCustomerActivity();
  };

  getCustomerActivity = async () => {
    const {take, filterReceive, actualLength, customerActivity} = this.state;
    const response = await this.props.dispatch(
      cutomerActivity(actualLength, take, filterReceive),
    );

    if (!isEmptyArray(response.data)) {
      let dataActivity = customerActivity.concat(response.data);

      let actualDataLength = actualLength + response.actualLength;
      await this.setState({
        customerActivity: dataActivity,
        dataLength: response.dataLength,
        actualLength: actualDataLength,
        skip: take,
        take: take,
      });
    }
  };

  getInfoPoint = async () => {
    await this.setState({loading: true});
    try {
      const response = await this.props.dispatch(dataPointHistory());
      if (response != false) {
        const history = response.history;
        if (!isEmptyArray(history)) {
          await this.setState({history});
        }
      }
      await this.props.dispatch(getUserProfile());
      await this.props.dispatch(campaign());
    } catch (e) {}
    await this.setState({loading: false});
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  roundToTwo = num => {
    return +(Math.round(num + 'e+2') + 'e-2');
  };

  getPointInfo = item => {
    try {
      if (item.pointBalance != undefined) {
        return item.pointBalance;
      } else {
        return this.roundToTwo(item.pointDebit - item.pointKredit);
      }
    } catch (e) {
      return 0;
    }
  };

  getLabelActivity = item => {
    if (item === 'GET_POINT') {
      return 'Receive Points';
    }
    if (item === 'RECEIVE_POINT') {
      return 'Receive Points';
    }
    if (item === 'ADJUST_POINT') {
      return 'Adjusted by admin';
    }
    if (item === 'REDEEM_POINT') {
      return 'Redeem points';
    }
    if (item === 'VOID_POINT') {
      return 'Points voided';
    }
  };

  filterReceivePoint = async () => {
    try {
      const {filterReceive} = this.state;
      console.log({filterReceive}, 'filter 1');
      if (filterReceive !== true) {
        await this.setState({
          filterReceive: true,
          loading: true,
          skip: 0,
          take: 20,
          dataLength: 0,
          actualLength: 0,
          customerActivity: [],
          type: 'received',
        });
        await this.getCustomerActivity();
        await this.setState({loading: false});
      }
    } catch (e) {}
  };

  filterUsePoint = async () => {
    try {
      console.log({filterReceive}, 'filter 2');

      const {filterReceive} = this.state;
      if (filterReceive !== false) {
        await this.setState({
          filterReceive: false,
          loading: true,
          skip: 0,
          take: 20,
          dataLength: 0,
          actualLength: 0,
          customerActivity: [],
          type: 'used',
        });

        await this.getCustomerActivity();
        await this.setState({loading: false});
      }
    } catch (e) {}
  };

  loadMore = async () => {
    try {
      let {take} = this.state;
      await this.setState({
        loading: true,
        skip: take,
        take: take,
      });

      await this.getCustomerActivity();
      await this.setState({loading: false});
    } catch (e) {}
  };

  handleLocalTimeZone = date => {
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc)
      .local()
      .format('ddd DD MMM YYYY HH:mm');
    return local;
  };

  render() {
    const {colors, campignData} = this.props;
    const {customerActivity, dataLength, actualLength, history} = this.state;
    return (
      <SafeAreaView>
        {this.state.loading && <Loader />}
        <Header title={'Point Details'} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
            <View style={styles.pointDetailContainer}>
              <View style={styles.pointDetail(colors.primary)}>
                <GlobalText style={styles.pointDetailText}>
                  Your Points
                </GlobalText>
                <GlobalText style={styles.pointText}>
                  {this.props.totalPoint} PTS
                </GlobalText>
              </View>
            </View>
            <View style={styles.earnPointContainer}>
              <GlobalText style={styles.earnPointText}>
                Earn {campignData?.points?.netSpendToPoint1} Points per{' '}
                {`$${campignData?.points?.netSpendToPoint0}`} spent
              </GlobalText>
            </View>
            {!isEmptyArray(history) && (
              <View style={styles.ph16}>
                <View style={styles.pointExpiredContainer(colors.greyScale4)}>
                  <GlobalText style={styles.pointExpiredText(colors.primary)}>
                    {history[0].pointBalance} points will expire on{' '}
                    {format(new Date(history[0].expiryDate), 'dd MMM yyyy')}
                  </GlobalText>
                </View>
              </View>
            )}

            <View style={[styles.ph16, styles.mv16]}>
              <View style={styles.divider(colors.greyScale3)} />
            </View>

            <View style={[styles.mainPanel, styles.ph16]}>
              <Text style={styles.title}>Points History</Text>
              <View style={styles.panelTabContainer(colors.greyScale4)}>
                <View style={styles.panelTab}>
                  <TouchableOpacity
                    onPress={this.filterReceivePoint}
                    style={
                      this.state.type === 'received'
                        ? styles.active(colors.primary)
                        : styles.inactiveFilter
                    }>
                    <Text
                      style={styles.tabText(
                        this.state.type === 'received',
                        colors.greyScale2,
                      )}>
                      Points Received
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.filterUsePoint}
                    style={
                      this.state.type === 'used'
                        ? styles.active(colors.primary)
                        : styles.inactiveFilter
                    }>
                    <Text
                      style={styles.tabText(
                        this.state.type === 'used',
                        colors.greyScale2,
                      )}>
                      Points Used
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!isEmptyArray(customerActivity) ? (
                customerActivity.map(item => (
                  <View key={item.id} style={styles.customerActivityList}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.activityTitle}>
                        {this.getLabelActivity(item.activityType)}
                      </Text>
                      <Text
                        style={styles.activityRewardsPositive(
                          this.state.type,
                          colors.primary,
                          colors.colorPointPlus,
                        )}>
                        {Number(item.amount) > 0 &&
                        this.state.type === 'received'
                          ? '+'
                          : null}
                        {Number(item.amount) > 0 && this.state.type === 'used'
                          ? '-'
                          : null}
                        {Number(item.amount)}
                      </Text>
                    </View>
                    <Text style={styles.activityDate(colors.greyScale2)}>
                      {this.handleLocalTimeZone(item.activityDate)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noPointContainer}>
                  <NoPointSvg />
                  <View style={styles.noPointTitle}>
                    <GlobalText style={styles.noPointTitleText}>
                      No Points Yet
                    </GlobalText>
                  </View>
                  <View>
                    <GlobalText
                      style={[
                        styles.noPointDescText,
                        {color: colors.greyScale5},
                      ]}>
                      Start ordering and begin your journey towards exciting
                      rewards.
                    </GlobalText>
                  </View>
                </View>
              )}

              {dataLength > 0 && dataLength != actualLength && (
                <TouchableOpacity
                  onPress={this.loadMore}
                  style={{
                    borderColor: colorConfig.pageIndex.grayColor,
                    borderWidth: 0.5,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.grayColor,
                      fontWeight: 'bold',
                    }}>
                    Load More
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
  },
  header: {
    padding: 15,
    paddingLeft: 23,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  historyPoint: {
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: colorConfig.pageIndex.grayColor,
  },
  mainPanel: {
    backgroundColor: 'white',
  },
  panel: {
    marginVertical: 5,
    borderTopWidth: 1,
    paddingBottom: 15,
    borderTopColor: colorConfig.pageIndex.inactiveTintColor,
  },
  panelNoBorder: {
    marginVertical: 5,
    paddingBottom: 10,
  },
  title: {
    color: colorConfig.store.title,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  titleHeader: {
    color: colorConfig.store.defaultColor,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    // marginBottom: 5,
    textAlign: 'center',
    marginLeft: 30,
  },
  titlePoint: {
    color: 'white',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    color: colorConfig.store.titleSelected,
    fontSize: 17,
    marginVertical: 10,
    // textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  subTitlePoint: {
    color: colorConfig.store.titleSelected,
    fontSize: 30,
    fontFamily: 'Poppins-Medium',
  },
  value: {
    color: colorConfig.store.secondaryColor,
    fontSize: 37,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  simpleText: {
    color: colorConfig.store.titleSelected,
    fontSize: 16,
    padding: 2,
    fontFamily: 'Poppins-Regular',
  },
  simpleTextValue: {
    color: colorConfig.store.secondaryColor,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  simpleTextValueRatio: {
    color: colorConfig.store.secondaryColor,
    fontSize: 18,
    // marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
    fontSize: 14,
  },
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
  },
  stampsDescription: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  imageStamp: {
    height: Dimensions.get('window').height / 2,
    // borderRadius: 30,
    // marginHorizontal: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  card: {
    backgroundColor: colorConfig.store.defaultColor,
    height: 180,
    marginTop: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10.49,
    elevation: 12,
  },
  textCustomerGroup: {
    color: 'white',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: 'Poppins-Medium',
  },
  textPoint: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    fontSize: 35,
    fontFamily: 'Poppins-Medium',
  },
  line: {
    borderBottomWidth: 2,
    marginHorizontal: 20,
    borderColor: 'white',
    marginTop: 20,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  activityRewardsPositive: (type, primaryColor, colorReceived) => ({
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: type === 'used' ? primaryColor : colorReceived,
  }),
  activityDate: color => ({
    fontSize: 12,
    color: color,
    fontFamily: 'Poppins-Medium',
  }),
  customerActivityList: {
    paddingVertical: 6,
    marginVertical: 7,
  },

  active: color => ({
    width: '50%',
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderTopRightRadius: 5,
    borderRadius: 8,
  }),
  inactiveFilter: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    width: '50%',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  pointDetailContainer: {
    flex: 1,
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  pointDetail: bgColor => ({
    backgroundColor: bgColor || colorConfig.primaryColor,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 20,
  }),
  pointDetailText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  pointText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  earnPointContainer: {
    paddingHorizontal: 16,
  },
  earnPointText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  ph16: {
    paddingHorizontal: 16,
  },
  pointExpiredContainer: color => ({
    padding: 10,
    backgroundColor: color,
    borderRadius: 8,
  }),
  pointExpiredText: color => ({
    color,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  }),
  divider: color => ({
    height: 1,
    backgroundColor: color,
  }),
  mv16: {
    marginVertical: 16,
  },
  panelTabContainer: color => ({
    backgroundColor: color,
    padding: 6,
    borderRadius: 8,
  }),
  tabText: (active, color) => ({
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: active ? 'white' : color,
  }),
  noPointContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPointTitle: {
    marginVertical: 16,
  },
  noPointTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  noPointDescText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 30,
  },
});

const mapStateToProps = state => ({
  campignData: state.rewardsReducer.campaign.campaign,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  dataPoint: state.rewardsReducer.dataPoint,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withHooksComponent(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ),
  )(DetailPoint),
);

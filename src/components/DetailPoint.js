import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {format} from 'date-fns';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {
  campaign,
  cutomerActivity,
  dataPoint,
  dataPointHistory,
} from '../actions/rewards.action';
import {getUserProfile} from '../actions/user.action';
import Loader from './loader';
import {isEmptyArray} from '../helper/CheckEmpty';
import LinearGradient from 'react-native-linear-gradient';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/index';

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
    const {
      skip,
      take,
      filterReceive,
      actualLength,
      customerActivity,
    } = this.state;
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
      if (filterReceive != true) {
        await this.setState({
          filterReceive: true,
          loading: true,
          skip: 0,
          take: 20,
          dataLength: 0,
          actualLength: 0,
          customerActivity: [],
        });
        await this.getCustomerActivity();
        await this.setState({loading: false});
      }
    } catch (e) {}
  };

  filterUsePoint = async () => {
    try {
      const {filterReceive} = this.state;
      if (filterReceive != false) {
        await this.setState({
          filterReceive: false,
          loading: true,
          skip: 0,
          take: 20,
          dataLength: 0,
          actualLength: 0,
          customerActivity: [],
        });

        await this.getCustomerActivity();
        await this.setState({loading: false});
      }
    } catch (e) {}
  };

  loadMore = async () => {
    try {
      let {skip, take} = this.state;
      await this.setState({
        loading: true,
        skip: take,
        take: take,
      });

      await this.getCustomerActivity();
      await this.setState({loading: false});
    } catch (e) {}
  };

  render() {
    const {intlData, campign} = this.props;
    const {
      history,
      customerActivity,
      filterReceive,
      dataLength,
      actualLength,
    } = this.state;
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }

    let color1 = '#f1c40f';
    let color2 = '#f39c12';
    let color3 = '#e67e22';

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        {this.state.loading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={this.goBack}
                style={{alignItems: 'center'}}>
                <Icon
                  size={Platform.OS === 'ios' ? 37 : 28}
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  style={{color: colorConfig.store.defaultColor}}
                />
              </TouchableOpacity>
              <Text style={styles.titleHeader}>Rewards Points</Text>
            </View>
            <LinearGradient
              colors={[color1, color2, color3]}
              style={styles.card}>
              <Text style={styles.textCustomerGroup}>You Have</Text>
              <View style={styles.line} />
              <Text style={styles.textPoint}>
                {this.props.totalPoint}{' '}
                {/* <Text style={{fontSize: 23}}> {campign.name}</Text> */}
              </Text>
            </LinearGradient>

            <View style={styles.mainPanel}>
              {/* <Text style={styles.subTitle}>{campign.campaignDesc}</Text> */}
              <View style={[styles.panel, {paddingTop: 5}]}>
                <View style={styles.panelNoBorder}>
                  {!isEmptyArray(history) && (
                    <View style={styles.historyPoint}>
                      <View>
                        <Text style={styles.simpleText}>
                          <Text
                            style={{
                              color: colorConfig.store.secondaryColor,
                              fontWeight: 'bold',
                            }}>
                            {this.getPointInfo(history[0])}
                          </Text>{' '}
                          points will expire on{' '}
                          {format(
                            new Date(history[0].expiryDate),
                            'dd MMM yyyy',
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                {/* <TouchableOpacity
                  onPress={() => Actions.rewards()}
                  style={{
                    marginTop: 40,
                    borderColor: colorConfig.store.secondaryColor,
                    borderWidth: 0.8,
                    padding: 10,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    borderRadius: 6,
                    width: '100%',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: colorConfig.store.secondaryColor,
                      fontFamily: 'Poppins-Regular',
                      fontSize: 16,
                    }}>
                    Redeem Voucher
                  </Text>
                  <Icon
                    size={Platform.OS === 'ios' ? 28 : 27}
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-arrow-dropright'
                        : 'md-arrow-dropright'
                    }
                    style={{color: colorConfig.store.secondaryColor}}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
            <View
              style={[styles.mainPanel, {marginTop: 10, paddingBottom: 10}]}>
              <Text style={styles.title}>Points History</Text>
              <View style={styles.panelTab}>
                <TouchableOpacity
                  onPress={this.filterReceivePoint}
                  style={
                    filterReceive ? styles.activeLeft : styles.inactiveFilter
                  }>
                  <Text>Points Received</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.filterUsePoint}
                  style={
                    filterReceive ? styles.inactiveFilter : styles.activeRight
                  }>
                  <Text>Points Used</Text>
                </TouchableOpacity>
              </View>
              {!isEmptyArray(customerActivity) &&
                customerActivity.map(item => (
                  <View style={styles.customerActivityList}>
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
                    <Text style={styles.activityDate}>
                      {format(
                        new Date(item.activityDate),
                        'iii dd MMM yyyy HH:mm',
                      )}
                    </Text>
                  </View>
                ))}

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
    backgroundColor: '#f5f5f5',
    // height: '100%',
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
    marginTop: -5,
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 30,
    zIndex: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 12,
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
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
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
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: colorConfig.store.secondaryColor,
  },
  activityRewardsPositive: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.colorSuccess,
  },
  activityDate: {
    fontSize: 12,
    color: colorConfig.store.titleSelected,
  },
  customerActivityList: {
    borderBottomWidth: 0.7,
    borderBottomColor: colorConfig.pageIndex.grayColor,
    paddingVertical: 6,
    marginVertical: 7,
  },
  activeLeft: {
    width: '50%',
    // backgroundColor: colorConfig.store.secondaryColor,
    backgroundColor: colorConfig.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  activeRight: {
    width: '50%',
    backgroundColor: colorConfig.store.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  inactiveFilter: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    width: '50%',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTab: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colorConfig.store.secondaryColor,
  },
});

mapStateToProps = state => ({
  campign: state.rewardsReducer.campaign.campaign,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DetailPoint);

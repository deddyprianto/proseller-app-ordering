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
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import Loader from '../loader';
import {isEmptyArray} from '../../helper/CheckEmpty';
import LinearGradient from 'react-native-linear-gradient';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import appConfig from '../../config/appConfig';
import {
  getSVCBalance,
  getSVCCard,
  svcActivity,
  svcHistory,
} from '../../actions/SVC.action';

class Summary extends Component {
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
      historySVC: [],
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.getBalance();
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
    const response = await this.props.dispatch(svcActivity(actualLength, take));

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

  refreshCustomerActivity = async () => {
    const response = await this.props.dispatch(svcActivity(0, 10));

    if (!isEmptyArray(response.data)) {
      let dataActivity = response.data;

      let actualDataLength = response.actualLength;
      await this.setState({
        customerActivity: dataActivity,
        dataLength: response.dataLength,
        actualLength: actualDataLength,
        skip: 0,
        take: 10,
      });
    }
  };

  getBalance = async () => {
    await this.setState({loading: true});
    try {
      await this.props.dispatch(getSVCBalance());
      await this.props.dispatch(getSVCCard());
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
    if (item === 'REDEEM_SVC') {
      return 'Redeem';
    }
    if (item === 'ADJUST_SVC') {
      return 'Adjust SVC';
    }
    if (item === 'RECEIVE_TRANSFER_SVC') {
      return 'Receive Transfer';
    }
    if (item === 'TRANSFER_SVC') {
      return 'Transfer SVC';
    }
    if (item === 'DEDUCT_SVC') {
      return 'Deduct';
    }
    if (item === 'TOPUP_SVC') {
      return 'Top Up';
    }
    return item;
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
          historySVC: [],
        });
        await this.getCustomerActivity();
        await this.setState({loading: false});
      }
    } catch (e) {}
  };

  filterHistory = async () => {
    try {
      await this.setState({loading: true});
      await this.setState({
        filterReceive: false,
        skip: 0,
        take: 10,
        dataLength: 0,
        actualLength: 0,
        customerActivity: [],
      });
      const response = await this.props.dispatch(svcHistory(0, 20));
      await this.setState({historySVC: response});
      await this.setState({loading: false});
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

  format2 = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(curr, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  checkPrefix = item => {
    try {
      if (
        item.includes('DEDUCT') ||
        item.includes('TRANSFER') ||
        item.includes('REDEEM')
      ) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  };

  render() {
    const {intlData, svc} = this.props;
    const {
      historySVC,
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

    let color1 = colorConfig.store.defaultColor;
    let color2 = '#d35400';
    let color3 = colorConfig.store.defaultColor;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        {this.state.loading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <LinearGradient
              colors={[color1, color2, color3]}
              style={styles.card}>
              <View style={{marginBottom: -50}}>
                <TouchableOpacity onPress={this.goBack} style={{zIndex: 99}}>
                  <Icon
                    size={Platform.OS === 'ios' ? 40 : 30}
                    name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                    style={{
                      color: 'white',
                      padding: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Italic',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginBottom: -5,
                    opacity: 0.8,
                  }}>
                  Membership
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Black',
                    textAlign: 'center',
                    color: colorConfig.store.secondaryColor,
                    fontSize: 20,
                  }}>
                  {userDetail && userDetail.customerGroupName}
                </Text>
              </View>
              <Text style={styles.textCustomerGroup}>Balance</Text>

              <View
                style={{alignSelf: 'center', marginLeft: -30, marginTop: -15}}>
                <Text style={styles.textPoint}>
                  <Text style={{fontSize: 19}}>{appConfig.appMataUang}</Text>
                  {this.format2(CurrencyFormatter(this.props.balance))}
                </Text>
              </View>
              <View style={styles.line} />
              {!isEmptyArray(svc) ? (
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    onPress={() =>
                      Actions.buySVC({
                        getCustomerActivity: this.refreshCustomerActivity,
                      })
                    }>
                    <View style={styles.btnAction}>
                      <Icon
                        size={40}
                        name={
                          Platform.OS === 'ios'
                            ? 'ios-add-circle'
                            : 'md-add-circle'
                        }
                        style={{color: colorConfig.store.secondaryColor}}
                      />
                    </View>
                    <Text style={styles.txtBtn}>Top Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Actions.transferSVC({
                        getCustomerActivity: this.refreshCustomerActivity,
                      })
                    }>
                    <View style={styles.btnAction}>
                      <Icon
                        size={40}
                        name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'}
                        style={{color: colorConfig.store.secondaryColor}}
                      />
                    </View>
                    <Text style={styles.txtBtn}>Transfer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    You are not eligible to use Store Value Card now.
                  </Text>
                </View>
              )}
            </LinearGradient>

            <View
              style={[styles.mainPanel, {marginTop: -20, paddingBottom: 10}]}>
              <Text style={styles.title}>
                {filterReceive ? 'History SVC' : 'Balance Expiration'}
              </Text>
              <View style={styles.panelTab}>
                <TouchableOpacity
                  onPress={this.filterReceivePoint}
                  style={
                    filterReceive ? styles.activeLeft : styles.inactiveFilter
                  }>
                  <Text>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.filterHistory}
                  style={
                    filterReceive ? styles.inactiveFilter : styles.activeRight
                  }>
                  <Text>Expiration</Text>
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
                      <Text style={styles.activityRewardsPositive}>
                        {item.amount > 0 && this.checkPrefix(item.activityType)
                          ? '+'
                          : null}
                        {item.amount > 0 && !this.checkPrefix(item.activityType)
                          ? '-'
                          : null}
                        {item.amount}
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

              {!isEmptyArray(historySVC) &&
                historySVC.map(item => (
                  <View style={styles.customerActivityList}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={[styles.activityTitle, {paddingVertical: 5}]}>
                        {appConfig.appMataUang}
                        {this.format2(CurrencyFormatter(item.balance))}{' '}
                        <Text>
                          {' '}
                          <Text
                            style={{
                              color: colorConfig.store.titleSelected,
                              fontSize: 14,
                            }}>
                            will Expire on{' '}
                            {format(
                              new Date(item.expiryDate),
                              'iii dd MMM yyyy',
                            )}
                          </Text>
                        </Text>
                      </Text>
                    </View>
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 70,
    marginTop: 15,
  },
  btnAction: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    textAlign: 'center',
    marginTop: 5,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  header: {
    padding: 10,
    paddingLeft: 23,
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
    marginBottom: 5,
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
    height: 370,
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
    fontSize: 15,
    // letterSpacing: 2,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  textPoint: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    fontSize: 39,
    fontFamily: 'Poppins-Medium',
  },
  currency: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  line: {
    borderBottomWidth: 1,
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
    backgroundColor: colorConfig.store.secondaryColor,
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
  balance: state.SVCReducer.balance.balance,
  defaultBalance: state.SVCReducer.balance.defaultBalance,
  svc: state.SVCReducer.SVCCard.svc,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Summary);

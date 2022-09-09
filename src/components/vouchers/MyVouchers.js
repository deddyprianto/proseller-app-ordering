/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  BackHandler,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {dataPoint, vouchers} from '../../actions/rewards.action';
import {myVoucers} from '../../actions/account.action';
import {format} from 'date-fns';

class MyVouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      currentDay: new Date(),
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear()
    );
  }

  getMonth(value) {
    var mount = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return mount[value];
  }

  pageDetailVoucher = item => {
    // console.log(item);
    // Actions.voucher({dataVoucher: item})
  };

  getDataVoucher = async () => {
    this.setState({refreshing: true});
    await this.props.dispatch(dataPoint());
    await this.props.dispatch(myVoucers());
    this.setState({refreshing: false});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataVoucher();
    this.setState({refreshing: false});
  };

  render() {
    const {intlData} = this.props;
    const myVoucers = this.props.data;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <View style={styles.container}>
          {myVoucers == undefined || myVoucers.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {intlData.messages.emptyVoucher}
              </Text>
            </View>
          ) : (
            myVoucers
              .filter(voucher => voucher.totalRedeem > 0)
              .map((item, keys) => (
                <View key={keys}>
                  {
                    <View
                      style={styles.voucherItem}
                      onPress={() => this.pageDetailVoucher(item)}>
                      <View style={{alignItems: 'center'}}>
                        <Image
                          style={
                            item['image'] != '' && item['image'] != undefined
                              ? styles.voucherImage1
                              : styles.voucherImage2
                          }
                          source={
                            item['image'] != '' && item['image'] != undefined
                              ? {uri: item['image']}
                              : appConfig.appImageNull
                          }
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: colorConfig.store.transparentColor,
                            height: 30,
                            // width: this.state.screenWidth / 2 - 11,
                            borderTopLeftRadius: 9,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.backgroundColor,
                              fontSize: 16,
                              fontWeight: 'bold',
                              textAlign: 'left',
                            }}>
                            {item['totalRedeem'] + 'x'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.voucherDetail}>
                        {/*<View style={styles.status}>*/}
                        {/*  <Text style={styles.statusTitle}>Awarded</Text>*/}
                        {/*</View>*/}
                        <Text style={styles.nameVoucher}>{item['name']}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-list' : 'md-list'
                            }
                            style={{
                              color: colorConfig.store.secondaryColor,
                              marginRight: 5,
                            }}
                          />
                          <Text style={styles.descVoucher}>
                            {item['voucherDesc'] != null
                              ? item['voucherDesc']
                              : 'No description for this voucher'}
                          </Text>
                        </View>
                        {item['validity']['canOnlyRedeemedByMerchant'] ===
                          true && (
                          <View style={{flexDirection: 'row', marginTop: 10}}>
                            <Icon
                              size={15}
                              name={
                                Platform.OS === 'ios' ? 'ios-alert' : 'md-alert'
                              }
                              style={{
                                color: colorConfig.store.secondaryColor,
                                marginRight: 5,
                              }}
                            />
                            <Text style={styles.descVoucher}>
                              This voucher can only be redeemed by Merchant.
                            </Text>
                          </View>
                        )}
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-time' : 'md-time'
                            }
                            style={{
                              color: colorConfig.store.secondaryColor,
                              marginRight: 5,
                            }}
                          />
                          {item['validity']['allDays'] ? (
                            <Text style={styles.descVoucher}>
                              {intlData.messages.voucherValid}
                            </Text>
                          ) : (
                            <Text style={styles.descVoucherTime}>
                              {intlData.messages.voucherValidOn}
                              {item['validity']['activeWeekDays']
                                .filter(items => items.active == true)
                                .map(data => (
                                  <Text>
                                    {', '}{' '}
                                    <Text style={{fontWeight: 'bold'}}>
                                      {data.day.toLowerCase()}
                                    </Text>{' '}
                                  </Text>
                                ))}
                            </Text>
                          )}
                        </View>
                        {item['expiryDate'] && (
                          <View style={{flexDirection: 'row'}}>
                            <Icon
                              size={15}
                              name={
                                Platform.OS === 'ios' ? 'ios-alert' : 'md-alert'
                              }
                              style={{
                                color: colorConfig.store.secondaryColor,
                                marginRight: 5,
                              }}
                            />
                            <Text
                              style={[
                                styles.descVoucher,
                                {color: colorConfig.store.colorError},
                              ]}>
                              This voucher will expire on{' '}
                              {format(
                                new Date(item['expiryDate']),
                                'dd MMM yyyy',
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  }
                </View>
              ))
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 200,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    resizeMode: 'contain',
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    width: 70,
  },
  statusTitle: {
    fontSize: 12,
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
  },
  nameVoucher: {
    fontSize: 18,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    color: colorConfig.store.titleSelected,
  },
  descVoucherTime: {
    fontSize: 12,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 12,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
});

mapStateToProps = state => ({
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});
export default compose(connect(mapDispatchToProps))(MyVouchers);

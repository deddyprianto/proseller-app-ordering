import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {dataPoint, vouchers} from '../../actions/rewards.action';
import {myVoucers} from '../../actions/account.action';

class AllVouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: this.props.dataVoucher,
      currentDay: new Date(),
      refreshing: false,
    };
  }

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
    Actions.voucher({dataVoucher: item});
  };

  getDataVoucher = async () => {
    this.setState({refreshing: true});
    await this.props.dispatch(dataPoint());
    await this.props.dispatch(vouchers());
    await this.props.dispatch(myVoucers());
    this.setState({refreshing: false});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataVoucher();
    this.setState({refreshing: false});
  };

  render() {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.container}>
            <View>
              {this.props.vouchers == undefined ||
              this.props.vouchers.length == 0 ? (
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
                    Vouchers is empty
                  </Text>
                </View>
              ) : (
                this.props.vouchers.map((item, keys) => (
                  <View key={keys}>
                    {
                      <TouchableOpacity
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
                          <View style={styles.vourcherPoint}>
                            <Text
                              style={{
                                color: colorConfig.pageIndex.backgroundColor,
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'right',
                              }}>
                              {item['redeemValue'] + ' Points'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.voucherDetail}>
                          <Text style={styles.nameVoucher}>{item['name']}</Text>
                          <View style={{flexDirection: 'row'}}>
                            <Icon
                              size={15}
                              name={
                                Platform.OS === 'ios' ? 'ios-list' : 'md-list'
                              }
                              style={{
                                color: colorConfig.pageIndex.inactiveTintColor,
                                marginRight: 3,
                              }}
                            />
                            <Text style={styles.descVoucher}>
                              {item['voucherDesc'] != null
                                ? item['voucherDesc']
                                : 'No description for this voucher'}
                            </Text>
                          </View>
                          {/*<View style={{flexDirection: 'row'}}>*/}
                          {/*  <Icon*/}
                          {/*    size={15}*/}
                          {/*    name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}*/}
                          {/*    style={{*/}
                          {/*      color: colorConfig.pageIndex.inactiveTintColor,*/}
                          {/*      marginRight: 3,*/}
                          {/*    }}*/}
                          {/*  />*/}
                          {/*  {item['validity']['longTerm'] ? (*/}
                          {/*    <Text style={styles.descVoucher}>*/}
                          {/*      {item['validity']['activeWeekDays'][*/}
                          {/*        this.state.currentDay.getDay()*/}
                          {/*      ]['validHour']['from'] +*/}
                          {/*        ' - ' +*/}
                          {/*        item['validity']['activeWeekDays'][*/}
                          {/*          this.state.currentDay.getDay()*/}
                          {/*        ]['validHour']['to']}*/}
                          {/*    </Text>*/}
                          {/*  ) : (*/}
                          {/*    <Text style={styles.descVoucher}>*/}
                          {/*      /!*{this.getDate(*!/*/}
                          {/*      /!*  item['validity']['validDate']['startDate'],*!/*/}
                          {/*      /!*) +*!/*/}
                          {/*      /!*  ' - ' +*!/*/}
                          {/*      /!*  this.getDate(*!/*/}
                          {/*      /!*    item['validity']['validDate']['endDate'],*!/*/}
                          {/*      /!*  )}*!/*/}
                          {/*      ini date nya*/}
                          {/*    </Text>*/}
                          {/*  )}*/}
                          {/*</View>*/}
                        </View>
                      </TouchableOpacity>
                    }
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  vourcherPoint: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colorConfig.store.transparentColor,
    height: 30,
    // width: this.state.screenWidth / 2 - 11,
    borderTopRightRadius: 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherImage1: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width - 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 16,
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
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 13,
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
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(AllVouchers);

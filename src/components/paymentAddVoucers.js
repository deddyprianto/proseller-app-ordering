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
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

export default class PaymentAddVoucers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      currentDay: new Date(),
    };
  }

  goBack() {
    Actions.pop();
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
    Actions.paymentDetail({
      pembayaran: this.props.pembayaran,
      dataVoucer: item,
    });
    // Actions.voucher({dataVoucher: item})
  };

  render() {
    const myVoucers = this.props.data;
    console.log('Vouchernya ', myVoucers);
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView>
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
                Vouchers is empty
              </Text>
            </View>
          ) : (
            myVoucers
              .filter(voucher => voucher.totalRedeem > 0)
              .map((item, keys) => (
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
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: 'rgba(128,128,128, 0.8)',
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
                        {/* <View
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            backgroundColor: 'rgba(2, 168, 80, 0.8)',
                            height: 30,
                            // width: this.state.screenWidth / 2 - 11,
                            borderTopRightRadius: 9,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.backgroundColor,
                              fontSize: 16,
                              fontWeight: 'bold',
                              textAlign: 'right',
                            }}>
                            {item['redeemValue'] + ' Points'}
                          </Text>
                        </View> */}
                      </View>
                      <View style={styles.voucherDetail}>
                        <View style={styles.status}>
                          <Text style={styles.statusTitle}>Awarded</Text>
                        </View>
                        <Text style={styles.nameVoucher}>
                          {item['voucherName']}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-list' : 'md-list'
                            }
                            style={{
                              color: colorConfig.pageIndex.activeTintColor,
                              marginRight: 8,
                            }}
                          />
                          <Text style={styles.descVoucher}>
                            {item['voucherDesc']}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-time' : 'md-time'
                            }
                            style={{
                              color: colorConfig.pageIndex.activeTintColor,
                              marginRight: 8,
                            }}
                          />
                          {item['validity']['allDays'] ? (
                            <Text style={styles.descVoucher}>
                              This voucher is valid in all days.
                            </Text>
                          ) : (
                            <Text style={styles.descVoucherTime}>
                              This voucher is valid on
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
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              ))
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 14,
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  descVoucherTime: {
    fontSize: 11,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 13,
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

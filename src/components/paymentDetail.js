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
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as _ from 'lodash';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

class PaymentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      totalBayar:
        this.props.dataVoucer == undefined
          ? this.props.pembayaran.payment
          : this.props.dataVoucer.voucherType == 'discAmount'
          ? this.props.pembayaran.payment -
            this.props.dataVoucer.voucherValue / 100
          : this.props.pembayaran.payment - this.props.dataVoucer.voucherValue,
    };
  }

  goBack() {
    Actions.popTo('pageIndex');
  }

  btnPayment = () => {
    Actions.paymentSuccess();
  };

  myVouchers = () => {
    var myVoucers = [];
    if (this.props.myVoucers.data != undefined) {
      _.forEach(
        _.groupBy(
          this.props.myVoucers.data.filter(voucher => voucher.deleted == false),
          'id',
        ),
        function(value, key) {
          value[0].totalRedeem = value.length;
          myVoucers.push(value[0]);
        },
      );
    }

    console.log(myVoucers);
    Actions.paymentAddVoucers({
      data: myVoucers,
      pembayaran: this.props.pembayaran,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {console.log(this.props)}
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
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>Payment Detail</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Store Name</Text>
                <Text style={styles.desc}>
                  {this.props.pembayaran.storeName}
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: 5,
                  marginBottom: 10,
                }}>
                <Text style={styles.desc}>Detail Item :</Text>
                <View style={styles.itemDetail}>
                  {this.props.pembayaran.dataPay.map((item, key) => (
                    <View key={key}>
                      {
                        <View
                          style={{
                            borderBottomColor: colorConfig.pageIndex.grayColor,
                            borderBottomWidth: 1,
                            borderStyle: 'dotted',
                          }}>
                          <Text style={styles.descItem}>{item.itemName}</Text>
                          <View style={styles.itemDesc}>
                            <Text style={styles.descItem}>
                              {item.qty + ' Pcs'}
                            </Text>
                            <Text style={styles.descItem}>{item.qty}</Text>
                            <Text style={styles.descItem}>
                              {item.qty * item.prace}
                            </Text>
                          </View>
                        </View>
                      }
                    </View>
                  ))}
                  <View style={styles.lineSubtotal} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.desc}>Subtotal</Text>
                    <Text style={styles.desc}>
                      {appConfig.appMataUang +
                        ' ' +
                        this.props.pembayaran.payment}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>Payment Method</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.desc}>Points</Text>
                  </View>
                  <TouchableOpacity style={styles.btnMethod}>
                    <Text style={styles.descMethod}>Add a Points</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.grayColor,
                    width: 1,
                    height: 50,
                  }}
                />
                {this.props.dataVoucer != undefined ? (
                  <View>
                    <View style={{alignItems: 'center'}}>
                      <Text style={styles.desc}>Voucher</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnMethod}
                      onPress={this.myVouchers}>
                      <Icon
                        size={15}
                        name={
                          Platform.OS === 'ios'
                            ? 'ios-information-circle'
                            : 'md-information-circle'
                        }
                        style={{color: colorConfig.pageIndex.listBorder}}
                      />
                      <Text style={styles.descMethod}>
                        {this.props.dataVoucer.voucherName.substr(0, 10)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={{alignItems: 'center'}}>
                      <Text style={styles.desc}>Voucher</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnMethod}
                      onPress={this.myVouchers}>
                      <Text style={styles.descMethod}>Add a Voucher</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <View style={styles.line} />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                }}>
                TOTAL
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colorConfig.pageIndex.activeTintColor,
                }}>
                {appConfig.appMataUang + ' ' + this.state.totalBayar}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colorConfig.pageIndex.activeTintColor,
                borderRadius: 10,
                margin: 10,
                height: 45,
                justifyContent: 'center',
              }}
              onPress={this.btnPayment}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colorConfig.pageIndex.backgroundColor,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Pay Cash
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontWeight: 'bold',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  descItem: {
    color: colorConfig.pageIndex.grayColor,
  },
  itemDetail: {
    marginLeft: 10,
  },
  itemDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineSubtotal: {
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 2,
    top: -2,
  },
  btnMethod: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    width: Dimensions.get('window').width / 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descMethod: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 10,
  },
});

mapStateToProps = state => ({
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentDetail);

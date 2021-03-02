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
  BackHandler,
  Platform,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';

class HistoryDetailPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
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
    console.log(date);
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear() +
      ' • ' +
      this.pad(tanggal.getHours()) +
      ':' +
      this.pad(tanggal.getMinutes())
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

  calculateCash = item => {
    try {
      if (item.discount != undefined) {
        return item.price - item.discount;
      } else {
        return item.price;
      }
    } catch (e) {
      return item.price;
    }
  };

  format = item => {
    try {
      const curr = appConfig.appMataUang;
      // item = item.replace(curr, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  formatCurrency = value => {
    try {
      return this.format(CurrencyFormatter(value));
    } catch (e) {
      return value;
    }
  };

  getPaymentType = item => {
    try {
      if (!isEmptyObject(item.details)) {
        let cardNo = item.paymentName;
        if (item.paymentName != undefined && item.paymentName.length > 4) {
          cardNo = item.paymentName.substr(item.paymentName.length - 4);
        }
        return item.details.cardIssuer.toUpperCase() + ' ' + cardNo;
      } else {
        return item.paymentName;
      }
    } catch (e) {
      return '-';
    }
  };

  pad = item => {
    let time = item.toString();
    if (time.length == 1) return `0${item}`;
    else return item;
  };

  getSubtotal = item => {
    try {
      if (item.totalNettAmount != undefined) {
        return this.formatCurrency(item.totalNettAmount);
      } else {
        return this.formatCurrency(item.beforePrice);
      }
    } catch (e) {
      return this.formatCurrency(0);
    }
  };

  getGrandTotal = item => {
    try {
      if (item.payments != undefined && !isEmptyArray(item.payments)) {
        let total = 0;
        if (item.price !== undefined) total = item.price;
        if (item.totalNettAmount !== undefined) total = item.totalNettAmount;

        for (let i = 0; i < item.payments.length; i++) {
          if (
            item.payments[i].isVoucher == true ||
            item.payments[i].isVoucherPromoCode == true ||
            item.payments[i].isPoint == true
          ) {
            total -= item.payments[i].paymentAmount;
          }
        }
        if (total < 0) total = 0;
        return this.formatCurrency(total);
      } else {
        return this.formatCurrency(item.afterPrice);
      }
    } catch (e) {}
  };

  renderPaymentType = item => {
    try {
      if (item.isVoucher === true || item.isVoucherPromoCode === true) {
        return item.paymentName;
      } else if (item.isPoint == true) {
        return `${item.paymentName} ${item.redeemValue}`;
      } else if (item.isAppPayment) {
        return item.paymentName;
      } else {
        return item.paymentType;
      }
    } catch (e) {
      return null;
    }
  };

  format2 = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(`${curr} `, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  renderItemModifier = item => {
    return (
      <FlatList
        style={{marginLeft: 7}}
        data={item.modifiers}
        renderItem={({item}) => {
          if (item.modifier.max != 1 && item.modifier.isYesNo != true) {
            if (!isEmptyArray(item.modifier.details)) {
              return (
                <>
                  <Text style={[styles.descModifier]}>
                    <Text style={{fontStyle: 'normal'}}>{'\u25CF'}</Text>{' '}
                    {item.modifierName}:{' '}
                  </Text>
                  {item.modifier.details.map((mod, idx) => (
                    <View style={{marginLeft: 9}}>
                      <Text
                        key={idx}
                        style={[styles.descModifier, {fontSize: 12.5}]}>
                        <Text style={{fontStyle: 'normal'}}>{'\u25CF'}</Text>{' '}
                        <Text
                          style={{
                            color: colorConfig.store.defaultColor,
                          }}>
                          {mod.quantity}x
                        </Text>{' '}
                        {mod.name}{' '}
                        {mod.price > 0
                          ? `  +${this.format2(CurrencyFormatter(mod.price))}`
                          : null}{' '}
                      </Text>
                    </View>
                  ))}
                </>
              );
            }
          } else {
            return item.modifier.details.map((mod, idx) => (
              <Text key={idx} style={[styles.descModifier]}>
                <Text style={{fontStyle: 'normal'}}>{'\u25CF'}</Text>{' '}
                {item.modifier.max == 1 && item.modifier.isYesNo != true
                  ? `${item.modifierName}: ${mod.name} ${
                      mod.price > 0
                        ? `  +${this.format2(CurrencyFormatter(mod.price))}`
                        : ''
                    }`
                  : null}
                {item.modifier.isYesNo == true
                  ? `${mod.name} ${
                      mod.price > 0
                        ? `  +${this.format2(CurrencyFormatter(mod.price))}`
                        : ''
                    }`
                  : null}
              </Text>
            ));
          }
        }}
      />
    );
  };

  render() {
    const {intlData, item} = this.props;
    let dataOrder = item.dataPay;
    if (!isEmptyArray(item.details)) dataOrder = item.details;
    console.log(item, 'xxxx');
    let subtotal = item.totalGrossAmount - item.totalDiscountAmount;
    if (isNaN(subtotal)) {
      subtotal = item.price;
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView style={{height: '100%', width: '100%'}}>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.outlet.name}</Text>
            </View>
            <View style={styles.detail}>
              <View style={[styles.detailItem]}>
                <Text style={styles.desc}>Status</Text>
                <Text style={styles.desc}>{item.status}</Text>
              </View>

              <View style={[styles.detailItem]}>
                <Text style={styles.desc}>{intlData.messages.dateAndTime}</Text>
                <Text style={styles.desc}>{this.getDate(item.createdAt)}</Text>
              </View>

              {this.props.item.orderingMode != undefined ? (
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>Order Mode</Text>
                  <Text style={styles.desc}>{item.orderingMode}</Text>
                </View>
              ) : null}

              {this.props.item.queueNo != undefined ? (
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>Queue No</Text>
                  <Text style={styles.desc}>{item.queueNo}</Text>
                </View>
              ) : null}

              {item.transactionRefNo != undefined && (
                <View style={[styles.detailItem]}>
                  <Text style={styles.desc}>Ref No</Text>
                  <Text style={styles.desc}>{item.transactionRefNo}</Text>
                </View>
              )}

              {item.totalDiscountAmount > 0 && (
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>Subtotal b/f Disc</Text>
                  <Text style={styles.desc}> {this.formatCurrency(item.totalGrossAmount)}</Text>
                </View>
                )
              }

              {item.totalDiscountAmount > 0 && (
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {color: colorConfig.store.colorError}]}>Discount</Text>
                  <Text style={[styles.desc, {color: colorConfig.store.colorError}]}> - {this.formatCurrency(item.totalDiscountAmount)}</Text>
                </View>
                )
              }

              <View style={styles.detailItem}>
                <Text style={styles.desc}>Subtotal</Text>
                <Text style={styles.desc}>{this.formatCurrency(subtotal)}</Text>
              </View>

              {item.totalSurchargeAmount > 0 && (
                <View style={styles.detailItem}>
                  <Text style={[styles.desc]}>Surcharge</Text>
                  <Text style={[styles.desc]}>{this.formatCurrency(item.totalSurchargeAmount)}</Text>
                </View>
                )
              }

              {item.deliveryFee > 0 && item.provider !== undefined ?
                item.provider.taxRuleID === 'EXC-TAX' &&
                  <View style={styles.detailItem}>
                    <Text style={[styles.desc]}>Delivery Fee</Text>
                    <Text style={[styles.desc]}>{this.formatCurrency(item.deliveryFee)}</Text>
                  </View>
                :
                null
              }

              {item.exclusiveTax > 0 && (
                <View style={styles.detailItem}>
                  <Text style={[styles.desc]}>Tax {item.outlet.taxPercentage}%</Text>
                  <Text style={[styles.desc]}>{this.formatCurrency(item.exclusiveTax)}</Text>
                </View>
                )
              }

              {item.deliveryFee > 0 && item.provider !== undefined ?
                item.provider.taxRuleID !== 'EXC-TAX' &&
                <View style={styles.detailItem}>
                  <Text style={[styles.desc]}>Delivery Fee</Text>
                  <Text style={[styles.desc]}>{this.formatCurrency(item.deliveryFee)}</Text>
                </View>
                :
                null
              }

              <View style={[styles.detailItem, {borderBottomWidth: 0}]}>
                <Text
                  style={[
                    styles.desc,
                    {
                      color: colorConfig.store.titleSelected,
                      // fontWeight: 'bold',
                      fontFamily: 'Poppins-Medium',
                    },
                  ]}>
                  GRAND TOTAL
                </Text>
                <Text
                  style={[
                    styles.desc,
                    {
                      color: colorConfig.store.titleSelected,
                      // fontWeight: 'bold',
                      fontFamily: 'Poppins-Medium',
                    },
                  ]}>
                  {this.formatCurrency(item.totalNettAmount || item.price)}
                </Text>
              </View>

              {item.inclusiveTax > 0 && (
                <View style={[styles.detailItem, {marginTop: -17}]}>
                  <Text style={[styles.desc, {color: colorConfig.pageIndex.inactiveTintColor, fontSize: 10}]}>Inclusive Tax {item.outlet.taxPercentage}%</Text>
                  <Text style={[styles.desc, {color: colorConfig.pageIndex.inactiveTintColor, fontSize: 10}]}>{this.formatCurrency(item.inclusiveTax)}</Text>
                </View>
                )
              }

              <View style={[styles.detailItem, {borderBottomWidth: 0, marginTop: 20}]}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                  Payment Method :
                </Text>
              </View>

              {item.payments != undefined && !isEmptyArray(item.payments)
                ? item.payments.map(data => (
                  <View style={[styles.detailItem, {marginBottom: 8}]}>
                    <Text style={styles.desc}>
                      • {this.renderPaymentType(data)}
                    </Text>
                    <Text style={styles.desc}>
                      {this.formatCurrency(data.paymentAmount)}
                    </Text>
                  </View>
                ))
                : null}

              {this.props.item.point > 0 ? (
                <View
                  style={[
                    styles.detailItem,
                    {marginTop: 15, borderBottomWidth: 0},
                  ]}>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {intlData.messages.youGotPoints}
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {' '}
                    {'x '}
                    {this.props.item.point}
                  </Text>
                </View>
              ) : null}
              {this.props.item.point < 0 ? (
                <View
                  style={[
                    styles.detailItem,
                    {marginTop: 15, borderBottomWidth: 0},
                  ]}>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.colorError,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    Points Deducted
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.colorError,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {' '}
                    {this.props.item.point}
                  </Text>
                </View>
              ) : null}
              {this.props.item.sumGiftStamps &&
              this.props.item.sumGiftStamps > 0 ? (
                <View style={[styles.detailItem, {borderBottomWidth: 0}]}>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {intlData.messages.youGotStamps}
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {' '}
                    {'x '}
                    {this.props.item.sumGiftStamps}
                  </Text>
                </View>
              ) : null}
              {this.props.item.sumGiftStamps &&
              this.props.item.sumGiftStamps < 0 ? (
                <View style={[styles.detailItem, {borderBottomWidth: 0}]}>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.colorError,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    Stamps Deducted
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.colorError,
                        // fontWeight: 'bold',
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                      },
                    ]}>
                    {' '}
                    {this.props.item.sumGiftStamps}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {!isEmptyArray(dataOrder) ? (
            <View style={[styles.card, {marginBottom: 40}]}>
              <View style={styles.item}>
                <Text style={styles.title}>
                  {intlData.messages.detailOrder}
                </Text>
              </View>
              <View style={styles.detail}>
                <FlatList
                  data={dataOrder}
                  renderItem={({item}) => (
                    <View style={styles.itemOrder}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 1,
                        }}>
                        <View style={{width: '75%'}}>
                          {this.props.item.dataPay !== undefined &&
                          this.props.item.dataPay.paidMembershipPlan ? (
                            <Text>
                              {item.name} {item.period} {item.periodUnit}
                            </Text>
                          ) : (
                            <View>
                              <Text style={[styles.descItem]}>
                                <Text
                                  style={{
                                    color: colorConfig.store.defaultColor,
                                  }}>
                                  {item.quantity !== undefined
                                    ? item.quantity
                                    : item.qty || 1}
                                  {' x'}
                                </Text>{' '}
                                {item.product !== undefined
                                  ? item.product.name
                                  : item.itemName || item.name}
                                {item.product != undefined &&
                                  item.product.retailPrice > 0 && (
                                    <Text
                                      style={{
                                        color: colorConfig.pageIndex.grayColor,
                                        fontSize: 12,
                                      }}>
                                      {'  +'}
                                      {this.format2(
                                        CurrencyFormatter(
                                          item.product.retailPrice,
                                        ),
                                      )}{' '}
                                    </Text>
                                  )}
                              </Text>
                              {item.remark != undefined && item.remark != '' ? (
                                <Text
                                  style={{
                                    color:
                                      colorConfig.pageIndex.inactiveTintColor,
                                    fontSize: 12,
                                    fontStyle: 'italic',
                                  }}>
                                  note: {item.remark}
                                </Text>
                              ) : null}
                              {/* loop item modifier */}
                              {this.renderItemModifier(item)}
                              {/* loop item modifier */}
                            </View>
                          )}
                        </View>
                        <View>
                          {item.nettAmount !== undefined ? (
                            <Text style={styles.descPrice}>
                              {this.format(CurrencyFormatter(item.nettAmount))}
                            </Text>
                          ) : (
                            <Text style={styles.descPrice}>
                              {this.format(
                                CurrencyFormatter(
                                  item.price || item.totalNettAmount,
                                ),
                              )}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(product, index) => index.toString()}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HistoryDetailPayment);

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
    fontFamily: 'Poppins-Medium',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 5,
    borderColor: colorConfig.pageIndex.inactiveTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  item: {
    alignItems: 'center',
    // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    // borderBottomWidth: 1,
    margin: 10,
    paddingVertical: 15,
  },
  itemOrder: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    margin: 5,
    padding: 7,
    width: '100%',
    maxWidth: '100%',
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    paddingVertical: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  descItem: {
    color: colorConfig.store.title,
    maxWidth: Dimensions.get('window').width,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  descModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    fontSize: 12.5,
    // fontStyle: 'italic',
    marginLeft: 10,
    fontFamily: 'Poppins-Italic',
    marginVertical: 2,
  },
  descPrice: {
    color: colorConfig.store.title,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  descPriceModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
});

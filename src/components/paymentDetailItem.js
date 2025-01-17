/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Platform,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {isEmptyArray} from '../helper/CheckEmpty';

export default class PaymentDetailItem extends Component {
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

  format = item => {
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

  getPaymentName = item => {
    try {
      if (item.isVoucher) {
        return item.name;
      } else if (item.isPoint) {
        return 'Points ' + item.redeemValue;
      } else {
        return item.paymentType;
      }
    } catch (e) {
      return null;
    }
  };

  render() {
    const {intlData, dataVoucer, pembayaran} = this.props;
    let taxAmount = 0;
    let taxAmountText = 'Tax';
    try {
      if (pembayaran.cartDetails && pembayaran.cartDetails.totalTaxAmount) {
        taxAmount = pembayaran.cartDetails.totalTaxAmount;
      }

      if (pembayaran.cartDetails && pembayaran.cartDetails.inclusiveTax > 0) {
        taxAmount = pembayaran.cartDetails.inclusiveTax;
        taxAmountText = 'Inclusive Tax';
      }
    } catch (e) {}

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.backgroundColor,
            paddingVertical: 3,
            marginBottom: 20,
            shadowColor: '#00000021',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 12,
          }}>
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
        </View>
        <ScrollView>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>Order Summary</Text>
            </View>
            <View style={styles.detail}>
              {/*<View style={styles.detailItem}>*/}
              {/*  <Text*/}
              {/*    style={[*/}
              {/*      styles.desc,*/}
              {/*      {color: colorConfig.pageIndex.grayColor},*/}
              {/*    ]}>*/}
              {/*    Outlet Name :{' '}*/}
              {/*  </Text>*/}
              {/*  <Text*/}
              {/*    style={[*/}
              {/*      styles.desc,*/}
              {/*      {marginLeft: 10, color: colorConfig.pageIndex.grayColor},*/}
              {/*    ]}>*/}
              {/*    {this.props.pembayaran.storeName}*/}
              {/*  </Text>*/}
              {/*</View>*/}
              <View
                style={{
                  paddingBottom: 5,
                  marginBottom: 10,
                }}>
                <Text
                  style={[
                    styles.desc,
                    {
                      marginBottom: 10,
                      color: colorConfig.pageIndex.grayColor,
                    },
                  ]}>
                  {intlData.messages.detailItem} :
                </Text>
                <View style={styles.itemDetail}>
                  {this.props.pembayaran.details.map((item, key) => (
                    <View key={key}>
                      {
                        <View
                          style={{
                            borderBottomColor: colorConfig.pageIndex.grayColor,
                            borderBottomWidth: 1,
                            borderStyle: 'dotted',
                            paddingVertical: 6,
                          }}>
                          <Text style={styles.descItem}>
                            {item.product.name}
                          </Text>
                          <View style={styles.itemDesc}>
                            <Text style={styles.descItemPrice}>
                              {this.format(
                                CurrencyFormatter(item.product.retailPrice),
                              )}
                            </Text>
                            <Text style={styles.descItemPrice}>
                              {item.quantity}
                            </Text>
                            <Text
                              style={[
                                styles.descItemPrice,
                                {color: colorConfig.store.title},
                              ]}>
                              {this.format(CurrencyFormatter(item.unitPrice))}
                            </Text>
                          </View>
                          <View style={styles.itemDescModifier}>
                            {!isEmptyArray(item.modifiers) ? (
                              <Text style={styles.itemModifier}>Add On :</Text>
                            ) : null}
                            {!isEmptyArray(item.modifiers)
                              ? item.modifiers.map(data =>
                                  data.modifier.details.map(detail => (
                                    <Text
                                      style={[
                                        styles.itemModifier,
                                        {marginLeft: 10},
                                      ]}>
                                      • <Text>{detail.quantity}x</Text>{' '}
                                      {detail.name} ({' '}
                                      {this.format(
                                        CurrencyFormatter(detail.productPrice),
                                      )}{' '}
                                      )
                                    </Text>
                                  )),
                                )
                              : null}
                          </View>
                        </View>
                      }
                    </View>
                  ))}
                  {/*<View style={[styles.lineSubtotal, {marginTop: 30}]} />*/}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      paddingVertical: 5,
                    }}>
                    <Text style={styles.desc}>Subtotal</Text>
                    <Text style={styles.desc}>
                      {appConfig.appMataUang}
                      {this.format(
                        CurrencyFormatter(
                          this.props.pembayaran.totalGrossAmount,
                        ),
                      )}
                    </Text>
                  </View>

                  {this.props.pembayaran.totalDiscountAmount > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 5,
                      }}>
                      <Text
                        style={[
                          styles.desc,
                          {color: colorConfig.store.colorError},
                        ]}>
                        Discount
                      </Text>
                      <Text
                        style={[
                          styles.desc,
                          {color: colorConfig.store.colorError},
                        ]}>
                        - {appConfig.appMataUang}
                        {this.format(
                          CurrencyFormatter(
                            this.props.pembayaran.totalDiscountAmount,
                          ),
                        )}
                      </Text>
                    </View>
                  )}

                  {this.props.pembayaran.totalSurchargeAmount > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 5,
                      }}>
                      <Text style={styles.desc}>Surcharge</Text>
                      <Text style={styles.desc}>
                        {appConfig.appMataUang}
                        {this.format(
                          CurrencyFormatter(
                            this.props.pembayaran.totalSurchargeAmount,
                          ),
                        )}
                      </Text>
                    </View>
                  )}

                  {pembayaran.cartDetails && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 5,
                      }}>
                      <Text style={styles.desc}>{taxAmountText}</Text>
                      <Text style={styles.desc}>
                        {appConfig.appMataUang}
                        {this.format(CurrencyFormatter(taxAmount))}
                      </Text>
                    </View>
                  )}

                  {pembayaran.cartDetails &&
                    pembayaran.cartDetails.provider &&
                    pembayaran.cartDetails.provider.deliveryFee > 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 5,
                        }}>
                        <Text style={styles.desc}>Delivery Fee</Text>
                        <Text style={styles.desc}>
                          {appConfig.appMataUang}
                          {this.format(
                            CurrencyFormatter(
                              pembayaran.cartDetails.provider.deliveryFee,
                            ),
                          )}
                        </Text>
                      </View>
                    )}

                  {!isEmptyArray(dataVoucer)
                    ? dataVoucer.map(item => (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              paddingVertical: 5,
                            }}>
                            <Text
                              style={[
                                styles.desc,
                                {color: colorConfig.store.colorSuccess},
                              ]}>
                              {this.getPaymentName(item)}
                              {'    '}
                              {appConfig.appMataUang}
                              {this.format(
                                CurrencyFormatter(item.paymentAmount),
                              )}
                            </Text>
                          </View>
                        </View>
                      ))
                    : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text style={[styles.desc, {fontFamily: 'Poppins-Bold'}]}>
                      Total
                    </Text>
                    <Text style={[styles.desc, {fontFamily: 'Poppins-Bold'}]}>
                      {appConfig.appMataUang}
                      {this.format(CurrencyFormatter(this.props.totalBayar))}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    marginBottom: 5,
  },
  desc: {
    color: colorConfig.store.title,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  descItem: {
    fontSize: 14,
    color: colorConfig.store.title,
    fontFamily: 'Poppins-Medium',
  },
  descItemPrice: {
    fontSize: 12,
    color: colorConfig.pageIndex.grayColor,
    fontFamily: 'Poppins-Regular',
  },
  itemDetail: {
    marginLeft: 10,
  },
  itemDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDescModifier: {
    flexDirection: 'column',
  },
  lineSubtotal: {
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    top: -2,
  },
  btnMethod: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
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
  itemModifier: {
    fontSize: 12,
    color: colorConfig.pageIndex.grayColor,
  },
});

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
  SafeAreaView
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
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    const {intlData} = this.props;
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
        <ScrollView>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>
                {intlData.messages.paymentDetail}
              </Text>
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
                    {marginBottom: 10, color: colorConfig.pageIndex.grayColor},
                  ]}>
                  {intlData.messages.detailItem} :
                </Text>
                <View style={styles.itemDetail}>
                  {this.props.pembayaran.dataPay.map((item, key) => (
                    <View key={key}>
                      {
                        <View
                          style={{
                            borderBottomColor: colorConfig.pageIndex.grayColor,
                            borderBottomWidth: 1,
                            borderStyle: 'dotted',
                            paddingVertical: 6,
                          }}>
                          <Text style={styles.descItem}>{item.itemName}</Text>
                          <View style={styles.itemDesc}>
                            <Text style={styles.descItemPrice}>
                              {CurrencyFormatter(item.price)}
                            </Text>
                            <Text style={styles.descItemPrice}>{item.qty}</Text>
                            <Text
                              style={[
                                styles.descItemPrice,
                                {color: colorConfig.store.title},
                              ]}>
                              {CurrencyFormatter(item.qty * item.price)}
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
                                      {CurrencyFormatter(detail.productPrice)} )
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
                    <Text style={styles.desc}>Sub Total</Text>
                    <Text style={styles.desc}>
                      {CurrencyFormatter(this.props.pembayaran.payment)}
                    </Text>
                  </View>

                  {this.props.voucher != undefined ? (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 5,
                        }}>
                        <Text
                          style={[
                            styles.desc,
                            {color: colorConfig.store.colorSuccess},
                          ]}>
                          {intlData.messages.voucherApplied}
                        </Text>
                        <Text
                          style={[
                            styles.desc,
                            {color: colorConfig.store.colorSuccess},
                          ]}>
                          {this.props.voucher.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 5,
                        }}>
                        <Text
                          style={[
                            styles.desc,
                            {color: colorConfig.store.colorSuccess},
                          ]}>
                          {intlData.messages.discount}
                        </Text>
                        <Text
                          style={[
                            styles.desc,
                            {color: colorConfig.store.colorSuccess},
                          ]}>
                          {CurrencyFormatter(
                            this.props.pembayaran.payment -
                              this.props.totalBayar,
                          )}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {this.props.point != undefined ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 5,
                      }}>
                      <Text
                        style={[
                          styles.desc,
                          {color: colorConfig.store.colorSuccess},
                        ]}>
                        {intlData.messages.pointApplied}
                      </Text>
                      <Text
                        style={[
                          styles.desc,
                          {color: colorConfig.store.colorSuccess},
                        ]}>
                        {this.props.point}
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                    }}>
                    <Text style={styles.desc}>Total</Text>
                    <Text style={styles.desc}>
                      {CurrencyFormatter(this.props.totalBayar)}
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
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
  },
  descItemPrice: {
    fontSize: 12,
    color: colorConfig.pageIndex.grayColor,
    fontFamily: 'Lato-Medium',
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

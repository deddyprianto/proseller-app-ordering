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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {compose} from 'redux';
import {connect} from 'react-redux';

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
      tanggal.getHours() +
      ':' +
      tanggal.getMinutes()
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

  render() {
    const {intlData} = this.props;
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
            <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView style={{height: '100%', width: '100%'}}>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>{this.props.item.outletName}</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>{intlData.messages.outletName}</Text>
                <Text style={styles.desc}>{this.props.item.outletName}</Text>
              </View>

              <View style={[styles.detailItem]}>
                <Text style={styles.desc}>{intlData.messages.dateAndTime}</Text>
                <Text style={styles.desc}>
                  {this.getDate(this.props.item.createdAt)}
                </Text>
              </View>

              {/*<View style={styles.detailItem}>*/}
              {/*  <Text style={styles.desc}>Sub Total</Text>*/}
              {/*  <Text style={styles.desc}>*/}
              {/*    {CurrencyFormatter(this.props.item.price)}*/}
              {/*  </Text>*/}
              {/*</View>*/}

              {/*{this.props.item.statusAdd == 'addVoucer' ? (*/}
              {/*  <View style={styles.detailItem}>*/}
              {/*    <Text style={styles.desc}>Discount</Text>*/}
              {/*    <Text style={styles.desc}>*/}
              {/*      {CurrencyFormatter(this.props.item.discount)}*/}
              {/*    </Text>*/}
              {/*  </View>*/}
              {/*) : null}*/}

              <View style={styles.detailItem}>
                <Text style={styles.desc}>Total</Text>
                <Text style={styles.desc}>
                  {CurrencyFormatter(this.props.item.price)}
                </Text>
              </View>

              <View style={[styles.detailItem, {borderBottomWidth: 0}]}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                  {intlData.messages.paymentType}
                </Text>
              </View>

              <View style={[styles.detailItem, {marginLeft: 10}]}>
                <Text style={styles.desc}> • Cash</Text>
                <Text style={styles.desc}>
                  {/*{CurrencyFormatter(this.calculateCash(this.props.item))}*/}
                  {CurrencyFormatter(this.props.item.price)}
                </Text>
              </View>

              {this.props.item.statusAdd == 'addPoint' ? (
                <View style={[styles.detailItem, {marginLeft: 10}]}>
                  <Text style={styles.desc}> • Point</Text>
                  <Text style={styles.desc}>{this.props.item.discount}</Text>
                </View>
              ) : null}

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
                        fontWeight: 'bold',
                        fontSize: 15,
                      },
                    ]}>
                    {intlData.messages.youGotPoints}
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        fontWeight: 'bold',
                        fontSize: 15,
                      },
                    ]}>
                    {' '}
                    {'x '}
                    {this.props.item.point}
                  </Text>
                </View>
              ) : null}
              {this.props.item.stamps.amount > 1 ? (
                <View style={[styles.detailItem, {borderBottomWidth: 0}]}>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        fontWeight: 'bold',
                        fontSize: 15,
                      },
                    ]}>
                    {intlData.messages.youGotStamps}
                  </Text>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: colorConfig.store.defaultColor,
                        fontWeight: 'bold',
                        fontSize: 15,
                      },
                    ]}>
                    {' '}
                    {'x '}
                    {this.props.item.point}
                  </Text>
                </View>
              ) : null}

              {/*<View*/}
              {/*  style={{*/}
              {/*    marginTop: 10,*/}
              {/*    alignItems: 'center',*/}
              {/*    flexDirection: 'row',*/}
              {/*    justifyContent: 'space-between',*/}
              {/*  }}>*/}
              {/*  <View style={{alignItems: 'center'}}>*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        color: colorConfig.pageIndex.activeTintColor,*/}
              {/*        fontSize: 14,*/}
              {/*        fontFamily: 'Lato-Medium',*/}
              {/*      }}>*/}
              {/*      You got points*/}
              {/*    </Text>*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        color: colorConfig.pageIndex.activeTintColor,*/}
              {/*        fontSize: 30,*/}
              {/*      }}>*/}
              {/*      {this.props.item.point}*/}
              {/*    </Text>*/}
              {/*  </View>*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      borderColor: colorConfig.store.defaultColor,*/}
              {/*      borderWidth: 1,*/}
              {/*      height: 50,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*  <View style={{alignItems: 'center'}}>*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        color: colorConfig.pageIndex.activeTintColor,*/}
              {/*        fontSize: 14,*/}
              {/*        fontFamily: 'Lato-Medium',*/}
              {/*      }}>*/}
              {/*      You got stamps*/}
              {/*    </Text>*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        color: colorConfig.pageIndex.activeTintColor,*/}
              {/*        fontSize: 30,*/}
              {/*      }}>*/}
              {/*      {this.props.item.point}*/}
              {/*    </Text>*/}
              {/*  </View>*/}
              {/*</View>*/}
            </View>
          </View>
          {this.props.item.dataPay != undefined &&
          this.props.item.dataPay != null ? (
            <View style={[styles.card, {marginBottom: 40}]}>
              <View style={styles.item}>
                <Text style={styles.title}>
                  {intlData.messages.detailOrder}
                </Text>
              </View>
              <View style={styles.detail}>
                {this.props.item.dataPay.map(item => (
                  <View style={styles.detailItem}>
                    <Text style={[styles.desc, {width: '70%'}]}>
                      <Text
                        style={[
                          styles.desc,
                          {color: colorConfig.store.defaultColor},
                        ]}>
                        {item.qty} x{' '}
                      </Text>
                      {item.itemName}
                    </Text>
                    <Text style={styles.desc}>
                      {CurrencyFormatter(item.price)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
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
    fontFamily: 'Lato-Bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 10,
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
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
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
    fontFamily: 'Lato-Medium',
  },
});

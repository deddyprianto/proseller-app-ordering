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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

export default class HistoryDetailPayment extends Component {
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

  render() {
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
        <ScrollView style={{height: '100%', width: '100%'}}>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>Payment Detail</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Store Name</Text>
                <Text style={styles.desc}>{this.props.item.outletName}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.desc}>Amount</Text>
                <Text style={styles.desc}>
                  {appConfig.appMataUang + ' ' + this.props.item.price}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.desc}>Payment Type</Text>
                <Text style={styles.desc}>{this.props.item.paymentType}</Text>
              </View>

              <View style={[styles.detailItem, {marginBottom: 20}]}>
                <Text style={styles.desc}>Date & Time</Text>
                <Text style={styles.desc}>
                  {this.getDate(this.props.item.createdAt)}
                </Text>
              </View>
              {this.props.item.point > 0 ? (
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
                    You got points
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
                    You got stamps
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
                <Text style={styles.title}>Detail Order</Text>
              </View>
              <View style={styles.detail}>
                {this.props.item.dataPay.map(item => (
                  <View style={styles.detailItem}>
                    <Text style={[styles.desc, {width: 120}]}>
                      {item.itemName}
                    </Text>
                    <Text style={styles.desc}>{item.qty}</Text>
                    <Text style={styles.desc}>
                      {appConfig.appMataUang + ' ' + item.price}
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
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
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

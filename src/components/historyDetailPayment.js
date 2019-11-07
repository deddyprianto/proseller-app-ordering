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

  goBack() {
    Actions.pop();
  }

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
        {console.log(this.props.item)}
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
        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.title}>Payment Detail</Text>
          </View>
          <View style={styles.detail}>
            <View style={styles.detailItem}>
              <Text style={styles.desc}>Store Name</Text>
              <Text style={styles.desc}>{this.props.item.storeName}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.desc}>Payment</Text>
              <Text style={styles.desc}>
                {appConfig.appMataUang + ' ' + this.props.item.price}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.desc}>Payment Type</Text>
              <Text style={styles.desc}>{this.props.item.paymentType}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.desc}>Created</Text>
              <Text style={styles.desc}>
                {this.getDate(this.props.item.createdAt)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.desc}>Expiry</Text>
              <Text style={styles.desc}>
                {this.getDate(this.props.item.expiry)}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 14,
                  fontFamily: 'Lato-Medium',
                }}>
                You got point
              </Text>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 30,
                }}>
                {this.props.item.pointDebit}
              </Text>
            </View>
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
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
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

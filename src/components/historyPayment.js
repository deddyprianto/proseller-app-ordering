import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import logoCash from '../assets/img/cash.png';
import logoVisa from '../assets/img/visa.png';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';

class HistoryPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  historyDetailPayment = item => {
    Actions.historyDetailPayment({item});
  };

  getDataHistory = async () => {
    try {
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Get Data History Error!',
          error.responseBody.message,
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataHistory();
    this.setState({refreshing: false});
  };

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {console.log(this.props)}
        {this.props.pointTransaction == undefined ? (
          <View style={styles.component}>
            <Text style={styles.empty}>History payment is empty</Text>
          </View>
        ) : this.props.pointTransaction.length == 0 ? (
          <View style={styles.component}>
            <Text style={styles.empty}>History payment is empty</Text>
          </View>
        ) : (
          <View style={styles.component}>
            {_.orderBy(this.props.pointTransaction, ['created'], ['desc']).map(
              (item, key) => (
                <View key={key}>
                  {
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => this.historyDetailPayment(item)}>
                      <View style={styles.sejajarSpace}>
                        <View style={styles.detail}>
                          <View style={styles.sejajarSpace}>
                            <Text style={styles.storeName}>
                              {item.storeName}
                            </Text>
                            <Text style={styles.itemType}>
                              {item.pointDebit + ' point'}
                            </Text>
                          </View>
                          <View style={styles.sejajarSpace}>
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                resizeMode="stretch"
                                style={styles.paymentTypeLogo}
                                source={
                                  item.paymentType == 'Cash'
                                    ? logoCash
                                    : logoVisa
                                }
                              />
                              <Text style={styles.paymentType}>
                                {item.paymentType}
                              </Text>
                            </View>
                            <Text style={styles.paymentTgl}>
                              {this.getDate(item.createdAt)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.btnDetail}>
                          <Icon
                            size={20}
                            name={
                              Platform.OS === 'ios'
                                ? 'ios-arrow-dropright-circle'
                                : 'md-arrow-dropright-circle'
                            }
                            style={{
                              color: colorConfig.pageIndex.activeTintColor,
                            }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              ),
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  sejajarSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: Dimensions.get('window').width - 60,
  },
  storeName: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontFamily: 'Lato-Medium',
  },
  paymentTypeLogo: {
    width: 20,
    height: 15,
    marginTop: 2,
  },
  paymentType: {
    paddingLeft: 8,
    color: colorConfig.pageIndex.activeTintColor,
    fontFamily: 'Lato-Medium',
  },
  itemType: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 12,
    fontFamily: 'Lato-Medium',
  },
  btnDetail: {
    alignItems: 'center',
    borderLeftColor: colorConfig.pageIndex.activeTintColor,
    borderLeftWidth: 1,
    width: 40,
    paddingTop: 15,
  },
});

mapStateToProps = state => ({
  pointTransaction: state.rewardsReducer.dataPoint.pointTransaction,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HistoryPayment);

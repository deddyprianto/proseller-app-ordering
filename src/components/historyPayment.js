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
import {dataTransaction} from '../actions/sales.action';
import {notifikasi} from '../actions/auth.actions';

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
      await this.props.dispatch(dataTransaction);
      if (this.props.isSuccessGetTrx) {
        this.setState({refreshing: false});
      } else {
        await this.props.dispatch(
          notifikasi(
            "We're Sorry...",
            "We can't get history transaction, please try again",
            console.log('Cancel Pressed'),
          ),
        );
        this.setState({refreshing: false});
      }
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          "We're Sorry...",
          "We can't get history transaction, please try again",
          console.log('Cancel Pressed'),
        ),
      );
      console.log(error);
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataHistory();
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
                              {item.point + ' point'}
                            </Text>
                          </View>
                          <View style={styles.sejajarSpace}>
                            <View style={{flexDirection: 'row'}}>
                              {/*<Image*/}
                              {/*  resizeMode="stretch"*/}
                              {/*  style={styles.paymentTypeLogo}*/}
                              {/*  source={*/}
                              {/*    item.paymentType == 'Cash'*/}
                              {/*      ? logoCash*/}
                              {/*      : logoVisa*/}
                              {/*  }*/}
                              {/*/>*/}
                              <Icon
                                size={18}
                                name={
                                  item.paymentType == 'Cash'
                                    ? Platform.OS === 'ios'
                                      ? 'ios-cash'
                                      : 'md-cash'
                                    : Platform.OS === 'ios'
                                    ? 'ios-card'
                                    : 'md-card'
                                }
                                style={styles.paymentTypeLogo}
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
    padding: 5,
    marginBottom: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
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
    color: colorConfig.store.defaultColor,
  },
  paymentType: {
    paddingLeft: 10,
    color: colorConfig.store.title,
    fontWeight: 'bold',
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
  isSuccessGetTrx: state.rewardsReducer.dataPoint.isSuccessGetTrx,
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

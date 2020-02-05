import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';

import {logoutUser} from '../actions/auth.actions';
import AccountUserDetail from '../components/accountUserDetail';
import AccountMenuList from '../components/accountMenuList';

import {campaign, dataPoint, vouchers} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';
import colorConfig from '../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    await this.getDataRewards();
  };

  getDataRewards = async () => {
    try {
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(vouchers());
      await this.props.dispatch(myVoucers());
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Get Data Rewards Error!',
          error.responseBody.message,
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  };

  logout = async () => {
    await this.props.dispatch(logoutUser());
  };

  myVouchers = () => {
    var myVoucers = [];
    if (this.props.myVoucers != undefined) {
      _.forEach(
        _.groupBy(
          this.props.myVoucers.filter(voucher => voucher.deleted == false),
          'id',
        ),
        function(value, key) {
          value[0].totalRedeem = value.length;
          myVoucers.push(value[0]);
        },
      );
    }
    Actions.accountVouchers({data: myVoucers});
  };

  render() {
    console.log('USER DETAIL ', this.props.userDetail);
    return (
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.card}>
            <AccountUserDetail screen={this.props} />
          </View>
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                backgroundColor: colorConfig.pageIndex.backgroundColor,
                height: 50,
                marginTop: 10,
                borderBottomColor: colorConfig.pageIndex.activeTintColor,
                borderBottomWidth: 1,
                borderTopColor: colorConfig.pageIndex.activeTintColor,
                borderTopWidth: 1,
                alignItems: 'center',
                marginBottom: 10,
              }}>
              {this.props.totalPoint == undefined ||
              this.props.totalPoint == 0 ? null : (
                <View style={styles.point}>
                  {/*<Image*/}
                  {/*  style={{height: 18, width: 25, marginRight: 5}}*/}
                  {/*  source={require('../assets/img/ticket.png')}*/}
                  {/*/>*/}
                  <Icon
                    size={23}
                    name={
                      Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'
                    }
                    style={{
                      color: colorConfig.store.defaultColor,
                      marginRight: 8,
                    }}
                  />
                  <Text
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      fontSize: 14,
                      fontFamily: 'Lato-Medium',
                    }}>
                    {'Point : '}
                  </Text>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      fontSize: 14,
                      fontFamily: 'Lato-Bold',
                    }}>
                    {this.props.totalPoint == undefined
                      ? 0
                      : this.props.totalPoint}
                  </Text>
                </View>
              )}
              {this.props.totalPoint == undefined ||
              this.props.totalPoint == 0 ? null : (
                <View
                  style={{
                    backgroundColor: colorConfig.pageIndex.grayColor,
                    width: 1,
                    height: 35,
                  }}
                />
              )}
              <TouchableOpacity style={styles.point} onPress={this.myVouchers}>
                {/*<Image*/}
                {/*  style={{height: 20, width: 25, marginRight: 5}}*/}
                {/*  source={require('../assets/img/voucher.png')}*/}
                {/*/>*/}
                <Icon
                  size={23}
                  name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                  style={{
                    color: colorConfig.store.defaultColor,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: colorConfig.pageIndex.activeTintColor,
                    fontSize: 14,
                    fontFamily: 'Lato-Medium',
                  }}>
                  My Vouchers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <AccountMenuList screen={this.props} />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: colorConfig.store.colorError,
            height: 50,
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
          onPress={this.logout}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
            }}>
            LOG OUT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    margin: 10,
    flexDirection: 'row',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
  card: {
    marginVertical: 10,
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
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
)(Account);

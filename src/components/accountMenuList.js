import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import {logoutUser} from '../actions/auth.actions';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import {vouchers} from '../actions/rewards.action';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout = async () => {
    const response = await this.props.dispatch(logoutUser());
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
    Actions.accountVouchers({data: myVoucers});
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.title}>
            {this.props.totalPoint == undefined
              ? 0 + ' Point'
              : this.props.totalPoint + ' Points'}{' '}
          </Text>
          <Icon
            size={20}
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-dropright-circle'
                : 'md-arrow-dropright-circle'
            }
            style={{color: colorConfig.pageIndex.activeTintColor}}
          />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item} onPress={this.myVouchers}>
          <Text style={styles.title}> My Vouchers </Text>
          <Icon
            size={20}
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-dropright-circle'
                : 'md-arrow-dropright-circle'
            }
            style={{color: colorConfig.pageIndex.activeTintColor}}
          />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.screen.navigation.navigate('History')}>
          <Text style={styles.title}> History </Text>
          <Icon
            size={20}
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-dropright-circle'
                : 'md-arrow-dropright-circle'
            }
            style={{color: colorConfig.pageIndex.activeTintColor}}
          />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.title}> Setting </Text>
          <Icon
            size={20}
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-dropright-circle'
                : 'md-arrow-dropright-circle'
            }
            style={{color: colorConfig.pageIndex.activeTintColor}}
          />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item} onPress={this.logout}>
          <Text style={styles.title}> Logout </Text>
          <Icon
            size={20}
            name={
              Platform.OS === 'ios'
                ? 'ios-arrow-dropright-circle'
                : 'md-arrow-dropright-circle'
            }
            style={{color: colorConfig.pageIndex.activeTintColor}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
  },
  item: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
  },
});

mapStateToProps = state => ({
  logoutUser: state.authReducer.logoutUser,
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
)(AccountMenuList);

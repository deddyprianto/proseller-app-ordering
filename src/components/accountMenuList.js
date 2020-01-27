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
import {Actions} from 'react-native-router-flux';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  logout = async () => {
    const response = await this.props.dispatch(logoutUser());
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
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10,
              width: 25,
            }}>
            <Image
              style={{height: 20, width: 25, marginRight: 5}}
              source={require('../assets/img/voucher.png')}
            />
          </View>
          <View>
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
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10,
              width: 25,
            }}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-timer' : 'md-time'}
              style={{color: colorConfig.pageIndex.activeTintColor}}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.props.screen.navigation.navigate('History')}>
              <Text style={styles.title}> Transactions History </Text>
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
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10,
              width: 25,
            }}>
            <Image
              style={{height: 20, width: 20, marginRight: 5}}
              source={require('../assets/img/settings.png')}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.title}> Settings </Text>
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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    borderTopColor: colorConfig.pageIndex.activeTintColor,
    borderTopWidth: 1,
  },
  item: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 60,
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
    fontFamily: 'Lato-Medium',
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

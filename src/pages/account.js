import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingLogout: false,
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
    this.setState({loadingLogout: true});
    await this.props.dispatch(logoutUser());
    this.setState({loadingLogout: false});
  };

  // myVouchers = () => {
  //   var myVoucers = [];
  //   if (this.props.myVoucers != undefined) {
  //     _.forEach(
  //       _.groupBy(
  //         this.props.myVoucers.filter(voucher => voucher.deleted == false),
  //         'id',
  //       ),
  //       function(value, key) {
  //         value[0].totalRedeem = value.length;
  //         myVoucers.push(value[0]);
  //       },
  //     );
  //   }
  //   Actions.accountVouchers({data: myVoucers});
  // };

  render() {
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
          {this.state.loadingLogout ? (
            <ActivityIndicator size={'large'} color={'white'} />
          ) : (
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
          )}
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

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

  editProfil = () => {
    var dataDiri = {dataDiri: this.props.userDetail};
    Actions.accountEditProfil(dataDiri);
  };

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
          <AccountUserDetail screen={this.props} />
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
            <View style={styles.point}>
              <Image
                style={{height: 18, width: 25, marginRight: 5}}
                source={require('../assets/img/ticket.png')}
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
                {this.props.totalPoint == undefined ? 0 : this.props.totalPoint}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colorConfig.pageIndex.grayColor,
                width: 1,
                height: 35,
              }}
            />
            <TouchableOpacity style={styles.point} onPress={this.editProfil}>
              <Image
                resizeMode="stretch"
                style={{height: 18, width: 16, marginRight: 5}}
                source={require('../assets/img/edit.png')}
              />
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 14,
                  fontFamily: 'Lato-Medium',
                }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <AccountMenuList screen={this.props} />
        </ScrollView>
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: colorConfig.pageIndex.backgroundColor,
            height: 40,
            justifyContent: 'center',
            borderColor: colorConfig.pageIndex.activeTintColor,
            borderWidth: 1,
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
          onPress={this.logout}>
          <Text
            style={{
              color: 'red',
              fontSize: 14,
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
            }}>
            LOGOUT
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
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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

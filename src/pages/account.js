import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl ,
  TouchableOpacity
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";

import {logoutUser} from "../actions/auth.actions";
import AccountUserDetail from "../components/accountUserDetail";
import AccountMenuList from "../components/accountMenuList";

import {
  campaign, 
  dataPoint,
  vouchers
} from "../actions/rewards.action";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount = async() => {
    await this.getDataRewards();
  }

  getDataRewards = async() => {
    try {
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(vouchers());
    } catch (error) {
      await this.props.dispatch(notifikasi('Get Data Rewards Error!', error.responseBody.message, console.log('Cancel Pressed')));
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  }

  logout = async () => {
     await this.props.dispatch(logoutUser());
  }

  render() {
    return (
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <AccountUserDetail screen={this.props}/>
        <AccountMenuList screen={this.props}/>
      </ScrollView>
    );
  }
}

mapStateToProps = (state) => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Account);

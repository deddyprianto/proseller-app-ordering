import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
import {campaign, dataPoint, vouchers} from '../actions/rewards.action';

import RewardsPoint from '../components/rewardsPoint';
import RewardsStamp from '../components/rewardsStamp';
import RewardsMenu from '../components/rewardsMenu';
import RewardsTransaction from '../components/rewardsTransaction';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

const AppNavigationContainer = createAppContainer(
  createMaterialTopTabNavigator(
    {
      Stamp: {
        screen: RewardsStamp,
      },
      // Loyalty: {
      //   screen: Stamp
      // },
      Point: {
        screen: RewardsPoint,
      },
    },
    {
      initialRouteName: 'Stamp',
      tabBarOptions: {
        labelStyle: {
          fontSize: 12,
        },
        tabStyle: {
          height: 40,
        },
        style: {
          backgroundColor: colorConfig.pageIndex.backgroundColor,
        },
        activeTintColor: colorConfig.pageIndex.activeTintColor,
        inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
        upperCaseLabel: false,
      },
    },
  ),
);

class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRewards: [],
      dataPoint: [],
      dataStamp: [],
      dataRecent: [],
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
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

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {/* <AppNavigationContainer/> */}
        <RewardsStamp />
        <RewardsPoint />
        <RewardsMenu />
        <RewardsTransaction screen={this.props} />
      </ScrollView>
    );
  }
}

mapStateToProps = state => ({
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Rewards);

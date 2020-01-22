import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Container} from 'native-base';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import logoCash from '../assets/img/cash.png';
import logoVisa from '../assets/img/visa.png';
import colorConfig from '../config/colorConfig';
import {campaign, dataPoint} from '../actions/rewards.action';

import HistoryPayment from '../components/historyPayment';
import HistoryRedeem from '../components/historyRedeem';

const AppNavigationContainer = createAppContainer(
  createMaterialTopTabNavigator(
    {
      Payment: {
        screen: HistoryPayment,
      },
      // Redeem: {
      // 	screen: HistoryRedeem
      // }
    },
    {
      initialRouteName: 'Payment',
      tabBarOptions: {
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        style: {
          backgroundColor: colorConfig.pageIndex.backgroundColor,
        },
        indicatorStyle: {
          borderBottomColor: colorConfig.pageIndex.activeTintColor,
          borderBottomWidth: 2,
        },
        activeTintColor: colorConfig.pageIndex.activeTintColor,
        inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
        upperCaseLabel: false,
      },
    },
  ),
);

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    await this.getDataHistory();
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

  render() {
    return (
      <Container>
        <AppNavigationContainer />
      </Container>
    );
  }
}

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
)(History);

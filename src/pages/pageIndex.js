import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Container} from 'native-base';

import Store from './store';
import History from './history';
import Rewards from './rewards';
import Inbox from './inbox';
import Account from './account';
import colorConfig from '../config/colorConfig';

const AppTabNavigator = createMaterialBottomTabNavigator(
  {
    Store: {
      screen: Store,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-timer' : 'md-time'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Rewards: {
      screen: Rewards,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-ribbon' : 'md-ribbon'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Inbox: {
      screen: Inbox,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Account: {
      screen: Account,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
            style={{color: tintColor}}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Store',
    activeTintColor: colorConfig.pageIndex.activeTintColor,
    inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Lato-Medium',
    },
  },
);

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: AppTabNavigator,
});

const AppStackContainer = createAppContainer(AppTabNavigator);

export default class PageIndex extends Component {
  render() {
    return (
      <Container>
        <AppStackContainer />
      </Container>
    );
  }
}

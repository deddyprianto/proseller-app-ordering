import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import Store from './store';
import History from './history';
import Rewards from './rewards';
import Inbox from './inbox';
import Account from './account';

const PageTabNavigator = createMaterialBottomTabNavigator(
  {
    Store: { 
      screen: Store,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={28} name={ Platform.OS === 'ios' ? 'shoppingcart' : 'md-cart' } style={{ color: tintColor }} />
        )
      } 
    },
    History: { 
      screen: History,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={28} name={ Platform.OS === 'ios' ? 'history' : 'md-time' } style={{ color: tintColor }} />
        )
      }  
    },
    Rewards: { 
      screen: Rewards,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={28} name={ Platform.OS === 'ios' ? 'price-ribbon' : 'md-ribbon' } style={{ color: tintColor }} />
        )
      }  
    },
    Inbox: { 
      screen: Inbox,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={28} name={ Platform.OS === 'ios' ? 'message1' : 'md-mail' } style={{ color: tintColor }} />
        )
      }  
    },
    Account: { 
      screen: Account,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={28} name={ Platform.OS === 'ios' ? 'account-circle' : 'md-contact' } style={{ color: tintColor }} />
        )
      }  
    },
  },
  {
    initialRouteName: 'Store',
    activeTintColor: '#FAA21C',
    inactiveTintColor: 'grey', 
    barStyle: { backgroundColor: '#FFFFFF' },
  }
);

const PageContainer = createAppContainer(PageTabNavigator);

export default class PageIndex extends Component {
  render() {
    return (
      <PageContainer />
      // <Text> Store </Text>
    );
  }
}



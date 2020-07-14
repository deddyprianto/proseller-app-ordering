import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Container} from 'native-base';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Platform} from 'react-native';
import Store from './store';
import History from './history';
import Rewards from './rewards';
import Inbox from './inbox';
import Account from './account';
import colorConfig from '../config/colorConfig';
import IconMail from '../components/atom/IconMail';

const AppTabNavigator = createMaterialBottomTabNavigator(
  {
    Store: {
      screen: Store,
      navigationOptions: {
        title: 'Outlet',
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
        title: 'History',
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
        title: 'Rewards',
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
        title: 'Inbox',
        tabBarIcon: ({tintColor, focused}) => (
          <IconMail tintColor={tintColor} />
        ),
      },
    },
    Account: {
      // path: 'first',
      screen: Account,
      navigationOptions: {
        title: 'Profile',
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
    initialRouteName: 'Rewards',
    activeColor: colorConfig.store.defaultColor,
    inactiveColor: colorConfig.pageIndex.grayColor,
    shifting: false,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Lato-Medium',
    },
  },
);

const AppTabNavigatorHistory = createMaterialBottomTabNavigator(
  {
    Store: {
      screen: Store,
      navigationOptions: {
        title: 'Outlet',
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
        title: 'History',
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
        title: 'Rewards',
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
        title: 'Inbox',
        tabBarIcon: ({tintColor, focused}) => (
          <IconMail tintColor={tintColor} />
        ),
      },
    },
    Account: {
      screen: Account,
      navigationOptions: {
        title: 'Profile',
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
    initialRouteName: 'History',
    activeColor: colorConfig.store.defaultColor,
    inactiveColor: colorConfig.pageIndex.grayColor,
    shifting: false,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Lato-Medium',
    },
  },
);

const AppStackContainer = createAppContainer(AppTabNavigator, {
  transitionConfig: () => ({screenInterpolator: () => null}),
});

const AppStackContainerHistory = createAppContainer(AppTabNavigatorHistory, {
  transitionConfig: () => ({screenInterpolator: () => null}),
});

class PageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  render() {
    const {fromPayment} = this.props;
    return (
      <Container>
        {fromPayment == true ? (
          <AppStackContainerHistory />
        ) : (
          <AppStackContainer />
        )}
      </Container>
    );
  }
}

mapStateToProps = state => ({
  dataInbox: state.inboxReducer.dataInbox.broadcast,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PageIndex);

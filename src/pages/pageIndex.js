import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Container} from 'native-base';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Platform} from 'react-native';
// import MenuCategory from '../components/order/MenuCategory';
import History from './history';
import Rewards from './rewards';
import Account from './account';
import Profile from './Profile';
import colorConfig from '../config/colorConfig';
import {paymentRefNo} from '../actions/account.action';
import Home from './home';
import Inbox from './inbox';
import Login from './Login';

const AppTabNavigatorNonLogin = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: 'Home',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Auth: {
      screen: Login,
      navigationOptions: {
        title: 'Login',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-apps' : 'md-log-in'}
            style={{color: tintColor}}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: colorConfig.store.defaultColor,
    inactiveColor: colorConfig.pageIndex.grayColor,
    shifting: false,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Poppins-Regular',
    },
  },
);

const AppTabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: 'Home',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
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
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Profile: {
      // path: 'first',
      screen: Profile,
      navigationOptions: {
        title: 'Profile',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            style={{color: tintColor}}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: colorConfig.store.defaultColor,
    inactiveColor: colorConfig.pageIndex.grayColor,
    shifting: false,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Poppins-Regular',
    },
  },
);

const AppTabNavigatorHistory = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: 'Order',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
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
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Profile: {
      // path: 'first',
      screen: Account,
      navigationOptions: {
        title: 'Profile',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
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
      fontFamily: 'Poppins-Regular',
    },
  },
);

const AppStackContainer = createAppContainer(AppTabNavigator, {
  transitionConfig: () => ({screenInterpolator: () => null}),
});

const AppStackContainerNonLogin = createAppContainer(AppTabNavigatorNonLogin, {
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

  componentDidMount = async () => {
    try {
      try {
        if (this.props.paymentRefNo != undefined) {
          await this.props.dispatch(paymentRefNo(this.props.paymentRefNo));
        }
      } catch (e) {}
    } catch (e) {}
  };

  render() {
    const {fromPayment, isLoggedIn} = this.props;
    return (
      <Container>
        {fromPayment == true ? (
          <AppStackContainerHistory />
        ) : isLoggedIn ? (
          <AppStackContainer />
        ) : (
          <AppStackContainerNonLogin />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  intlData: state.intlData,
  isLoggedIn: state.authReducer.authData.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PageIndex);

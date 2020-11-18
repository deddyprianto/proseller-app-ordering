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
import ProductsRetail from '../components/order/ProductsRetail';
import MenuCategory from '../components/order/MenuCategory';
import History from './history';
import Rewards from './rewards';
// import Inbox from './inbox';
import Account from './account';
import colorConfig from '../config/colorConfig';
import IconMail from '../components/atom/IconMail';
import {paymentRefNo} from '../actions/account.action';

const AppTabNavigator = createMaterialBottomTabNavigator(
  {
    Store: {
      screen: ProductsRetail,
      navigationOptions: {
        title: 'Order',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Category: {
      screen: MenuCategory,
      navigationOptions: {
        title: 'Category',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-apps' : 'md-apps'}
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
    Account: {
      // path: 'first',
      screen: Account,
      navigationOptions: {
        title: 'More',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-ellipsis-vertical' : 'md-menu'}
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
      screen: ProductsRetail,
      navigationOptions: {
        title: 'Order',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
            style={{color: tintColor}}
          />
        ),
      },
    },
    Category: {
      screen: MenuCategory,
      navigationOptions: {
        title: 'Category',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-apps' : 'md-apps'}
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
    Account: {
      // path: 'first',
      screen: Account,
      navigationOptions: {
        title: 'More',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            size={28}
            name={Platform.OS === 'ios' ? 'ios-ellipsis-vertical' : 'md-menu'}
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

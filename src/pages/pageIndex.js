import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Container} from 'native-base';
import {Dimensions, PermissionsAndroid} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Platform} from 'react-native';
import Store from './store';
import History from './history';
import Rewards from './rewards';
import Inbox from './inbox';
import Account from './account';
import OfflineNotice from '../components/OfflineNotice';
import colorConfig from '../config/colorConfig';
import {refreshToken} from '../actions/auth.actions';

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
    activeTintColor: colorConfig.pageIndex.activeTintColor,
    inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Lato-Medium',
    },
  },
);

const AppStackContainer = createAppContainer(AppTabNavigator, {
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
    return (
      <Container>
        {/*<OfflineNotice />*/}
        <AppStackContainer />
        {/*/!*{this.props.dataInboxNoRead > 0 ? (*!/*/}
        {/*{true ? (*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      position: 'absolute',*/}
        {/*      top: null,*/}
        {/*      left: null,*/}
        {/*      bottom: 30,*/}
        {/*      right: this.state.screenWidth / 4 - 5,*/}
        {/*      height: 18,*/}
        {/*      borderTopLeftRadius: 10,*/}
        {/*      borderTopRightRadius: 10,*/}
        {/*      borderBottomLeftRadius: 10,*/}
        {/*      borderBottomRightRadius: 10,*/}
        {/*      backgroundColor: 'red',*/}
        {/*      alignItems: 'center',*/}
        {/*      justifyContent: 'center',*/}
        {/*      paddingLeft: 5,*/}
        {/*      paddingRight: 5,*/}
        {/*      paddingTop: 5,*/}
        {/*      paddingBottom: 5,*/}
        {/*      borderColor: colorConfig.pageIndex.backgroundColor,*/}
        {/*      borderWidth: 2,*/}
        {/*    }}>*/}
        {/*    <Text*/}
        {/*      style={{*/}
        {/*        color: colorConfig.pageIndex.backgroundColor,*/}
        {/*        fontSize: 10,*/}
        {/*        width: '100%',*/}
        {/*        textAlign: 'center',*/}
        {/*        fontWeight: 'bold',*/}
        {/*      }}>*/}
        {/*      /!*{this.props.dataInboxNoRead}*!/*/}
        {/*      5*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*) : null}*/}
      </Container>
    );
  }
}

mapStateToProps = state => ({
  dataInboxNoRead: state.inboxReducer.dataInbox.broadcasNoRead,
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

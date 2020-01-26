import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Container} from 'native-base';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import Store from './store';
import History from './history';
import Rewards from './rewards';
import Inbox from './inbox';
import Account from './account';
import OfflineSign from '../components/offlineSign';
import colorConfig from '../config/colorConfig';

const isOnline = require('is-online');

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
    initialRouteName: 'Rewards',
    activeTintColor: colorConfig.pageIndex.activeTintColor,
    inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
    barStyle: {
      backgroundColor: colorConfig.pageIndex.backgroundColor,
      fontFamily: 'Lato-Medium',
    },
  },
);

const AppStackContainer = createAppContainer(AppTabNavigator);

class PageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      online: false,
    };
  }

  componentDidMount = async () => {
    await this.checkOnline();
  };

  checkOnline = async () => {
    var online;
    if (isOnline()) {
      online = true;
    } else {
      online = false;
    }
    this.setState({online: online});
  };

  render() {
    // let that = this;
    // setInterval(() => {
    //   that.checkOnline();
    // }, 3000);
    return (
      <Container>
        <AppStackContainer />
        {this.state.online ? null : <OfflineSign />}
        {this.props.dataInboxNoRead > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: null,
              left: null,
              bottom: 30,
              right: this.state.screenWidth / 4 - 5,
              height: 18,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 5,
              paddingBottom: 5,
              borderColor: colorConfig.pageIndex.backgroundColor,
              borderWidth: 2,
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                fontSize: 10,
                width: '100%',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {this.props.dataInboxNoRead}
            </Text>
          </View>
        ) : null}
      </Container>
    );
  }
}

mapStateToProps = state => ({
  dataInboxNoRead: state.inboxReducer.dataInbox.broadcasNoRead,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(PageIndex);

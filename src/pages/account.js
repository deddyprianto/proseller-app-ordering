import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import {logoutUser} from '../actions/auth.actions';
import AccountUserDetail from '../components/accountUserDetail';
import AccountMenuList from '../components/accountMenuList';
import colorConfig from '../config/colorConfig';
import {getUserProfile} from '../actions/user.action';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingLogout: false,
      dialogChangeLanguage: false,
    };
  }

  componentDidMount = async () => {
    // await this.getDataRewards();
  };

  getDataRewards = async () => {
    try {
      await this.props.dispatch(getUserProfile());
    } catch (error) {}
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  };

  logout = async () => {
    this.setState({loadingLogout: true});
    await this.props.dispatch(logoutUser());
    this.setState({loadingLogout: false});
  };

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.card}>
            <AccountUserDetail screen={this.props} />
          </View>
          <View style={styles.card}>
            <AccountMenuList
              setLanguage={this.setLanguage}
              dialogChangeLanguage={this.state.dialogChangeLanguage}
              screen={this.props}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    margin: 10,
    flexDirection: 'row',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
  card: {
    // marginVertical: 10,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
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
)(Account);

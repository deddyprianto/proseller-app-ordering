import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
// import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
import {
  campaign,
  dataPoint,
  vouchers,
  getStamps,
} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';
import {dataInbox} from '../actions/inbox.action';

import RewardsPoint from '../components/rewardsPoint';
import RewardsStamp from '../components/rewardsStamp';
import RewardsMenu from '../components/rewardsMenu';
import RewardsTransaction from '../components/rewardsTransaction';
import Loader from '../components/loader';

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
      isLoading: true,
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
      await this.props.dispatch(myVoucers());
      await this.props.dispatch(getStamps());
      await this.props.dispatch(dataInbox());
      this.setState({isLoading: false});
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
        {this.state.isLoading ? (
          <View style={styles.loading}>
            {this.state.isLoading && <Loader />}
          </View>
        ) : (
          <View>
            {this.props.dataStamps.dataStamps == undefined ? null : this.props
                .dataStamps.dataStamps.length == 0 ? null : (
              <RewardsStamp />
            )}
            <RewardsPoint />
            <RewardsMenu myVoucers={this.props.myVoucers} />
            <RewardsTransaction screen={this.props} />
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    height: Dimensions.get('window').height,
  },
});

mapStateToProps = state => ({
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  dataStamps: state.rewardsReducer.getStamps,
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

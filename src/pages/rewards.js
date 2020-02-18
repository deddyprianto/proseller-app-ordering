import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
import {dataPoint, getStamps} from '../actions/rewards.action';
import {refreshToken} from '../actions/auth.actions';
import {recentTransaction} from '../actions/sales.action';
import RewardsPoint from '../components/rewardsPoint';
import RewardsStamp from '../components/rewardsStamp';
import RewardsMenu from '../components/rewardsMenu';
import RewardsTransaction from '../components/rewardsTransaction';
import Loader from '../components/loader';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import {userPosition} from '../actions/user.action';
import {myVoucers} from '../actions/account.action';

class Rewards extends Component {
  _isMounted = false;
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
    this._isMounted = true;
    // this.props.dispatch(refreshToken());
    await this.getDataRewards();
    // await this.props.dispatch(refreshToken());
  };

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  getDataRewards = async () => {
    try {
      // var date = 10000;
      // console.log('askjas', formatter(date));
      await this.getUserPosition();
      // await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      // await this.props.dispatch(vouchers());
      await this.props.dispatch(getStamps());
      // await this.props.dispatch(dataInbox());
      await this.props.dispatch(recentTransaction());
      await this.props.dispatch(myVoucers());

      this.setState({isLoading: false});
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Opps!',
          'Cannot Get Data Rewards',
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  getUserPosition = async () => {
    try {
      await Geolocation.getCurrentPosition(
        async position => {
          await this.props.dispatch(userPosition(position));
        },
        async error => {},
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error, 'error get position');
    }
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  };

  detailStamps() {
    Actions.detailStamps();
  }

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
              <View
                style={{
                  backgroundColor: colorConfig.pageIndex.activeTintColor,
                  alignItems: 'center',
                }}>
                <RewardsStamp dataStamps={this.props.dataStamps} />
                <TouchableOpacity
                  onPress={this.detailStamps}
                  style={{
                    width: 100,
                  }}>
                  <Text style={styles.btn}>Learn More</Text>
                </TouchableOpacity>
              </View>
            )}
            {this.props.totalPoint == undefined ||
            this.props.totalPoint == 0 ? (
              <View
                style={{
                  backgroundColor: colorConfig.pageIndex.activeTintColor,
                  height: this.state.screenHeight / 5 - 35,
                }}
              />
            ) : (
              <RewardsPoint />
            )}
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
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

mapStateToProps = state => ({
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  dataStamps: state.rewardsReducer.getStamps,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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

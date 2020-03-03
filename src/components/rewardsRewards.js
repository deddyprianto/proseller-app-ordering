import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {dataPoint, vouchers} from '../actions/rewards.action';

import colorConfig from '../config/colorConfig';
import RewardsStamp from '../components/rewardsStamp';
import RewardsStampDetail from '../components/rewardsStampDetail';
import RewordsVouchers from '../components/rewordsVouchers';
import Loader from '../components/loader';
import {myVoucers} from '../actions/account.action';

class RewardsRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: [],
      isLoading: true,
      rewardPoint: 0,
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    this.getDataVoucher();
  };

  getDataVoucher = async () => {
    this.setState({isLoading: true});
    await this.props.dispatch(dataPoint());
    await this.props.dispatch(vouchers());
    await this.props.dispatch(myVoucers());
    this.setState({isLoading: false});
  };

  goBack() {
    Actions.pop();
  }

  render() {
    const {intlData} = this.props;
    return (
      <View style={styles.container}>
        {this.state.isLoading && <Loader />}
        <View style={{backgroundColor: colorConfig.store.defaultColor}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
              <Text style={styles.btnBackText}>
                {' '}
                {intlData.messages.rewards}{' '}
              </Text>
            </TouchableOpacity>
            <View style={styles.point}>
              <Icon
                size={23}
                name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  fontWeight: 'bold',
                }}>
                {this.props.totalPoint == undefined
                  ? 0 + ' Point'
                  : this.props.totalPoint + ' Point'}
              </Text>
            </View>
          </View>
          {/*<View style={styles.line} />*/}
        </View>
        <RewordsVouchers />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.backgroundColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    color: colorConfig.pageIndex.backgroundColor,
  },
  btnBackText: {
    color: colorConfig.pageIndex.backgroundColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  loading: {
    height: Dimensions.get('window').height - 50,
  },
  point: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.backgroundColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});

mapStateToProps = state => ({
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
)(RewardsRewards);

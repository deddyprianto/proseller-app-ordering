import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {
  campaign,
  dataPoint,
  getStamps,
  vouchers,
} from '../actions/rewards.action';

import colorConfig from '../config/colorConfig';
// import RewardsStamp from '../components/rewardsStamp';
// import RewardsStampDetail from '../components/rewardsStampDetail';
import RewordsVouchers from '../components/rewordsVouchers';
import Loader from '../components/loader';
import {myVoucers} from '../actions/account.action';
import {isEmptyObject} from '../helper/CheckEmpty';
import LoaderDarker from './LoaderDarker';
import {recentTransaction} from '../actions/sales.action';
import {Body} from './layout';

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
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  getDataVoucher = async () => {
    this.setState({isLoading: true});
    await Promise.all([
      this.props.dispatch(dataPoint()),
      this.props.dispatch(vouchers()),
      this.props.dispatch(myVoucers()),
    ]);
    this.setState({isLoading: false});
  };

  goBack = () => {
    Actions.pop();
  };

  render() {
    const {intlData, detailPoint} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isLoading && <LoaderDarker />}
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
              <Text style={styles.btnBackText}>Voucher</Text>
            </TouchableOpacity>
            {this.props.totalPoint != undefined &&
            detailPoint != undefined &&
            !isEmptyObject(detailPoint.trigger) &&
            (detailPoint.trigger.status === true ||
              detailPoint.trigger.campaignTrigger === 'USER_SIGNUP') ? (
              <View style={styles.point}>
                {/*<Icon*/}
                {/*  size={23}*/}
                {/*  name={*/}
                {/*    Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'*/}
                {/*  }*/}
                {/*  style={{*/}
                {/*    color: colorConfig.pageIndex.backgroundColor,*/}
                {/*    marginRight: 8,*/}
                {/*  }}*/}
                {/*/>*/}
                <Text
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    fontWeight: 'bold',
                  }}>
                  {this.props.totalPoint == undefined
                    ? 0 + ' Point'
                    : this.props.totalPoint + ' Points'}
                </Text>
              </View>
            ) : null}
          </View>
          {/*<View style={styles.line} />*/}
        </View>
        <Body>
          <RewordsVouchers />
        </Body>
      </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.backgroundColor,
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
  },
});

mapStateToProps = state => ({
  detailPoint: state.rewardsReducer.dataPoint.detailPoint,
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

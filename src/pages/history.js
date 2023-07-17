import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {dataPoint, vouchers} from '../actions/rewards.action';

import colorConfig from '../config/colorConfig';
import Loader from '../components/loader';
import {myVoucers} from '../actions/account.action';
import HistoryMenuTab from '../components/history/HistoryMenuTab';
import {getAccountPayment} from '../actions/payment.actions';
import OneSignal from 'react-native-onesignal';
import {getBasket, getPendingCart} from '../actions/order.action';
import appConfig from '../config/appConfig';
import {Body} from '../components/layout';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: [],
      isLoading: false,
      rewardPoint: 0,
      refreshing: false,
    };

    // OneSignal.inFocusDisplaying(1);
  }

  componentDidMount = async () => {
    try {
      // await this.props.dispatch(getAccountPayment());
      await this.props.dispatch(getPendingCart());
      this.props.dispatch(getBasket());
    } catch (e) {}
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
    await this.props.dispatch(dataPoint());
    await this.props.dispatch(vouchers());
    await this.props.dispatch(myVoucers());
    this.setState({isLoading: false});
  };

  goBack = () => {
    Actions.pop();
  };

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <Body>
          {this.state.isLoading && <Loader />}
          <View style={{backgroundColor: colorConfig.store.defaultColor}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.btnBackText}>
                {' '}
                {appConfig.appName === 'fareastflora'
                  ? 'Orders'
                  : 'History'}{' '}
              </Text>
            </View>
            {/*<View style={styles.line} />*/}
          </View>
          <HistoryMenuTab />
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
    fontSize: 18,
    paddingVertical: 13,
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
)(History);

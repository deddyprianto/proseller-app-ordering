/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Slider} from 'react-native-elements';

// import {campaign, dataPoint, vouchers} from '../actions/rewards.action';
import colorConfig from '../config/colorConfig';
import RewardsPoint from '../components/rewardsPoint';
import appConfig from '../config/appConfig';
import Loader from '../components/loader';
import {VirtualKeyboard} from '../helper/react-native-screen-keyboard';
import LoadingScreen from './loadingScreen';
// import {parse} from 'react-native-svg';

class paymentAddPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      jumPointRatio: 0,
      jumMoneyRatio: 0,
      jumPoint: 0,
      ratio: 1,
      myPoint: this.props.totalPoint == undefined ? 0 : this.props.totalPoint,
      isLoading: true,
    };
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
  };

  componentWillMount = async () => {
    const {campign, detailPoint} = this.props;

    try {
      const {pendingPoints, amountSVC, percentageUseSVC} = this.props;

      var jumPointRatio = this.props.campign.points.pointsToRebateRatio0;
      var jumMoneyRatio = this.props.campign.points.pointsToRebateRatio1;

      let ratio = jumPointRatio / jumMoneyRatio;

      // create default point to set based on the ratio of point to rebate
      let setDefault = parseFloat(
        (this.props.paymentData.payment * ratio).toFixed(2),
      );

      this.setState({
        jumPointRatio: jumPointRatio,
        jumMoneyRatio: jumMoneyRatio,
        ratio: ratio,
      });

      // if settings from admin is not set to decimal, then round
      let pointToSet = this.state.myPoint;

      if (pendingPoints && pendingPoints > 0) {
        pointToSet -= pendingPoints;
      }

      if (detailPoint && detailPoint.lockPoints > 0) {
        if (percentageUseSVC > 0) {
          let minusPoint = 0;
          minusPoint =
            (amountSVC / this.props.defaultBalance) * detailPoint.defaultPoints;
          let diff = detailPoint.lockPoints - minusPoint;
          diff = diff < 0 ? 0 : diff;
          pointToSet = pointToSet - diff;
        } else {
          pointToSet -= detailPoint.lockPoints;
        }
      }

      try {
        pointToSet = Number(pointToSet.toFixed(2));
      } catch (e) {}

      if (pointToSet < 0) {
        pointToSet = 0;
      }

      if (
        campign.points.roundingOptions != undefined &&
        campign.points.roundingOptions == 'INTEGER'
      ) {
        try {
          setDefault = Number(setDefault.toFixed(0));
        } catch (e) {
          setDefault = Math.ceil(setDefault);
        }

        // pointToSet = Math.floor(this.props.totalPoint);
        pointToSet = Math.floor(pointToSet);
      }

      if (this.props.valueSet == 0) {
        // if (setDefault >= this.props.totalPoint) {
        if (setDefault >= pointToSet) {
          this.setState({jumPoint: pointToSet});
        } else {
          this.setState({jumPoint: setDefault});
        }
      } else {
        this.setState({jumPoint: this.props.valueSet});
      }
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again');
    }
  };

  goBack = async () => {
    Actions.pop();
  };

  pageDetailPoint = async () => {
    const {originalPurchase, paymentData} = this.props;
    const {ratio, jumPoint} = this.state;
    const maxPayment = paymentData.payment * ratio;
    // Actions.paymentDetail({
    //   paymentData: this.props.paymentData,
    //   addPoint: this.state.jumPoint == 0 ? undefined : this.state.jumPoint,
    //   moneyPoint:
    //     (this.state.jumPoint / this.state.jumPointRatio) *
    //     this.state.jumMoneyRatio,
    // });

    const doPaymentImmediately =
      jumPoint === maxPayment && originalPurchase === paymentData.payment;

    this.setState({isLoading: true});
    await this.props.setDataPoint(
      this.state.jumPoint === 0 ? undefined : this.state.jumPoint,
      this.calculateMoneyPoint(),
    );
    this.setState({isLoading: false});

    if (doPaymentImmediately) {
      this.props.doPayment();
    } else {
      Actions.pop();
    }
  };

  to2PointDecimal = data => {
    try {
      if (data != 0) {
        let money = data.toString().split('.');
        if (money[1] != undefined) {
          money = `${money[0]}.${money[1].substr(0, 2)}`;
        }
        return parseFloat(money);
      } else {
        return parseFloat(0);
      }
    } catch (e) {
      return parseFloat(0);
    }
  };

  calculateMoneyPoint = () => {
    const {campign} = this.props;
    try {
      let ratio = this.state.jumPoint / this.state.jumPointRatio;
      // if (
      //   campign.points.roundingOptions != undefined &&
      //   campign.points.roundingOptions == 'DECIMAL'
      // ) {
      //   let money = parseFloat(ratio * this.state.jumMoneyRatio);
      //   return this.to2PointDecimal(money);
      //   // return money.toFixed(2);
      // } else {
      //   ratio = Math.floor(ratio);
      //   return ratio * this.state.jumMoneyRatio;
      // }
      let money = parseFloat(ratio * this.state.jumMoneyRatio);
      return this.to2PointDecimal(money);
    } catch (e) {
      return 0;
    }
  };

  calculateJumPoint = jumPoint => {
    const {campign} = this.props;
    try {
      if (
        campign.points.roundingOptions != undefined &&
        campign.points.roundingOptions == 'DECIMAL'
      ) {
        return parseFloat(jumPoint.toFixed(2));
      } else {
        return Math.ceil(jumPoint);
      }
    } catch (e) {
      return Math.ceil(jumPoint);
    }
  };

  getMaximumPoint = () => {
    const {
      campign,
      pendingPoints,
      detailPoint,
      amountSVC,
      percentageUseSVC,
    } = this.props;
    let {ratio, myPoint} = this.state;
    try {
      if (pendingPoints && pendingPoints > 0) {
        myPoint -= pendingPoints;
      }

      if (detailPoint && detailPoint.lockPoints > 0) {
        if (percentageUseSVC > 0) {
          let minusPoint = 0;
          minusPoint =
            (amountSVC / this.props.defaultBalance) * detailPoint.defaultPoints;
          let diff = detailPoint.lockPoints - minusPoint;
          diff = diff < 0 ? 0 : diff;
          myPoint = myPoint - diff;
        } else {
          myPoint -= detailPoint.lockPoints;
        }
      }

      if (myPoint < 0) {
        myPoint = 0;
      }

      const maxPayment = this.props.paymentData.payment * ratio;

      let maxPoint;
      if (myPoint <= maxPayment) {
        maxPoint = myPoint;
      } else {
        maxPoint = maxPayment;
      }
      if (
        campign.points.roundingOptions &&
        campign.points.roundingOptions === 'DECIMAL'
      ) {
        return parseFloat(maxPoint.toFixed(2));
      } else {
        let returnPoint = Math.ceil(maxPoint);
        if (myPoint < returnPoint) {
          return Math.floor(maxPoint);
        }
        return returnPoint;
      }
    } catch (e) {
      return 0;
    }
  };

  isDisabled = () => {
    try {
      const maxPoint = this.getMaximumPoint();
      if (
        isNaN(this.state.jumPoint) ||
        Number(this.state.jumPoint) > maxPoint
      ) {
        return true;
      }
      return false;
    } catch (e) {
      return true;
    }
  };

  render() {
    const {intlData, campign, pendingPoints} = this.props;
    return (
      <SafeAreaView>
        <LoadingScreen loading={this.state.isLoading} />
        <ScrollView>
          <View
            style={{
              paddingVertical: 5,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
                  <Icon
                    size={35}
                    name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                    style={{color: 'black', padding: 10}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: -30,
                alignItems: 'center',
                marginBottom: 30,
              }}>
              <Text style={{fontFamily: 'Poppins-Medium'}}>Point to use</Text>
              <Text
                style={{
                  color: colorConfig.store.secondaryColor,
                }}>
                {`${intlData.messages.redeem} ${
                  this.state.jumPointRatio
                } point ${intlData.messages.to} ${appConfig.appMataUang} ${
                  this.state.jumMoneyRatio
                }`}
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontFamily: 'Poppins-Medium',
              marginBottom: '4%',
            }}>
            {this.state.jumPoint}
          </Text>
          <View>
            {pendingPoints != undefined && pendingPoints > 0 && (
              <View
                style={{
                  paddingVertical: 8,
                }}>
                <View style={styles.pendingPointsInfo}>
                  <Text
                    style={{
                      color: colorConfig.store.colorError,
                      textAlign: 'center',
                      fontSize: 12,
                    }}>
                    Your {pendingPoints.toFixed(2)} points is locked, because
                    your order has not been completed.
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 20,
                marginBottom: '5%',
              }}>
              <Text style={{fontSize: 17, fontFamily: 'Poppins-Regular'}}>
                Point Balance
              </Text>
              <Text style={{fontSize: 17, fontFamily: 'Poppins-Regular'}}>
                {this.props.totalPoint}
              </Text>
            </View>
            <VirtualKeyboard
              defaultText={parseFloat(this.state.jumPoint)}
              onRef={ref => (this.keyboard = ref)}
              onChange={e => {
                if (e !== null && e !== '') {
                  this.setState({jumPoint: e});
                } else {
                  this.setState({jumPoint: '0'});
                }
              }}
              keyboardStyle={{fontFamily: 'Poppins-Regular'}}
            />
          </View>
          <TouchableOpacity
            onPress={this.pageDetailPoint}
            disabled={this.isDisabled()}
            style={[
              styles.buttonBottomFixed,
              this.isDisabled() ? {opacity: 0.3} : null,
            ]}>
            <Icon
              size={40}
              name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
              style={{color: 'white', alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  pendingPointsInfo: {
    padding: 6,
    backgroundColor: colorConfig.store.transparent,
    borderWidth: 0.2,
    borderColor: colorConfig.store.titleSelected,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    // marginTop: 10,
  },
  buttonBottomFixed: {
    top: '10%',
    marginBottom: 100,
    backgroundColor: colorConfig.store.defaultColor,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },

  container: {
    alignContent: 'center',
    margin: 10,
    paddingBottom: 200,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnBackText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  vourcherPoint: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colorConfig.store.transparentColor,
    height: 30,
    // width: this.state.screenWidth / 2 - 11,
    borderTopRightRadius: 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 16,
    paddingRight: 5,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    width: 70,
  },
  statusTitle: {
    fontSize: 12,
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
  },
  nameVoucher: {
    fontSize: 18,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    marginLeft: 5,
    color: colorConfig.store.titleSelected,
  },
  pointVoucher: {
    fontSize: 12,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
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
  campign: state.rewardsReducer.campaign.campaign,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  pendingPoints: state.rewardsReducer.dataPoint.pendingPoints,
  detailPoint: state.rewardsReducer.dataPoint.detailPoint,
  balance: state.SVCReducer.balance.balance,
  defaultBalance: state.SVCReducer.balance.defaultBalance,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(paymentAddPoint);

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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Slider} from 'react-native-elements';

import {campaign, dataPoint, vouchers} from '../actions/rewards.action';
import colorConfig from '../config/colorConfig';
import RewardsPoint from '../components/rewardsPoint';
import appConfig from '../config/appConfig';
import Loader from '../components/loader';

class paymentAddPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      jumPointRatio: 0,
      jumMoneyRatio: 0,
      jumPoint: 0,
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

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
    await this.props.dispatch(campaign());
    await this.props.dispatch(dataPoint());
    var jumPointRatio = this.props.campign.points.pointsToRebateRatio0;
    var jumMoneyRatio = this.props.campign.points.pointsToRebateRatio1;
    //     this.props.campign.filter(
    //   item => item.campaignType == 'point',
    // )[0].points.pointsToRebateRatio0;
    // var jumMoneyRatio = this.props.campign.filter(
    //   item => item.campaignType == 'point',
    // )[0].points.pointsToRebateRatio1;
    console.log('jumPointRatio ', jumPointRatio);
    var setDefault = jumPointRatio;
    if (this.props.pembayaran.payment < jumPointRatio) {
      setDefault = jumPointRatio;
    } else {
      setDefault = this.props.pembayaran.payment * jumPointRatio;
      setDefault = Math.ceil(setDefault);
    }
    this.setState({
      jumPointRatio: jumPointRatio,
      jumMoneyRatio: jumMoneyRatio,
    });
    if (this.props.valueSet == 0) {
      if (setDefault >= this.props.totalPoint) {
        this.setState({jumPoint: this.props.totalPoint});
      } else {
        this.setState({jumPoint: setDefault});
      }
    } else {
      this.setState({jumPoint: this.props.valueSet});
    }
    console.log('jumPointRatio ', this.state.jumPointRatio);
    console.log('jumMoneyRatio ', this.state.jumMoneyRatio);
    console.log('jumPoint ', this.state.jumPoint);
  };

  goBack = async () => {
    Actions.pop();
  };

  pageDetailPoint = () => {
    // Actions.paymentDetail({
    //   pembayaran: this.props.pembayaran,
    //   addPoint: this.state.jumPoint == 0 ? undefined : this.state.jumPoint,
    //   moneyPoint:
    //     (this.state.jumPoint / this.state.jumPointRatio) *
    //     this.state.jumMoneyRatio,
    // });
    this.props.setDataPoint(
      this.state.jumPoint == 0 ? undefined : this.state.jumPoint,
      (this.state.jumPoint / this.state.jumPointRatio) *
        this.state.jumMoneyRatio,
    );
    Actions.pop();
  };

  getPointOrPrice = () => {
    if (this.props.pembayaran.payment < this.state.jumPointRatio) {
      return this.state.jumPointRatio;
    } else {
      return Math.ceil(this.props.pembayaran.payment);
    }
  };

  render() {
    const {intlData} = this.props;
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        {this.state.isLoading ? (
          <View style={styles.loading}>
            {this.state.isLoading && <Loader />}
          </View>
        ) : (
          <View>
            <RewardsPoint />
            <View
              style={{
                alignItems: 'center',
                top: -70,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                }}>
                {`${intlData.messages.redeem} ${
                  this.state.jumPointRatio
                } point ${intlData.messages.to} ${appConfig.appMataUang} ${
                  this.state.jumMoneyRatio
                }`}
              </Text>
            </View>
            <View style={styles.card}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colorConfig.pageIndex.activeTintColor,
                  }}>
                  {isNaN(this.state.jumPoint) ? 0 : this.state.jumPoint}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: colorConfig.pageIndex.grayColor,
                  }}>
                  {' ' +
                    intlData.messages.point +
                    ' ' +
                    intlData.messages.to +
                    ' ' +
                    appConfig.appMataUang +
                    ' '}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colorConfig.pageIndex.activeTintColor,
                  }}>
                  {isNaN(
                    (this.state.jumPoint / this.state.jumPointRatio) *
                      this.state.jumMoneyRatio,
                  )
                    ? 0
                    : (this.state.jumPoint / this.state.jumPointRatio) *
                      this.state.jumMoneyRatio}
                </Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Slider
                  disabled={this.state.jumPointRatio == 0 ? true : false}
                  minimumValue={0}
                  maximumValue={this.state.myPoint}
                  trackStyle={{
                    width: 200,
                  }}
                  thumbTintColor={colorConfig.pageIndex.activeTintColor}
                  value={this.state.jumPoint}
                  onValueChange={value => {
                    // get ratio
                    let defaultPoint =
                      this.props.pembayaran.payment * this.state.jumPointRatio;
                    if (defaultPoint < this.state.jumPointRatio) {
                      defaultPoint = this.state.jumPointRatio;
                    }
                    // get max pont
                    let jumPoint = defaultPoint;
                    if (value < defaultPoint) {
                      jumPoint = Math.ceil(value);
                    } else {
                      if (
                        this.props.pembayaran.payment < this.state.jumPointRatio
                      ) {
                        jumPoint = this.state.jumPointRatio;
                      } else {
                        jumPoint = Math.ceil(this.props.pembayaran.payment);
                      }
                    }
                    this.setState({jumPoint});
                  }}
                />
                {this.state.jumPoint == 0 ? null : this.state.jumPoint <
                  this.props.pembayaran.payment *
                    this.state.jumPointRatio ? null : (
                  <Text
                    style={{
                      color: colorConfig.store.colorError,
                    }}>
                    {'You only need ' + this.getPointOrPrice() + ' Point'}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                disabled={
                  this.state.jumPointRatio == 0 || this.state.myPoint == 0
                    ? true
                    : false
                }
                style={{
                  backgroundColor:
                    this.state.jumPointRatio == 0 || this.state.myPoint == 0
                      ? colorConfig.store.disableButton
                      : colorConfig.pageIndex.activeTintColor,
                  borderRadius: 25,
                  marginVertical: 10,
                  paddingVertical: 13,
                  marginTop: 20,
                  width: '80%',
                }}
                onPress={this.pageDetailPoint}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colorConfig.auth.buttonText,
                    textAlign: 'center',
                  }}>
                  {intlData.messages.setPoint}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  loading: {
    height: Dimensions.get('window').height,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    // position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -60,
    // height: 100,
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});

mapStateToProps = state => ({
  campign: state.rewardsReducer.campaign.campaign,
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
)(paymentAddPoint);

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
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as _ from 'lodash';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {sendPayment, campaign, dataPoint} from '../actions/rewards.action';

class PaymentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      totalBayar: this.props.pembayaran.payment,
    };
  }

  componentDidMount = async () => {
    var redeemVoucer =
      this.props.dataVoucer == undefined
        ? 0
        : this.props.dataVoucer.voucherType != 'discAmount'
        ? (this.props.pembayaran.payment * this.props.dataVoucer.voucherValue) /
          100
        : this.props.dataVoucer.voucherValue;
    var redeemPoint =
      this.props.addPoint == undefined ? 0 : this.props.moneyPoint;
    var totalBayar = this.state.totalBayar - (redeemVoucer + redeemPoint);
    this.setState({totalBayar});
  };

  goBack() {
    Actions.popTo('pageIndex');
  }

  btnPayment = () => {
    Actions.paymentSuccess();
  };

  myVouchers = () => {
    var myVoucers = [];
    console.log(this.props.myVoucers);
    if (this.props.myVoucers.data != undefined) {
      _.forEach(
        _.groupBy(
          this.props.myVoucers.data.filter(voucher => voucher.deleted == false),
          'id',
        ),
        function(value, key) {
          value[0].totalRedeem = value.length;
          myVoucers.push(value[0]);
        },
      );
    }

    console.log(myVoucers);

    if (this.props.dataVoucer != undefined) {
      var jumlah = _.find(myVoucers, {id: this.props.dataVoucer.id})
        .totalRedeem;

      var index = _.findIndex(myVoucers, {
        id: this.props.dataVoucer.id,
      });

      _.updateWith(
        myVoucers,
        '[' + index + "]['totalRedeem']",
        _.constant(jumlah - 1),
        Object,
      );
    }

    Actions.paymentAddVoucers({
      data: myVoucers,
      pembayaran: this.props.pembayaran,
    });
  };

  myPoint = () => {
    Actions.paymentAddPoint({
      data: this.props.totalPoint,
      pembayaran: this.props.pembayaran,
      valueSet: this.props.moneyPoint == undefined ? 0 : this.props.moneyPoint,
    });
  };

  onSlideRight = async () => {
    // Actions.paymentSuccess();
    var pembayaran;
    if (
      this.props.dataVoucer == undefined &&
      this.props.addPoint == undefined
    ) {
      pembayaran = {
        price: this.state.totalBayar,
        storeName: this.props.pembayaran.storeName,
        storeId: this.props.pembayaran.storeId,
        paymentType: 'Cash',
        statusAdd: null,
      };
    } else {
      pembayaran = {
        price: this.state.totalBayar,
        storeName: this.props.pembayaran.storeName,
        storeId: this.props.pembayaran.storeId,
        paymentType: 'Cash',
        beforePrice: this.props.pembayaran.payment,
        afterPrice: this.state.totalBayar,
      };

      if (this.props.dataVoucer != undefined) {
        pembayaran.voucherId = this.props.dataVoucer.id;
        pembayaran.statusAdd = 'addVoucer';
      }
      if (this.props.addPoint != undefined) {
        pembayaran.redeemValue = this.props.addPoint;
        pembayaran.statusAdd = 'addPoint';
      }
    }
    console.log(pembayaran, 'pembayaran');
    const response = await this.props.dispatch(sendPayment(pembayaran));
    console.log(response);
    if (response.statusCode != 400) {
      if (response.data.message != 'there`s no running campaign on this date') {
        await this.props.dispatch(campaign());
        await this.props.dispatch(dataPoint());
        Actions.paymentSuccess({dataRespons: response.data});
      } else {
        this.setState({
          showAlert: true,
          pesanAlert: response.data.message,
          titleAlert: 'Payment Error!',
        });
      }
    } else {
      this.setState({
        showAlert: true,
        pesanAlert: 'Request failed',
        titleAlert: 'Payment Error!',
      });
    }
  };

  detailPayment = pembayaran => {
    Actions.paymentDetailItem({pembayaran: pembayaran});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {console.log(this.state.redeemPoint + ' | ' + this.state.redeemVoucer)}
        {console.log(this.props.moneyPoint + ' | ' + this.props.dataVoucer)}
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  margin: 10,
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
                left: -20,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Confirm Payment
              </Text>
            </View>
          </View>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              left: -10,
              marginTop: 30,
              marginBottom: 50,
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 16,
                marginRight: 5,
              }}>
              {appConfig.appMataUang}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 70,
                // fontWeight: 'bold',
              }}>
              {this.props.pembayaran.payment}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
              height: this.state.screenHeight - 250,
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: -30,
                  height: 60,
                  width: this.state.screenWidth - 40,
                  backgroundColor: colorConfig.pageIndex.backgroundColor,
                  borderColor: colorConfig.pageIndex.activeTintColor,
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      margin: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        borderColor: colorConfig.pageIndex.activeTintColor,
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                        paddingTop: 3,
                      }}>
                      <Icon
                        size={20}
                        name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
                        style={{color: colorConfig.pageIndex.activeTintColor}}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: colorConfig.pageIndex.activeTintColor,
                        }}>
                        {appConfig.appName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colorConfig.pageIndex.grayColor,
                        }}>
                        {this.props.pembayaran.storeName}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginRight: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => this.detailPayment(this.props.pembayaran)}>
                    <Text
                      style={{
                        marginRight: 5,
                        color: colorConfig.pageIndex.activeTintColor,
                      }}>
                      Detail
                    </Text>
                    <Icon
                      size={18}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-dropright-circle'
                          : 'md-arrow-dropright-circle'
                      }
                      style={{
                        color: colorConfig.pageIndex.activeTintColor,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 50,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text>Vouchers</Text>
              {this.props.dataVoucer != undefined ? (
                <TouchableOpacity
                  style={styles.btnMethod}
                  onPress={this.myVouchers}>
                  <Image
                    style={{height: 18, width: 23, marginRight: 5}}
                    source={require('../assets/img/voucher.png')}
                  />
                  <Text style={styles.descMethod}>
                    {this.props.dataVoucer.voucherName.substr(0, 13)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnMethod}
                  onPress={this.myVouchers}>
                  <Image
                    style={{height: 18, width: 23, marginRight: 5}}
                    source={require('../assets/img/voucher.png')}
                  />
                  <Text style={styles.descMethod}>Add a Voucher</Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text>Point</Text>
              {this.props.addPoint != undefined ? (
                <TouchableOpacity
                  style={styles.btnMethod}
                  onPress={this.myPoint}>
                  <Image
                    style={{height: 18, width: 23, marginRight: 5}}
                    source={require('../assets/img/ticket.png')}
                  />
                  <Text style={styles.descMethod}>
                    {'- ' + this.props.addPoint + ' Point'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnMethod}
                  onPress={this.myPoint}>
                  <Image
                    style={{height: 18, width: 23, marginRight: 5}}
                    source={require('../assets/img/ticket.png')}
                  />
                  <Text style={styles.descMethod}>Add a Point</Text>
                </TouchableOpacity>
              )}
            </View>
            <RNSlidingButton
              style={{
                backgroundColor: colorConfig.pageIndex.activeTintColor,
                borderRadius: 50,
              }}
              height={50}
              onSlidingSuccess={this.onSlideRight}
              slideDirection={SlideDirection.RIGHT}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    backgroundColor: colorConfig.pageIndex.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    size={25}
                    name={Platform.OS === 'ios' ? 'ios-log-in' : 'md-log-in'}
                    style={{color: colorConfig.pageIndex.activeTintColor}}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: colorConfig.pageIndex.backgroundColor,
                    }}>
                    {'Pay ' +
                      appConfig.appMataUang +
                      ' ' +
                      this.state.totalBayar}
                  </Text>
                </View>
              </View>
            </RNSlidingButton>
          </View>
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={
            this.state.titleAlert == 'Payment Success!' ? 'Oke' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Payment Success!'
              ? Actions.pop()
              : this.hideAlert();
          }}
        />
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
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontWeight: 'bold',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  descItem: {
    color: colorConfig.pageIndex.grayColor,
  },
  itemDetail: {
    marginLeft: 10,
  },
  itemDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineSubtotal: {
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 2,
    top: -2,
  },
  btnMethod: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descMethod: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 12,
  },
});

mapStateToProps = state => ({
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentDetail);